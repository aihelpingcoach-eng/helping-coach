import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TrainingSession {
  id: string;
  user_id: string;
  name: string;
  date: string;
  category: string;
  exercise_ids: string[];
  completed: boolean;
  completed_at: string | null;
  notes: string;
  created_at: string;
}

export interface CreateSessionPayload {
  name: string;
  category: string;
  exercise_ids: string[];
  notes?: string;
}

export function useTrainingSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error && data) setSessions(data as TrainingSession[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const createSession = async (payload: CreateSessionPayload): Promise<TrainingSession | null> => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('training_sessions')
      .insert({ ...payload, user_id: userId, notes: payload.notes ?? '' })
      .select()
      .single();
    if (error || !data) return null;
    const session = data as TrainingSession;
    setSessions(prev => [session, ...prev]);
    return session;
  };

  const completeSession = async (sessionId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('training_sessions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', sessionId);
    if (error) return false;
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, completed: true, completed_at: new Date().toISOString() } : s)
    );
    return true;
  };

  const deleteSession = async (sessionId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', sessionId);
    if (error) return false;
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    return true;
  };

  return { sessions, loading, createSession, completeSession, deleteSession, refresh: fetchSessions };
}
