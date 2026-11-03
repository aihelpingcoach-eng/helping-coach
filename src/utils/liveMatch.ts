// Lógica del directo de partido, sin React ni Supabase: reloj, marcador,
// minutos jugados y crónica. Todo se calcula a partir del estado guardado
// (matches.live_state) y de las acciones (match_events).

export type LiveTeam = 'own' | 'rival';
export type LiveEventType =
  | 'goal'
  | 'shot_on'
  | 'shot_off'
  | 'corner'
  | 'throw_in'
  | 'foul'
  | 'offside'
  | 'yellow'
  | 'red'
  | 'sub';
export type LiveStatus = 'pre' | 'first' | 'half_time' | 'second' | 'finished';
export type TeamSlot = 1 | 2 | 3;

export interface LiveState {
  status: LiveStatus;
  half_minutes: number;
  team_slot: TeamSlot;
  /** Once inicial (ids de players) */
  starters: string[];
  /** Tiempo acumulado de la parte en curso, sin el tramo que está corriendo */
  elapsed_ms: number;
  /** Desde cuándo corre el reloj (ISO); null si está parado */
  running_since: string | null;
  /** Segundo de juego en el que terminó la 1ª parte (incluye el añadido) */
  half_time_seconds?: number;
  /** Segundo de juego en el que terminó el partido */
  final_seconds?: number;
}

export interface LiveEvent {
  id: string;
  match_id: string;
  team: LiveTeam;
  event_type: LiveEventType;
  player_id: string | null;
  player_in_id: string | null;
  minute: number;
  period: 1 | 2;
  created_at: string;
}

export interface LivePlayer {
  id: string;
  name: string;
  position: string;
}

export interface LiveAction {
  type: LiveEventType;
  label: string;
  /** Solo en tu equipo: pide jugador (se puede dejar "sin jugador") */
  needsPlayer: boolean;
  ownOnly?: boolean;
}

export const LIVE_ACTIONS: LiveAction[] = [
  { type: 'goal', label: 'Gol', needsPlayer: true },
  { type: 'shot_on', label: 'Tiro a puerta', needsPlayer: true },
  { type: 'shot_off', label: 'Tiro fuera', needsPlayer: true },
  { type: 'corner', label: 'Córner', needsPlayer: false },
  { type: 'throw_in', label: 'Saque de banda', needsPlayer: false },
  { type: 'foul', label: 'Falta', needsPlayer: false },
  { type: 'offside', label: 'Fuera de juego', needsPlayer: false },
  { type: 'yellow', label: 'Amarilla', needsPlayer: true },
  { type: 'red', label: 'Roja', needsPlayer: true },
  { type: 'sub', label: 'Cambio', needsPlayer: true, ownOnly: true },
];

export const ACTION_LABEL = Object.fromEntries(LIVE_ACTIONS.map(a => [a.type, a.label])) as Record<LiveEventType, string>;

export const HALF_OPTIONS = [45, 40, 35, 30, 25];

export function initialState(teamSlot: TeamSlot, halfMinutes: number, starters: string[]): LiveState {
  return {
    status: 'pre',
    half_minutes: halfMinutes,
    team_slot: teamSlot,
    starters,
    elapsed_ms: 0,
    running_since: null,
  };
}

export function isRunning(s: LiveState) {
  return s.running_since !== null;
}

function elapsedMs(s: LiveState, now: number) {
  return s.elapsed_ms + (s.running_since ? Math.max(0, now - Date.parse(s.running_since)) : 0);
}

/** Segundo de juego (la 2ª parte empieza en el minuto de una parte, p. ej. 45:00) */
export function gameSeconds(s: LiveState, now = Date.now()): number {
  switch (s.status) {
    case 'pre':
      return 0;
    case 'first':
      return Math.floor(elapsedMs(s, now) / 1000);
    case 'half_time':
      return s.half_time_seconds ?? s.half_minutes * 60;
    case 'second':
      return s.half_minutes * 60 + Math.floor(elapsedMs(s, now) / 1000);
    case 'finished':
      return s.final_seconds ?? s.half_minutes * 120;
  }
}

/** Minuto futbolístico: de 0:00 a 0:59 es el minuto 1 */
export function minuteOf(seconds: number) {
  return Math.floor(seconds / 60) + 1;
}

