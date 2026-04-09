import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { awardXP } from '../utils/progression';
import { XP_REWARDS, Rank, getRankByXP } from '../constants/progression';
import { supabase } from '../lib/supabase';

export function useXP() {
  const { user } = useAuth();
  const [showRankUpModal, setShowRankUpModal] = useState(false);
  const [newRank, setNewRank] = useState<Rank | null>(null);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (user) {
      loadTotalXP();
    }
  }, [user]);

  const loadTotalXP = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('total_xp')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setTotalXP(data.total_xp || 0);
      }
    } catch (error) {
      console.error('Error loading total XP:', error);
    }
  };

  const giveXP = async (actionKey: keyof typeof XP_REWARDS) => {
    if (!user) return;

    const result = await awardXP(user.id, actionKey);

    if (result.success && result.rankUp && result.newRank) {
      const rankData = getRankByXP(result.newTotalXP);
      setNewRank(rankData);
      setShowRankUpModal(true);
    }

    await loadTotalXP();
  };

  const closeRankUpModal = () => {
    setShowRankUpModal(false);
    setNewRank(null);
  };

  return {
    giveXP,
    showRankUpModal,
    newRank,
    closeRankUpModal,
    totalXP,
  };
}
