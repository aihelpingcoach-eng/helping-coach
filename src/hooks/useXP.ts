import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { awardXP } from '../utils/progression';
import { XP_REWARDS } from '../constants/progression';
import { getLevelByXP, getLevelProgress, Level } from '../constants/levels';
import { supabase } from '../lib/supabase';

export function useXP() {
  const { user } = useAuth();
  const [totalXP, setTotalXP] = useState(0);

  // Level-up state
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  useEffect(() => {
    if (user) loadTotalXP();
  }, [user]);

  const loadTotalXP = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('total_xp')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!error && data) setTotalXP(data.total_xp || 0);
    } catch {
      // silent
    }
  };

  const giveXP = async (actionKey: keyof typeof XP_REWARDS) => {
    if (!user) return;
    const oldXP = totalXP; // capture BEFORE await to avoid stale comparison
    const result = await awardXP(user.id, actionKey);
    if (result.success) {
      const oldLvl = getLevelByXP(oldXP).level;
      const newLvl = getLevelByXP(result.newTotalXP).level;
      if (newLvl > oldLvl) {
        setNewLevel(newLvl);
        setShowLevelUpModal(true);
      }
      await loadTotalXP();
    }
  };

  const closeLevelUpModal = () => setShowLevelUpModal(false);

  const currentLevel: Level = getLevelByXP(totalXP);
  const levelProgress = getLevelProgress(totalXP);

  return {
    giveXP,
    totalXP,
    showLevelUpModal,
    newLevel,
    closeLevelUpModal,
    currentLevel,
    levelProgress,
  };
}
