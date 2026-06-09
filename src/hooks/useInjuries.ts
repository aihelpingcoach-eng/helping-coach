import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface InjuryRow {
  id: string;
  slug: string;
  name: string;
  what_is: string;
  how_it_happens: string;
  treatment: string;
  prevention: string;
}

export interface InjuryCategoryRow {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  injuries: InjuryRow[];
}

export function useInjuryCategories(refreshKey = 0) {
  const [categories, setCategories] = useState<InjuryCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('injury_categories')
      .select('id, slug, name, icon, color, injuries(id, slug, name, what_is, how_it_happens, treatment, prevention)')
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) setCategories(data as InjuryCategoryRow[]);
        setLoading(false);
      });
  }, [refreshKey]);

  return { categories, loading };
}
