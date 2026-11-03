import { describe, it, expect, vi } from 'vitest';

vi.mock('../lib/supabase', () => ({ supabase: {} }));

import { enqueue, SyncOp } from './useLiveMatch';
import type { LiveEvent, LiveState } from '../utils/liveMatch';

const event = (id: string): LiveEvent => ({
  id,
  match_id: 'm',
  team: 'rival',
  event_type: 'throw_in',
  player_id: null,
  player_in_id: null,
  minute: 1,
  period: 1,
  created_at: '',
});

const state = (status: LiveState['status']): LiveState => ({
  status,
  half_minutes: 45,
  team_slot: 1,
  starters: [],
  elapsed_ms: 0,
  running_since: null,
});

describe('useLiveMatch: cola de sincronización', () => {
  it('deshacer una acción que aún no se ha subido la anula sin mandar nada', () => {
    const insert: SyncOp = { op: 'insert', event: event('a') };
    expect(enqueue([insert], { op: 'delete', id: 'a' })).toEqual([]);
  });

  it('deshacer una acción que se está subiendo manda también el borrado', () => {
    const insert: SyncOp = { op: 'insert', event: event('a') };
    const queue = enqueue([insert], { op: 'delete', id: 'a' }, insert);
    expect(queue).toEqual([insert, { op: 'delete', id: 'a' }]);
  });

  it('solo se guarda el último estado del reloj', () => {
    const queue = enqueue([{ op: 'state', state: state('first') }], { op: 'state', state: state('half_time') });
    expect(queue).toEqual([{ op: 'state', state: state('half_time') }]);
  });
});
