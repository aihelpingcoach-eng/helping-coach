import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Match } from './useMatches';
import {
  LiveEvent,
  LiveEventType,
  LivePlayer,
  LiveState,
  LiveTeam,
  TeamSlot,
  currentPeriod,
  endPeriod,
  gameSeconds,
  initialState,
  minuteOf,
  toggleClock,
} from '../utils/liveMatch';

export type SyncOp =
  | { op: 'insert'; event: LiveEvent }
  | { op: 'delete'; id: string }
  | { op: 'state'; state: LiveState | null };

interface Stored {
  state: LiveState | null;
  events: LiveEvent[];
  queue: SyncOp[];
}

const storageKey = (matchId: string) => `hc-live-match:${matchId}`;

function readStored(matchId: string): Stored | null {
  try {
    const raw = localStorage.getItem(storageKey(matchId));
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStored(matchId: string, data: Stored) {
  try {
    localStorage.setItem(storageKey(matchId), JSON.stringify(data));
  } catch {
    // Sin almacenamiento local (modo privado…): se sigue subiendo directamente
  }
}

function clearStored(matchId: string) {
  try {
    localStorage.removeItem(storageKey(matchId));
  } catch {
    // ignorar
  }
}

/**
 * Une operaciones pendientes: el último estado gana y borrar algo aún no
 * subido lo anula. Lo que ya se está enviando (inFlight) no se puede anular:
 * si se deshace una acción mientras sube, hay que mandar también el borrado
 * (antes se quedaba en la base de datos).
 */
export function enqueue(queue: SyncOp[], op: SyncOp, inFlight: SyncOp | null = null): SyncOp[] {
  if (op.op === 'state') return [...queue.filter(o => o.op !== 'state' || o === inFlight), op];
  if (op.op === 'delete') {
    const pendingInsert = queue.find(o => o.op === 'insert' && o.event.id === op.id && o !== inFlight);
    if (pendingInsert) return queue.filter(o => o !== pendingInsert);
  }
  return [...queue, op];
}

function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Directo de un partido. Todo cambio se guarda al momento en el móvil
 * (localStorage) y se sube en cola a Supabase: si no hay cobertura, se
 * reintenta al volver la conexión. Los ids los genera la app, así que subir
 * dos veces la misma acción no la duplica (upsert).
 */
export function useLiveMatch(match: Match, userId: string | undefined) {
  const [state, setState] = useState<LiveState | null>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [lineups, setLineups] = useState<Record<TeamSlot, string[]>>({ 1: [], 2: [], 3: [] });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(0);
  const queueRef = useRef<SyncOp[]>([]);
  const inFlight = useRef<SyncOp | null>(null);
  const flushing = useRef(false);
  // Valores al día para que dos toques seguidos no partan de un estado viejo
  const latest = useRef<{ state: LiveState | null; events: LiveEvent[] }>({ state: null, events: [] });

  const persist = useCallback(() => {
    writeStored(match.id, { ...latest.current, queue: queueRef.current });
  }, [match.id]);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    try {
      while (queueRef.current.length > 0) {
        const op = queueRef.current[0];
        inFlight.current = op;
        const { error } =
          op.op === 'insert'
            ? await supabase.from('match_events').upsert(op.event)
            : op.op === 'delete'
              ? await supabase.from('match_events').delete().eq('id', op.id)
              : await supabase.from('matches').update({ live_state: op.state }).eq('id', match.id);
        inFlight.current = null;
        if (error) break;
        // Por identidad: mientras se subía pudieron llegar o unirse otras operaciones
        queueRef.current = queueRef.current.filter(o => o !== op);
        persist();
      }
    } finally {
      flushing.current = false;
      setPending(queueRef.current.length);
      const s = latest.current.state;
      if (queueRef.current.length === 0 && (s === null || s.status === 'finished')) clearStored(match.id);
    }
  }, [match.id, persist]);

  // Carga: lo guardado en el móvil manda (puede tener cambios sin subir)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const playersQuery = supabase.from('players').select('id, name, position').order('name');
      const [{ data: playerRows }, { data: formations }] = await Promise.all([
        userId ? playersQuery.eq('user_id', userId) : playersQuery,
        supabase.from('formations').select('id, team_slot').order('created_at', { ascending: false }),
      ]);

      const latestBySlot = new Map<number, string>();
      (formations ?? []).forEach(f => {
        if (!latestBySlot.has(f.team_slot)) latestBySlot.set(f.team_slot, f.id);
      });
      const nextLineups: Record<TeamSlot, string[]> = { 1: [], 2: [], 3: [] };
      if (latestBySlot.size > 0) {
        const { data: links } = await supabase
          .from('formation_players')
          .select('formation_id, player_id, position_index')
          .in('formation_id', [...latestBySlot.values()]);
        latestBySlot.forEach((formationId, slot) => {
          if (slot !== 1 && slot !== 2 && slot !== 3) return;
          nextLineups[slot] = (links ?? [])
            .filter(l => l.formation_id === formationId)
            .sort((a, b) => a.position_index - b.position_index)
            .map(l => l.player_id);
        });
      }

      const stored = readStored(match.id);
      let nextState: LiveState | null;
      let nextEvents: LiveEvent[];
      if (stored) {
        nextState = stored.state;
        nextEvents = stored.events;
        queueRef.current = stored.queue ?? [];
      } else {
        nextState = match.live_state ?? null;
        const { data } = await supabase
          .from('match_events')
          .select('id, match_id, team, event_type, player_id, player_in_id, minute, period, created_at')
          .eq('match_id', match.id)
          .order('created_at');
        nextEvents = (data ?? []) as LiveEvent[];
      }

      if (cancelled) return;
      latest.current = { state: nextState, events: nextEvents };
      setPlayers((playerRows ?? []) as LivePlayer[]);
      setLineups(nextLineups);
      setState(nextState);
      setEvents(nextEvents);
      setPending(queueRef.current.length);
      setLoading(false);
      if (queueRef.current.length > 0) void flush();
    })();
    return () => {
      cancelled = true;
    };
    // Solo al abrir el directo de este partido
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id]);

  // Reintentos: al recuperar la conexión y cada 15 s si queda algo pendiente
  useEffect(() => {
    const retry = () => {
      if (queueRef.current.length > 0) void flush();
    };
    window.addEventListener('online', retry);
    const timer = setInterval(retry, 15_000);
    return () => {
      window.removeEventListener('online', retry);
      clearInterval(timer);
    };
  }, [flush]);

  const commit = (nextState: LiveState | null, nextEvents: LiveEvent[], ops: SyncOp[]) => {
    ops.forEach(op => {
      queueRef.current = enqueue(queueRef.current, op, inFlight.current);
    });
    latest.current = { state: nextState, events: nextEvents };
    setState(nextState);
    setEvents(nextEvents);
    setPending(queueRef.current.length);
    persist();
    void flush();
  };

  const start = (teamSlot: TeamSlot, halfMinutes: number) => {
    const next = toggleClock(initialState(teamSlot, halfMinutes, lineups[teamSlot]));
    commit(next, latest.current.events, [{ op: 'state', state: next }]);
  };

  const toggle = () => {
    const s = latest.current.state;
    if (!s) return;
    const next = toggleClock(s);
    commit(next, latest.current.events, [{ op: 'state', state: next }]);
  };

  /** Descanso en la 1ª parte; final en la 2ª */
  const endHalf = () => {
    const s = latest.current.state;
    if (!s) return;
    const next = endPeriod(s);
    commit(next, latest.current.events, [{ op: 'state', state: next }]);
  };

  const addEvent = (team: LiveTeam, type: LiveEventType, playerId: string | null = null, playerInId: string | null = null) => {
    const s = latest.current.state;
    if (!s || s.status === 'pre') return;
    const event: LiveEvent = {
      id: newId(),
      match_id: match.id,
      team,
      event_type: type,
      player_id: playerId,
      player_in_id: playerInId,
      minute: minuteOf(gameSeconds(s)),
      period: currentPeriod(s),
      created_at: new Date().toISOString(),
    };
    commit(s, [...latest.current.events, event], [{ op: 'insert', event }]);
  };

  const removeEvent = (id: string) => {
    commit(
      latest.current.state,
      latest.current.events.filter(e => e.id !== id),
      [{ op: 'delete', id }]
    );
  };

  const undo = () => {
    const last = latest.current.events[latest.current.events.length - 1];
    if (last) removeEvent(last.id);
  };

  /** Borra el directo entero (por si se empezó por error) */
  const discard = () => {
    commit(
      null,
      [],
      [...latest.current.events.map(e => ({ op: 'delete' as const, id: e.id })), { op: 'state' as const, state: null }]
    );
  };

  return { state, events, players, lineups, loading, pending, start, toggle, endHalf, addEvent, removeEvent, undo, discard };
}
