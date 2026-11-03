import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LiveEvent, LiveState, minutesPlayed } from '../utils/liveMatch';
import type { AppMode } from './BottomNav';

const DAYS = 7;

interface PlayerLoad {
  id: string;
  name: string;
  position: string;
  minutes: number;
  matches: number;
}

interface MinutesPlayedPanelProps {
  userId: string;
  onNavigate?: (mode: AppMode) => void;
}

/**
 * "Carga": minutos jugados por jugador en los partidos registrados en directo
 * durante los últimos 7 días. Vuelve a Avanzado ahora que hay datos reales
 * (antes leía weekly_workload, que nada rellenaba).
 */
export default function MinutesPlayedPanel({ userId, onNavigate }: MinutesPlayedPanelProps) {
  const [rows, setRows] = useState<PlayerLoad[] | null>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [maxMinutes, setMaxMinutes] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - (DAYS - 1));
      const { data: matches } = await supabase
        .from('matches')
        .select('id, live_state')
        .eq('user_id', userId)
        .gte('date', since.toISOString().slice(0, 10))
        .not('live_state', 'is', null);

      const tracked = (matches ?? []).filter(m => (m.live_state as LiveState | null)?.status === 'finished');
      if (tracked.length === 0) {
        if (!cancelled) setRows([]);
        return;
      }

      const [{ data: events }, { data: players }] = await Promise.all([
        supabase
          .from('match_events')
          .select('id, match_id, team, event_type, player_id, player_in_id, minute, period, created_at')
          .in('match_id', tracked.map(m => m.id))
          .order('created_at'),
        supabase.from('players').select('id, name, position').eq('user_id', userId),
      ]);

      const totals = new Map<string, { minutes: number; matches: number }>();
      let possible = 0;
      tracked.forEach(m => {
        const state = m.live_state as LiveState;
        possible += Math.floor((state.final_seconds ?? state.half_minutes * 120) / 60);
        const matchEvents = ((events ?? []) as LiveEvent[]).filter(e => e.match_id === m.id);
        minutesPlayed(state, matchEvents).forEach((min, playerId) => {
          const t = totals.get(playerId) ?? { minutes: 0, matches: 0 };
          totals.set(playerId, { minutes: t.minutes + min, matches: t.matches + (min > 0 ? 1 : 0) });
        });
      });

      const list = [...totals.entries()]
        .map(([id, t]) => {
          const p = (players ?? []).find(x => x.id === id);
          return { id, name: p?.name ?? 'Jugador', position: p?.position ?? '', ...t };
        })
        .filter(r => r.minutes > 0)
        .sort((a, b) => b.minutes - a.minutes);

      if (!cancelled) {
        setRows(list);
        setMatchCount(tracked.length);
        setMaxMinutes(possible);
      }
    })().catch(() => {
      if (!cancelled) setRows([]);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (rows === null) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-4 space-y-3">
        <p className="text-sm text-gray-400">
          Aquí verás los minutos de cada jugador en los últimos {DAYS} días. Salen de los partidos que registres en directo.
        </p>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('calendar')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-300 hover:text-purple-200"
          >
            <Radio size={14} />
            Registrar un partido en directo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">
        {matchCount === 1 ? '1 partido' : `${matchCount} partidos`} registrados en directo en los últimos {DAYS} días · máximo
        posible: {maxMinutes}′
      </p>
      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-white font-semibold">
                {r.name}
                {r.position && <span className="text-gray-500 font-normal"> · {r.position}</span>}
              </span>
              <span className="flex-shrink-0 tabular-nums text-purple-200 font-bold">
                {r.minutes}′ <span className="text-gray-500 font-normal text-xs">({r.matches} {r.matches === 1 ? 'partido' : 'partidos'})</span>
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div className="h-full rounded-full bg-purple-400" style={{ width: `${maxMinutes ? Math.min(100, (r.minutes / maxMinutes) * 100) : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
