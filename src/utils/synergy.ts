import { Player, PLAYSTYLE_CATEGORIES } from '../constants/playstyles';

export type SynergyLevel = 'poor' | 'medium' | 'good' | 'excellent';

export function calculateSynergy(player1: Player, player2: Player): SynergyLevel {
  if (!player1.playstyle_category || !player2.playstyle_category) {
    return 'poor';
  }

  const synergyMap: Record<string, string[]> = {
    [PLAYSTYLE_CATEGORIES.FINISHING]: [
      PLAYSTYLE_CATEGORIES.PASSING,
      PLAYSTYLE_CATEGORIES.BALL_CONTROL,
    ],
    [PLAYSTYLE_CATEGORIES.PASSING]: [
      PLAYSTYLE_CATEGORIES.FINISHING,
      PLAYSTYLE_CATEGORIES.BALL_CONTROL,
      PLAYSTYLE_CATEGORIES.DEFENSE,
    ],
    [PLAYSTYLE_CATEGORIES.BALL_CONTROL]: [
      PLAYSTYLE_CATEGORIES.PASSING,
      PLAYSTYLE_CATEGORIES.FINISHING,
    ],
    [PLAYSTYLE_CATEGORIES.DEFENSE]: [
      PLAYSTYLE_CATEGORIES.PHYSICAL,
      PLAYSTYLE_CATEGORIES.PASSING,
    ],
    [PLAYSTYLE_CATEGORIES.PHYSICAL]: [
      PLAYSTYLE_CATEGORIES.DEFENSE,
      PLAYSTYLE_CATEGORIES.BALL_CONTROL,
    ],
    [PLAYSTYLE_CATEGORIES.GOALKEEPER]: [
      PLAYSTYLE_CATEGORIES.DEFENSE,
    ],
  };

  if (player1.playstyle_category === player2.playstyle_category) {
    return 'excellent';
  }

  const goodSynergies = synergyMap[player1.playstyle_category] || [];
  if (goodSynergies.includes(player2.playstyle_category)) {
    const excellentCombos = [
      [PLAYSTYLE_CATEGORIES.PASSING, PLAYSTYLE_CATEGORIES.BALL_CONTROL],
      [PLAYSTYLE_CATEGORIES.DEFENSE, PLAYSTYLE_CATEGORIES.PHYSICAL],
      [PLAYSTYLE_CATEGORIES.FINISHING, PLAYSTYLE_CATEGORIES.PASSING],
    ];

    const isExcellent = excellentCombos.some(combo =>
      (combo[0] === player1.playstyle_category && combo[1] === player2.playstyle_category) ||
      (combo[1] === player1.playstyle_category && combo[0] === player2.playstyle_category)
    );

    return isExcellent ? 'excellent' : 'good';
  }

  const mediumSynergies = [
    [PLAYSTYLE_CATEGORIES.FINISHING, PLAYSTYLE_CATEGORIES.PHYSICAL],
    [PLAYSTYLE_CATEGORIES.DEFENSE, PLAYSTYLE_CATEGORIES.BALL_CONTROL],
  ];

  const isMedium = mediumSynergies.some(combo =>
    (combo[0] === player1.playstyle_category && combo[1] === player2.playstyle_category) ||
    (combo[1] === player1.playstyle_category && combo[0] === player2.playstyle_category)
  );

  return isMedium ? 'medium' : 'poor';
}

export function getSynergyColor(level: SynergyLevel): string {
  switch (level) {
    case 'excellent':
      return '#9333EA';
    case 'good':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'poor':
      return '#EAB308';
  }
}
