import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Goal,
  Crosshair,
  MoveUpRight,
  Flag,
  FlagTriangleRight,
  Hand,
  Ban,
  ArrowLeftRight,
  Undo2,
  Download,
  CloudOff,
  Check,
  ChevronDown,
  Play,
  Pause,
  Trash2,
  Timer,
} from 'lucide-react';
import { Match } from '../../hooks/useMatches';
import { useLiveMatch } from '../../hooks/useLiveMatch';
import { downloadTextFile } from '../../utils/exportReport';
import {
  ACTION_LABEL,
  HALF_OPTIONS,
  LIVE_ACTIONS,
  LiveEvent,
  LiveEventType,
  LiveTeam,
  STATUS_LABEL,
  TeamSlot,
  chronicleText,
  clockText,
  countOf,
  gameSeconds,
  isRunning,
  minutesPlayed,
  playersOnField,
  resultOf,
  score,
  sentOffMinute,
} from '../../utils/liveMatch';

interface LiveMatchTrackerProps {
  match: Match;
  teamName: string;
  userId: string | undefined;
  onClose: () => void;
  /** Al terminar (o al corregir después): guarda el resultado en el partido */
  onFinished: (scoreFor: number, scoreAgainst: number) => void;
}

type Sheet = { kind: 'player'; type: LiveEventType } | { kind: 'subOut' } | { kind: 'subIn'; out: string } | null;

const ICONS: Partial<Record<LiveEventType, typeof Goal>> = {
  goal: Goal,
  shot_on: Crosshair,
  shot_off: MoveUpRight,
  corner: Flag,
  throw_in: Hand,
  foul: Ban,
  offside: FlagTriangleRight,
  sub: ArrowLeftRight,
};

function ActionIcon({ type, size = 16 }: { type: LiveEventType; size?: number }) {
  if (type === 'yellow') return <span className="inline-block w-3 h-4 rounded-[3px] bg-yellow-400" aria-hidden="true" />;
  if (type === 'red') return <span className="inline-block w-3 h-4 rounded-[3px] bg-red-500" aria-hidden="true" />;
  const Icon = ICONS[type] ?? Flag;
  return <Icon size={size} aria-hidden="true" />;
}

const RESULT_LABEL = { win: 'Victoria', draw: 'Empate', loss: 'Derrota' } as const;

// Se pinta en <body> con un portal: dentro del contenedor de la app (relative
// z-10) la barra inferior, que está fuera, quedaría por encima del directo.
export default function LiveMatchTracker(props: LiveMatchTrackerProps) {
  return createPortal(<LiveMatchTrackerContent {...props} />, document.body);
}

