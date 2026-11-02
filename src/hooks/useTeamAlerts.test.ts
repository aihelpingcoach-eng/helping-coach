import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../lib/supabase', () => ({ supabase: {} }));

import { matchAlerts, playersRequired, trainingAlert } from './useTeamAlerts';
import type { Match } from './useMatches';
import type { TrainingSession } from './useTrainingSessions';

const match = (over: Partial<Match>): Match => ({
  id: 'm1',
  user_id: 'u',
  opponent: 'Rival FC',
  date: '2026-11-03',
  time: '18:30:00',
  location: '',
  competition: 'Liga',
  result: null,
  score_for: null,
  score_against: null,
  notes: '',
  created_at: '',
  ...over,
});

const session = (over: Partial<TrainingSession>): TrainingSession => ({
  id: 's1',
  user_id: 'u',
  name: 'Sesión',
  date: '2026-10-01',
  category: 'fuerza',
  exercise_ids: [],
  completed: true,
  completed_at: '2026-10-01T10:00:00Z',
  notes: '',
  created_at: '',
  ...over,
});

describe('useTeamAlerts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-03T12:00:00'));
  });
  afterEach(() => vi.useRealTimers());

  it('calcula los jugadores que pide la formación (más el portero)', () => {
    expect(playersRequired('4-3-3')).toBe(11);
    expect(playersRequired('4-2-3-1')).toBe(11);
  });

  it('avisa del próximo partido si es en 3 días o menos', () => {
    const [today] = matchAlerts([match({ date: '2026-11-03' })]);
    expect(today.title).toBe('Partido contra Rival FC hoy');
    expect(matchAlerts([match({ date: '2026-11-04' })])[0].title).toContain('mañana');
    expect(matchAlerts([match({ date: '2026-11-06' })])[0].title).toContain('en 3 días');
    expect(matchAlerts([match({ date: '2026-11-07' })])).toHaveLength(0);
  });

  it('avisa de partidos pasados sin resultado y no de los que ya lo tienen', () => {
    const alerts = matchAlerts([
      match({ id: 'a', date: '2026-10-20', opponent: 'A' }),
      match({ id: 'b', date: '2026-10-27', opponent: 'B', result: 'win', score_for: 2, score_against: 0 }),
    ]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].kind).toBe('missing_result');
    expect(alerts[0].title).toBe('Falta el resultado contra A');
  });

  it('avisa si hace 7 días o más del último entrenamiento completado', () => {
    expect(trainingAlert([session({ completed_at: '2026-10-20T10:00:00' })])?.title).toBe(
      'Llevas 14 días sin completar un entrenamiento'
    );
    expect(trainingAlert([session({ completed_at: '2026-11-01T10:00:00' })])).toBeNull();
  });

  it('no avisa de entrenamientos si nunca se ha completado ninguno', () => {
    expect(trainingAlert([session({ completed: false, completed_at: null })])).toBeNull();
    expect(trainingAlert([])).toBeNull();
  });
});
