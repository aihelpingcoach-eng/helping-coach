import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrainingCategory } from '../constants/training';

export interface ExerciseRow {
  id: string;
  name: string;
  description: string;
  duration: string;
  benefit: string;
  illustration: string;
  category: string;
  image_url: string | null;
}

export function useExercises(category: TrainingCategory) {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    supabase
      .from('exercises')
      .select('id, name, description, duration, benefit, illustration, category, image_url')
      .eq('category', category)
      .order('name')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setExercises(data);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category]);

  return { exercises, loading };
}