function LiveMatchTrackerContent({ match, teamName, userId, onClose, onFinished }: LiveMatchTrackerProps) {
  const live = useLiveMatch(match, userId);
  const { state, events, players } = live;
  const [, setTick] = useState(0);
  const [slot, setSlot] = useState<TeamSlot>(1);
  const [halfMinutes, setHalfMinutes] = useState(45);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [showChronicle, setShowChronicle] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  // El reloj se repinta solo; el estado guardado no cambia con cada segundo
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Por defecto, el primer equipo que tenga alineación en Tácticas
  useEffect(() => {
    if (live.loading) return;
    const first = ([1, 2, 3] as const).find(s => live.lineups[s].length > 0);
    if (first) setSlot(first);
  }, [live.loading, live.lineups]);

  // Pantalla encendida mientras corre el reloj (si el navegador lo permite)
  const runningSince = state?.running_since ?? null;
  useEffect(() => {
    if (!runningSince || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock
      .request('screen')
      .then(l => {
        lock = l;
      })
      .catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, [runningSince]);

  // Al terminar, o si se corrige la crónica después, se guarda el resultado
  const finishedScore = state?.status === 'finished' ? score(events).join('-') : null;
  useEffect(() => {
    if (!finishedScore) return;
    const [own, rival] = finishedScore.split('-').map(Number);
    if (match.result && match.score_for === own && match.score_against === rival) return;
    onFinishedRef.current(own, rival);
  }, [finishedScore, match.result, match.score_for, match.score_against]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (sheet) setSheet(null);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheet, onClose]);

  // Confirmaciones de dos toques: se cancelan solas a los 3 s
  useEffect(() => {
    if (!confirm) return;
    const t = setTimeout(() => setConfirm(null), 3000);
    return () => clearTimeout(t);
  }, [confirm]);

  const nameOf = (id: string | null) => (id ? players.find(p => p.id === id)?.name ?? 'Jugador' : '');
  const positionOf = (id: string) => players.find(p => p.id === id)?.position ?? '';
  const describe = (e: LiveEvent) =>
    e.event_type === 'sub'
      ? `Cambio: sale ${nameOf(e.player_id)}, entra ${nameOf(e.player_in_id)}`
      : `${ACTION_LABEL[e.event_type]}${e.player_id ? ` · ${nameOf(e.player_id)}` : ''}`;

  const download = () => {
    if (!state) return;
    const text = chronicleText({
      teamName,
      opponent: match.opponent,
      competition: match.competition,
      date: match.date,
      location: match.location,
      state,
      events,
      players,
    });
    const rival = match.opponent.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    downloadTextFile(text, `cronica-${rival || 'partido'}-${match.date}.txt`);
  };

  const twoTap = (key: string, action: () => void) => {
    if (confirm === key) {
      setConfirm(null);
      action();
    } else {
      setConfirm(key);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-gray-950 via-[#120a1f] to-black text-white"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <header className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Salir del directo"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center flex-shrink-0"
        >
          <X size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">vs {match.opponent}</p>
          <p className="text-xs text-gray-400 truncate">
            {[match.competition, new Date(`${match.date}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
        {state && state.status !== 'pre' && (
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 ${live.pending > 0 ? 'text-amber-300' : 'text-gray-400'}`}
            aria-live="polite"
          >
            {live.pending > 0 ? <CloudOff size={14} /> : <Check size={14} />}
            {live.pending > 0 ? `${live.pending} sin subir` : 'Guardado'}
          </span>
        )}
      </header>
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">{children}</div>
    </div>
  );

  if (live.loading) {
    return shell(
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------- Antes de empezar ---------- */
  if (!state || state.status === 'pre') {
    const starters = live.lineups[slot];
    return shell(
      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Registrar en directo</h2>
          <p className="text-sm text-gray-400 mt-1">
            Apunta lo que pasa en el partido. Al terminar, el resultado se guarda solo con los goles apuntados.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-bold">Once inicial</h3>
            <div className="flex gap-1 bg-black/30 rounded-xl p-1" role="group" aria-label="Equipo">
              {([1, 2, 3] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={slot === s}
                  onClick={() => setSlot(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${slot === s ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                >
                  Equipo {s}
                </button>
              ))}
            </div>
          </div>
          {starters.length > 0 ? (
            <>
              <p className="text-xs text-gray-400">
                {starters.length} jugadores de tu alineación de Tácticas. Los demás quedan en el banquillo.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {starters.map(id => (
                  <li key={id} className="text-xs bg-purple-600/20 text-purple-100 rounded-full px-2.5 py-1">
                    {nameOf(id)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-amber-200/90">
              Este equipo no tiene alineación. Puedes hacerla en Tácticas o empezar igualmente: se apuntarán las acciones,
              pero no se podrán calcular los minutos de los titulares.
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
          <h3 className="font-bold">Duración de cada parte</h3>
          <div className="grid grid-cols-5 gap-1.5" role="group" aria-label="Minutos por parte">
            {HALF_OPTIONS.map(m => (
              <button
                key={m}
                type="button"
                aria-pressed={halfMinutes === m}
                onClick={() => setHalfMinutes(m)}
                className={`py-2.5 rounded-xl text-sm font-bold ${
                  halfMinutes === m ? 'bg-purple-600 text-white' : 'bg-black/30 text-gray-300'
                }`}
              >
                {m}′
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => live.start(slot, halfMinutes)}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl text-lg font-bold"
        >
          <Play size={20} />
          Empezar partido
        </button>
      </div>
    );
  }

  /* ---------- Durante y después del partido ---------- */
  const seconds = gameSeconds(state);
  const [own, rival] = score(events);
  const finished = state.status === 'finished';
  const field = state.starters.length > 0 ? playersOnField(state.starters, events) : players.map(p => p.id);
  const isOff = (id: string) => sentOffMinute(events, id) !== null;
  const last = events[events.length - 1];

  const tapAction = (team: LiveTeam, type: LiveEventType) => {
    const action = LIVE_ACTIONS.find(a => a.type === type);
    if (team === 'rival' || !action?.needsPlayer) return live.addEvent(team, type);
    setSheet(type === 'sub' ? { kind: 'subOut' } : { kind: 'player', type });
  };

  const column = (team: LiveTeam) => (
    <div className="space-y-1.5 min-w-0">
      <p
        className={`text-center text-[11px] font-bold uppercase tracking-wide rounded-lg py-1 truncate ${
          team === 'own' ? 'bg-purple-600/25 text-purple-200' : 'bg-amber-500/15 text-amber-200'
        }`}
      >
        {team === 'own' ? teamName : match.opponent}
      </p>
      {LIVE_ACTIONS.filter(a => team === 'own' || !a.ownOnly).map(a => {
        const n = countOf(events, team, a.type);
        return (
          <button
            key={a.type}
            type="button"
            onClick={() => tapAction(team, a.type)}
            aria-label={`${a.label}, ${team === 'own' ? teamName : match.opponent}: ${n}`}
            className="w-full h-12 flex items-center gap-2 px-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-[0.97] transition-transform motion-reduce:transition-none text-left"
          >
            <span className="w-4 flex justify-center text-gray-300">
              <ActionIcon type={a.type} />
            </span>
            <span className="flex-1 min-w-0 truncate text-sm font-semibold">{a.label}</span>
            {(a.type !== 'sub' || n > 0) && (
              <span className={`text-lg font-bold tabular-nums ${team === 'own' ? 'text-purple-300' : 'text-amber-300'}`}>{n}</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const minutes = [...minutesPlayed(state, events).entries()].sort((a, b) => b[1] - a[1]);

  const sheetPlayers = (() => {
    if (!sheet) return [];
    if (sheet.kind === 'subIn') return players.map(p => p.id).filter(id => !field.includes(id) && !isOff(id));
    return field;
  })();

  const pick = (id: string | null) => {
    if (!sheet) return;
    if (sheet.kind === 'player') live.addEvent('own', sheet.type, id);
    else if (sheet.kind === 'subOut' && id) return setSheet({ kind: 'subIn', out: id });
    else if (sheet.kind === 'subIn' && id) live.addEvent('own', 'sub', sheet.out, id);
    setSheet(null);
  };

  const sheetTitle = !sheet
    ? ''
    : sheet.kind === 'player'
      ? `${ACTION_LABEL[sheet.type]} · ¿quién ha sido?`
      : sheet.kind === 'subOut'
        ? 'Cambio · ¿quién sale?'
        : `Sale ${nameOf(sheet.out)} · ¿quién entra?`;

  return (
    <>
      {shell(
        <div className="max-w-lg mx-auto space-y-3">
          {/* Marcador y reloj */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-3">
            <div className="text-center min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-purple-200/80 truncate">{teamName}</p>
              <p className="text-5xl font-bold text-purple-300 tabular-nums leading-none mt-1">{own}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold tabular-nums leading-none" aria-live="off">
                {clockText(seconds)}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                <Timer size={12} />
                {STATUS_LABEL[state.status]}
                {state.status !== 'half_time' && !finished && !isRunning(state) && ' · en pausa'}
              </p>
              {!finished && (
                <div className="flex gap-1.5 mt-2 justify-center">
                  {state.status === 'half_time' ? (
                    <button type="button" onClick={live.toggle} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Play size={13} />
                      2ª parte
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={live.toggle}
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-full text-xs font-bold"
                      >
                        {isRunning(state) ? <Pause size={13} /> : <Play size={13} />}
                        {isRunning(state) ? 'Pausar' : 'Seguir'}
                      </button>
                      <button
                        type="button"
                        onClick={() => twoTap('end', live.endHalf)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          confirm === 'end' ? 'bg-red-600 text-white' : 'bg-red-500/15 text-red-200'
                        }`}
                      >
                        {confirm === 'end' ? '¿Seguro?' : state.status === 'first' ? 'Descanso' : 'Final'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="text-center min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/80 truncate">{match.opponent}</p>
              <p className="text-5xl font-bold text-amber-300 tabular-nums leading-none mt-1">{rival}</p>
            </div>
          </div>

          {finished ? (
            <section className="rounded-3xl border border-purple-500/30 bg-purple-900/20 p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-300">Partido terminado</p>
                <p className="text-3xl font-bold">
                  {own}-{rival} · {RESULT_LABEL[resultOf(events)]}
                </p>
                <p className="text-xs text-gray-400 mt-1">El resultado ya está guardado en el partido.</p>
              </div>
              {minutes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-1.5">Minutos jugados</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {minutes.map(([id, min]) => (
                      <li key={id} className="flex justify-between gap-2 text-sm">
                        <span className="truncate text-gray-300">{nameOf(id)}</span>
                        <span className="font-bold tabular-nums text-purple-300">{min}′</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {column('own')}
              {column('rival')}
            </div>
          )}

          {/* Última acción */}
          {!finished && (
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="flex-1 min-w-0 truncate text-sm text-gray-300">
                {last ? `${last.minute}′ · ${last.team === 'own' ? teamName : match.opponent} · ${describe(last)}` : 'Aún no hay acciones'}
              </span>
              <button
                type="button"
                onClick={live.undo}
                disabled={!last}
                className="flex items-center gap-1 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1.5 text-xs font-bold disabled:opacity-40"
              >
                <Undo2 size={13} />
                Deshacer
              </button>
            </div>
          )}

          {/* Crónica plegable: para revisar, corregir y descargar */}
          <section className="rounded-3xl border border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => setShowChronicle(v => !v)}
              aria-expanded={showChronicle || finished}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 font-bold"
            >
              Crónica ({events.length})
              <ChevronDown size={18} className={`transition-transform ${showChronicle || finished ? 'rotate-180' : ''}`} />
            </button>
            {(showChronicle || finished) && (
              <div className="px-3 pb-3 space-y-2">
                {events.length === 0 ? (
                  <p className="text-sm text-gray-400 px-1">Aquí aparecerá todo lo que apuntes, minuto a minuto.</p>
                ) : (
                  <ol className="space-y-1">
                    {[...events].reverse().map(e => (
                      <li key={e.id} className="flex items-center gap-2 rounded-xl bg-black/20 px-2.5 py-1.5 text-sm">
                        <span className="w-9 flex-shrink-0 text-right font-bold tabular-nums text-gray-400">{e.minute}′</span>
                        <span
                          className={`w-1 self-stretch rounded-full ${e.team === 'own' ? 'bg-purple-400' : 'bg-amber-400'}`}
                          aria-label={e.team === 'own' ? teamName : match.opponent}
                        />
                        <ActionIcon type={e.event_type} size={14} />
                        <span className="flex-1 min-w-0 truncate">{describe(e)}</span>
                        <button
                          type="button"
                          onClick={() => twoTap(`del-${e.id}`, () => live.removeEvent(e.id))}
                          aria-label="Borrar acción"
                          className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                            confirm === `del-${e.id}` ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-red-300'
                          }`}
                        >
                          {confirm === `del-${e.id}` ? 'Borrar' : <Trash2 size={14} />}
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
                <button
                  type="button"
                  onClick={download}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 py-3 font-bold"
                >
                  <Download size={16} />
                  Descargar crónica
                </button>
              </div>
            )}
          </section>

          {finished ? (
            <button type="button" onClick={onClose} className="w-full rounded-2xl bg-white/10 hover:bg-white/15 py-3 font-bold">
              Cerrar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => twoTap('discard', live.discard)}
              className={`w-full text-xs font-semibold py-2 ${confirm === 'discard' ? 'text-red-300' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {confirm === 'discard' ? 'Toca otra vez para borrar todo el directo' : 'Descartar el directo'}
            </button>
          )}
        </div>
      )}

      {sheet && (
        <div className="fixed inset-0 z-[61] flex items-end justify-center bg-black/60" onClick={() => setSheet(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sheetTitle}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-purple-500/30 bg-gradient-to-b from-gray-900 to-black px-4 pt-3"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/20" aria-hidden="true" />
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-bold text-white">{sheetTitle}</h2>
              <button
                type="button"
                onClick={() => setSheet(null)}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
            {sheetPlayers.length === 0 ? (
              <p className="text-sm text-gray-400 mb-3">
                {sheet.kind === 'subIn' ? 'No quedan jugadores en el banquillo.' : 'No hay jugadores en el campo.'}
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-2 mb-3">
                {sheetPlayers.map(id => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => pick(id)}
                      disabled={sheet.kind === 'player' && isOff(id)}
                      className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2.5 disabled:opacity-35"
                    >
                      <span className="block text-sm font-semibold text-white truncate">{nameOf(id)}</span>
                      <span className="block text-[11px] text-gray-400 truncate">
                        {isOff(id) ? 'Expulsado' : positionOf(id) || ' '}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {sheet.kind === 'player' && (
              <button
                type="button"
                onClick={() => pick(null)}
                className="w-full rounded-2xl bg-white/10 hover:bg-white/15 py-3 text-sm font-bold text-white"
              >
                Sin jugador
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
