export interface Rank {
  id: string;
  name: string;
  xpRequired: number;
  color: string;
  icon: string;
  unlocks: string[];
  description: string;
}

export const RANKS: Rank[] = [
  {
    id: 'aspirante',
    name: 'Aspirante',
    xpRequired: 0,
    color: 'from-gray-500 to-gray-600',
    icon: '⚪',
    unlocks: ['basic_formations', 'basic_playstyles'],
    description: 'Primer paso en tu carrera como entrenador',
  },
  {
    id: 'entrenador_base',
    name: 'Entrenador Base',
    xpRequired: 500,
    color: 'from-green-500 to-green-600',
    icon: '🟢',
    unlocks: ['advanced_formations', 'tactical_recommendations'],
    description: 'Dominas los fundamentos del fútbol',
  },
  {
    id: 'entrenador_tactico',
    name: 'Entrenador Táctico',
    xpRequired: 1500,
    color: 'from-blue-500 to-blue-600',
    icon: '🔵',
    unlocks: ['synergy_analysis', 'ai_detailed_reports'],
    description: 'Comprendes las complejidades tácticas',
  },
  {
    id: 'entrenador_avanzado',
    name: 'Entrenador Avanzado',
    xpRequired: 3000,
    color: 'from-purple-500 to-purple-600',
    icon: '🟣',
    unlocks: ['playstyle_plus', 'custom_training'],
    description: 'Tu conocimiento táctico es excepcional',
  },
  {
    id: 'entrenador_elite',
    name: 'Entrenador Élite',
    xpRequired: 5000,
    color: 'from-yellow-500 to-orange-500',
    icon: '🟠',
    unlocks: ['advanced_ai_analysis', 'elite_formations'],
    description: 'Estás entre los mejores entrenadores',
  },
  {
    id: 'director_tecnico',
    name: 'Director Técnico',
    xpRequired: 8000,
    color: 'from-red-500 to-pink-500',
    icon: '🔴',
    unlocks: ['full_tactical_control', 'masterclass_training'],
    description: 'Líderas equipos con maestría',
  },
  {
    id: 'maestro_del_juego',
    name: 'Maestro del Juego',
    xpRequired: 12000,
    color: 'from-indigo-500 to-purple-600',
    icon: '🟣',
    unlocks: ['legendary_insights', 'profile_customization'],
    description: 'Tu visión del juego es legendaria',
  },
  {
    id: 'legendario',
    name: 'Legendario',
    xpRequired: 20000,
    color: 'from-yellow-400 via-orange-500 to-red-500',
    icon: '⭐',
    unlocks: ['all_features'],
    description: 'Has alcanzado la cima del entrenamiento',
  },
];

export interface XPReward {
  action: string;
  xp: number;
  description: string;
}

export const XP_REWARDS: { [key: string]: XPReward } = {
  CREATE_LINEUP: {
    action: 'create_lineup',
    xp: 50,
    description: 'Crear y guardar una alineación',
  },
  ADD_PLAYER: {
    action: 'add_player',
    xp: 30,
    description: 'Añadir un jugador al equipo',
  },
  GREEN_SYNERGY: {
    action: 'green_synergy',
    xp: 20,
    description: 'Conseguir sinergia verde',
  },
  PURPLE_SYNERGY: {
    action: 'purple_synergy',
    xp: 50,
    description: 'Conseguir sinergia púrpura',
  },
  USE_TRAINING: {
    action: 'use_training',
    xp: 25,
    description: 'Consultar entrenamientos',
  },
  CONSULT_AI: {
    action: 'consult_ai',
    xp: 15,
    description: 'Consultar a los coaches IA',
  },
  COMPLETE_PROFILE: {
    action: 'complete_profile',
    xp: 100,
    description: 'Completar tu perfil',
  },
  UPDATE_FORMATION: {
    action: 'update_formation',
    xp: 20,
    description: 'Actualizar formación',
  },
  REGISTER_MATCH: {
    action: 'register_match',
    xp: 30,
    description: 'Registrar resultado de partido',
  },
  EVALUATE_PLAYER: {
    action: 'evaluate_player',
    xp: 10,
    description: 'Evaluar progreso de jugador',
  },
};

export function getRankByXP(totalXP: number): Rank {
  let currentRank = RANKS[0];

  for (const rank of RANKS) {
    if (totalXP >= rank.xpRequired) {
      currentRank = rank;
    } else {
      break;
    }
  }

  return currentRank;
}

export function getNextRank(currentRankId: string): Rank | null {
  const currentIndex = RANKS.findIndex(r => r.id === currentRankId);
  if (currentIndex === -1 || currentIndex === RANKS.length - 1) {
    return null;
  }
  return RANKS[currentIndex + 1];
}

export function getXPProgress(totalXP: number): {
  currentRank: Rank;
  nextRank: Rank | null;
  currentRankXP: number;
  xpForNextRank: number;
  progress: number;
} {
  const currentRank = getRankByXP(totalXP);
  const nextRank = getNextRank(currentRank.id);

  const currentRankXP = totalXP - currentRank.xpRequired;
  const xpForNextRank = nextRank ? nextRank.xpRequired - currentRank.xpRequired : 0;
  const progress = xpForNextRank > 0 ? (currentRankXP / xpForNextRank) * 100 : 100;

  return {
    currentRank,
    nextRank,
    currentRankXP,
    xpForNextRank,
    progress,
  };
}

// Re-exports for the 20-level system
export type { Level } from './levels';
export { LEVELS, LEVEL_THRESHOLDS, getLevelByXP, getNextLevel, getLevelProgress, getTierForLevel } from './levels';
