import { supabase } from '../lib/supabase';
import { getRankByXP, XP_REWARDS } from '../constants/progression';

interface XPResult {
  success: boolean;
  newTotalXP: number;
  rankUp: boolean;
  newRank?: string;
  xpGained: number;
}

export async function awardXP(
  userId: string,
  actionKey: keyof typeof XP_REWARDS
): Promise<XPResult> {
  const reward = XP_REWARDS[actionKey];
  if (!reward) {
    return {
      success: false,
      newTotalXP: 0,
      rankUp: false,
      xpGained: 0,
    };
  }

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('coach_profiles')
      .select('total_xp, rank')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError || !profile) {
      console.error('Error fetching profile for XP award:', fetchError);
      return {
        success: false,
        newTotalXP: 0,
        rankUp: false,
        xpGained: 0,
      };
    }

    const oldTotalXP = profile.total_xp || 0;
    const oldRank = getRankByXP(oldTotalXP);
    const newTotalXP = oldTotalXP + reward.xp;
    const newRank = getRankByXP(newTotalXP);

    const rankUp = oldRank.id !== newRank.id;

    const { error: updateError } = await supabase
      .from('coach_profiles')
      .update({
        total_xp: newTotalXP,
        rank: newRank.name,
        current_rank_xp: newTotalXP - newRank.xpRequired,
        unlocked_features: newRank.unlocks,
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating XP:', updateError);
      return {
        success: false,
        newTotalXP: oldTotalXP,
        rankUp: false,
        xpGained: 0,
      };
    }

    return {
      success: true,
      newTotalXP,
      rankUp,
      newRank: rankUp ? newRank.name : undefined,
      xpGained: reward.xp,
    };
  } catch (error) {
    console.error('Error in awardXP:', error);
    return {
      success: false,
      newTotalXP: 0,
      rankUp: false,
      xpGained: 0,
    };
  }
}

export async function getCoachProgression(userId: string) {
  try {
    const { data, error } = await supabase
      .from('coach_profiles')
      .select('total_xp, rank, unlocked_features')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      totalXP: data.total_xp || 0,
      rank: data.rank || 'Aspirante',
      unlockedFeatures: data.unlocked_features || [],
    };
  } catch (error) {
    console.error('Error fetching progression:', error);
    return null;
  }
}

export function hasFeatureUnlocked(
  unlockedFeatures: string[],
  featureId: string
): boolean {
  return unlockedFeatures.includes(featureId) || unlockedFeatures.includes('all_features');
}
