import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type RankingScope = 'weekly' | 'global';

export const RANKING_SOURCE = {
  weekly: { view: 'coach_rankings_weekly', xpColumn: 'weekly_xp' },
  global: { view: 'coach_rankings', xpColumn: 'total_xp' },
} as const;

interface RankingPosition {
  /** Puesto real (1 = primero). null si no apareces en esa clasificación */
  position: number | null;
  xp: number;
  loading: boolean;
  /** La vista no existe todavía (falta ejecutar la migración) */
  unavailable: boolean;
}

/**
 * Puesto del usuario aunque esté fuera de los 100 primeros que carga la
 * lista: cuenta cuántos entrenadores visibles tienen más XP.
 */
export function useRankingPosition(userId: string | undefined, scope: RankingScope) {
  const [state, setState] = useState<RankingPosition>({ position: null, xp: 0, loading: true, unavailable: false });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const { view, xpColumn } = RANKING_SOURCE[scope];
    setState(s => ({ ...s, loading: true }));

    (async () => {
      const { data: mine, error } = await supabase.from(view).select(xpColumn).eq('user_id', userId).maybeSingle();
      if (cancelled) return;
      if (error) {
        setState({ position: null, xp: 0, loading: false, unavailable: true });
        return;
      }
      const xp = mine ? (mine as Record<string, number>)[xpColumn] ?? 0 : 0;
      if (!mine) {
        setState({ position: null, xp: 0, loading: false, unavailable: false });
        return;
      }
      const { count } = await supabase.from(view).select('user_id', { count: 'exact', head: true }).gt(xpColumn, xp);
      if (!cancelled) setState({ position: (count ?? 0) + 1, xp, loading: false, unavailable: false });
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, scope]);

  return state;
}
