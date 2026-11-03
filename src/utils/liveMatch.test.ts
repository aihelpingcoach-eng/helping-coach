import { describe, it, expect } from 'vitest';
import {
  initialState,
  toggleClock,
  endPeriod,
  gameSeconds,
  minuteOf,
  clockText,
  score,
  minutesPlayed,
  playersOnField,
  sentOffMinute,
  chronicleText,
  LiveEvent,
  LiveEventType,
  LiveTeam,
} from './liveMatch';

const T0 = Date.parse('2026-11-03T18:00:00Z');
const min = (n: number) => n * 60_000;
const starters = ['p1', 'p2', 'p3'];

let seq = 0;
const ev = (team: LiveTeam, type: LiveEventType, minute: number, player: string | null = null, playerIn: string | null = null, period: 1 | 2 = 1): LiveEvent => ({
  id: `e${++seq}`,
  match_id: 'm',
  team,
  event_type: type,
  player_id: player,
  player_in_id: playerIn,
  minute,
  period,
  created_at: '',
});

describe('liveMatch: reloj', () => {
  it('cuenta la 1ª parte, se para y sigue', () => {
    let s = toggleClock(initialState(1, 45, starters), T0);
    expect(s.status).toBe('first');
    expect(gameSeconds(s, T0 + min(10))).toBe(600);
    s = toggleClock(s, T0 + min(10)); // pausa
    expect(gameSeconds(s, T0 + min(20))).toBe(600);
    s = toggleClock(s, T0 + min(20)); // sigue
    expect(gameSeconds(s, T0 + min(25))).toBe(900);
  });

  it('la 2ª parte empieza en el minuto de una parte y el descanso guarda el añadido', () => {
    let s = toggleClock(initialState(1, 40, starters), T0);
    s = endPeriod(s, T0 + min(42));
    expect(s.status).toBe('half_time');
    expect(clockText(gameSeconds(s))).toBe('42:00');
    s = toggleClock(s, T0 + min(60));
    expect(gameSeconds(s, T0 + min(70))).toBe(50 * 60);
    s = endPeriod(s, T0 + min(101));
    expect(s.status).toBe('finished');
    expect(gameSeconds(s, T0 + min(500))).toBe(81 * 60);
  });

  it('el minuto futbolístico empieza en 1', () => {
    expect(minuteOf(0)).toBe(1);
    expect(minuteOf(59)).toBe(1);
    expect(minuteOf(60)).toBe(2);
  });
});

describe('liveMatch: partido', () => {
  it('suma goles de cada equipo', () => {
    expect(score([ev('own', 'goal', 3), ev('rival', 'goal', 10), ev('own', 'goal', 50, 'p1', null, 2)])).toEqual([2, 1]);
  });

  it('aplica los cambios al once', () => {
    expect(playersOnField(starters, [ev('own', 'sub', 60, 'p2', 'b1', 2)])).toEqual(['p1', 'b1', 'p3']);
  });

  it('detecta la expulsión por roja o por segunda amarilla', () => {
    expect(sentOffMinute([ev('own', 'red', 30, 'p1')], 'p1')).toBe(30);
    expect(sentOffMinute([ev('own', 'yellow', 20, 'p2'), ev('own', 'yellow', 70, 'p2', null, 2)], 'p2')).toBe(70);
    expect(sentOffMinute([ev('own', 'yellow', 20, 'p3')], 'p3')).toBeNull();
  });

  it('calcula los minutos con cambios y expulsiones', () => {
    let s = toggleClock(initialState(1, 45, starters), T0);
    s = endPeriod(s, T0 + min(45));
    s = toggleClock(s, T0 + min(60));
    s = endPeriod(s, T0 + min(105)); // final en el 90
    const minutes = minutesPlayed(s, [ev('own', 'sub', 60, 'p2', 'b1', 2), ev('own', 'red', 75, 'p3', null, 2)]);
    expect(minutes.get('p1')).toBe(90);
    expect(minutes.get('p2')).toBe(60);
    expect(minutes.get('b1')).toBe(30);
    expect(minutes.get('p3')).toBe(75);
  });

  it('escribe la crónica con resultado, acciones por parte y minutos', () => {
    let s = toggleClock(initialState(1, 45, starters), T0);
    s = endPeriod(s, T0 + min(45));
    s = toggleClock(s, T0 + min(60));
    s = endPeriod(s, T0 + min(105));
    const text = chronicleText({
      teamName: 'Mi Equipo',
      opponent: 'Rival FC',
      competition: 'Liga',
      date: '2026-11-03',
      state: s,
      events: [ev('own', 'goal', 12, 'p1'), ev('rival', 'corner', 30)],
      players: [{ id: 'p1', name: 'Ana López', position: 'Delantero centro' }],
    });
    expect(text).toContain('Mi Equipo 1 - 0 Rival FC');
    expect(text).toContain('Victoria');
    expect(text).toContain("12'  Mi Equipo: Gol — Ana López");
    expect(text).toContain('Rival FC: Córner');
    expect(text).toContain('MINUTOS JUGADOS');
  });
});
