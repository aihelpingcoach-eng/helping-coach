import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProgressEntry {
  id: string;
  created_at: string;
  level_change: number;
  level_after: number | null;
  swipe_direction: string;
}

export function usePlayerHistory(playerId: string | null) {
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) { setHistory([]); return; }
    setLoading(true);
    supabase
      .from('player_progress')
      .select('id, created_at, level_change, level_after, swipe_direction')
      .eq('player_id', playerId)
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setHistory(data as ProgressEntry[]);
        setLoading(false);
      });
  }, [playerId]);

  return { history, loading };
}