export function clockText(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export const STATUS_LABEL: Record<LiveStatus, string> = {
  pre: 'Sin empezar',
  first: '1ª parte',
  half_time: 'Descanso',
  second: '2ª parte',
  finished: 'Final',
};

/** Botón principal: empezar, pausar, seguir o empezar la 2ª parte */
export function toggleClock(s: LiveState, now = Date.now()): LiveState {
  const iso = new Date(now).toISOString();
  if (s.status === 'pre') return { ...s, status: 'first', elapsed_ms: 0, running_since: iso };
  if (s.status === 'half_time') return { ...s, status: 'second', elapsed_ms: 0, running_since: iso };
  if (s.status === 'finished') return s;
  if (s.running_since) return { ...s, elapsed_ms: elapsedMs(s, now), running_since: null };
  return { ...s, running_since: iso };
}

/** Fin de la 1ª parte (descanso) o del partido */
export function endPeriod(s: LiveState, now = Date.now()): LiveState {
  if (s.status === 'first') {
    return { ...s, status: 'half_time', half_time_seconds: gameSeconds(s, now), elapsed_ms: 0, running_since: null };
  }
  if (s.status === 'second') {
    return { ...s, status: 'finished', final_seconds: gameSeconds(s, now), elapsed_ms: elapsedMs(s, now), running_since: null };
  }
  return s;
}

export function currentPeriod(s: LiveState): 1 | 2 {
  return s.status === 'second' || s.status === 'finished' ? 2 : 1;
}

export function countOf(events: LiveEvent[], team: LiveTeam, type: LiveEventType) {
  return events.filter(e => e.team === team && e.event_type === type).length;
}

export function score(events: LiveEvent[]): [number, number] {
  return [countOf(events, 'own', 'goal'), countOf(events, 'rival', 'goal')];
}

/** Roja directa o segunda amarilla. Devuelve el minuto de la expulsión o null */
export function sentOffMinute(events: LiveEvent[], playerId: string): number | null {
  let yellows = 0;
  for (const e of events) {
    if (e.team !== 'own' || e.player_id !== playerId) continue;
    if (e.event_type === 'red') return e.minute;
    if (e.event_type === 'yellow' && ++yellows === 2) return e.minute;
  }
  return null;
}

/** Quién está en el campo ahora: el once, con los cambios aplicados en orden */
export function playersOnField(starters: string[], events: LiveEvent[]): string[] {
  let field = [...starters];
  events
    .filter(e => e.team === 'own' && e.event_type === 'sub' && e.player_id && e.player_in_id)
    .forEach(e => {
      field = field.map(id => (id === e.player_id ? (e.player_in_id as string) : id));
    });
  return field;
}

/** Minutos jugados por jugador (incluye a los que entraron desde el banquillo) */
export function minutesPlayed(s: LiveState, events: LiveEvent[], now = Date.now()): Map<string, number> {
  const endMinute = Math.floor(gameSeconds(s, now) / 60);
  const entered = new Map<string, number>(s.starters.map(id => [id, 0]));
  const left = new Map<string, number>();

  events
    .filter(e => e.team === 'own' && e.event_type === 'sub' && e.player_id && e.player_in_id)
    .forEach(e => {
      left.set(e.player_id as string, e.minute);
      entered.set(e.player_in_id as string, e.minute);
    });

  const result = new Map<string, number>();
  entered.forEach((from, id) => {
    const sentOff = sentOffMinute(events, id);
    const until = Math.min(left.get(id) ?? endMinute, sentOff ?? endMinute);
    result.set(id, Math.max(0, until - from));
  });
  return result;
}

const RESULT_LABEL = { win: 'Victoria', draw: 'Empate', loss: 'Derrota' } as const;

export function resultOf(events: LiveEvent[]): 'win' | 'draw' | 'loss' {
  const [own, rival] = score(events);
  return own > rival ? 'win' : own < rival ? 'loss' : 'draw';
}

interface ChronicleInput {
  teamName: string;
  opponent: string;
  competition?: string;
  date?: string;
  location?: string;
  state: LiveState;
  events: LiveEvent[];
  players: LivePlayer[];
}

function pad(text: string, width: number) {
  return text.length >= width ? text.slice(0, width) : text + ' '.repeat(width - text.length);
}

/** Crónica en texto plano para descargar */
export function chronicleText({ teamName, opponent, competition, date, location, state, events, players }: ChronicleInput) {
  const name = (id: string | null) => (id ? players.find(p => p.id === id)?.name ?? 'Jugador' : '');
  const [own, rival] = score(events);
  const dateText = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const lines: string[] = [];
  lines.push('CRÓNICA DEL PARTIDO', '');
  lines.push(`${teamName} ${own} - ${rival} ${opponent}`);
  if (state.status === 'finished') lines.push(RESULT_LABEL[resultOf(events)]);
  lines.push([competition, dateText, location].filter(Boolean).join(' · '));
  lines.push(`Partes de ${state.half_minutes} minutos`, '');

  const describe = (e: LiveEvent) => {
    const team = e.team === 'own' ? teamName : opponent;
    if (e.event_type === 'sub') return `${team}: cambio — sale ${name(e.player_id)}, entra ${name(e.player_in_id)}`;
    const who = e.player_id ? ` — ${name(e.player_id)}` : '';
    return `${team}: ${ACTION_LABEL[e.event_type]}${who}`;
  };

  ([1, 2] as const).forEach(period => {
    const list = events.filter(e => e.period === period);
    lines.push(period === 1 ? 'PRIMERA PARTE' : 'SEGUNDA PARTE');
    if (list.length === 0) lines.push('  Sin acciones apuntadas');
    list.forEach(e => lines.push(`  ${pad(`${e.minute}'`, 5)}${describe(e)}`));
    lines.push('');
  });

  lines.push('ESTADÍSTICAS');
  lines.push(`  ${pad('', 18)}${pad(teamName, 14)}${opponent}`);
  LIVE_ACTIONS.filter(a => !a.ownOnly).forEach(a => {
    lines.push(`  ${pad(a.label, 18)}${pad(String(countOf(events, 'own', a.type)), 14)}${countOf(events, 'rival', a.type)}`);
  });
  lines.push('');

  const minutes = [...minutesPlayed(state, events).entries()].sort((a, b) => b[1] - a[1]);
  if (minutes.length > 0) {
    lines.push('MINUTOS JUGADOS');
    minutes.forEach(([id, min]) => {
      const p = players.find(x => x.id === id);
      lines.push(`  ${pad(`${p?.name ?? 'Jugador'}${p?.position ? ` (${p.position})` : ''}`, 32)}${min}'`);
    });
    lines.push('');
  }

  lines.push('Generado con Helping Coach');
  return lines.join('\n');
}
