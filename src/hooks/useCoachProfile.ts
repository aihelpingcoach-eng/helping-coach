import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CoachProfile {
  id: string;
  user_id: string;
  coach_name: string;
  team_name: string;
  profile_photo: string;
  age: number | null;
  country: string;
  years_experience: number | null;
  coaching_style: string;
  favorite_formation: string;
  coach_level: string;
  team_objective: string;
  language: string;
  theme: string;
  plan: 'free' | 'pro';
  stripe_customer_id: string | null;
  plan_expires_at: string | null;
}

export function useCoachProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading coach profile:', error);
        setLoading(false);
        return;
      }

      if (!data) {
        const coachName = user.user_metadata?.coach_name || user.email?.split('@')[0] || 'Coach';
        const { data: newProfile, error: createError } = await supabase
          .from('coach_profiles')
          .insert({
            user_id: user.id,
            coach_name: coachName,
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error('Error creating coach profile:', createError);
        } else {
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading coach profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<CoachProfile>) => {
    if (!user || !profile) return;
    const { data, error } = await supabase
      .from('coach_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();
    if (!error && data) setProfile(data);
  };

  return { profile, loading, updateProfile };
}
