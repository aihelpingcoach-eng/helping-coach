import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Match {
  id: string;
  user_id: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  result: 'win' | 'draw' | 'loss' | null;
  score_for: number | null;
  score_against: number | null;
  notes: string;
  created_at: string;
}

export interface CreateMatchPayload {
  opponent: string;
  date: string;
  time?: string;
  location?: string;
  competition?: string;
  notes?: string;
}

export function useMatches(userId: string | undefined) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    if (!userId) { setMatches([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    if (!error && data) setMatches(data as Match[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const createMatch = async (payload: CreateMatchPayload): Promise<Match | null> => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('matches')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (!error && data) {
      await fetchMatches();
      return data as Match;
    }
    return null;
  };

  const updateMatch = async (matchId: string, updates: Partial<Match>): Promise<boolean> => {
    const { error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId);
    if (!error) await fetchMatches();
    return !error;
  };

  const deleteMatch = async (matchId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    if (!error) await fetchMatches();
    return !error;
  };

  return { matches, loading, createMatch, updateMatch, deleteMatch, refresh: fetchMatches };
}
