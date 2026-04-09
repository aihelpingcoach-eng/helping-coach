export const PLAYSTYLE_CATEGORIES = {
  FINISHING: 'Finalización',
  PASSING: 'Pase',
  BALL_CONTROL: 'Control de balón',
  DEFENSE: 'Defensa',
  PHYSICAL: 'Físico',
  GOALKEEPER: 'Portero',
} as const;

export const PLAYSTYLES = {
  FINISHING: [
    'Finesse Shot',
    'Power Shot',
    'Chip Shot',
    'Dead Ball',
    'Precision Header',
    'Acrobatic',
    'Low Driven Shot',
    'Gamechanger',
  ],
  PASSING: [
    'Pinged Pass',
    'Incisive Pass',
    'Long Ball Pass',
    'Tiki Taka',
    'Whipped Pass',
    'Inventive',
  ],
  BALL_CONTROL: [
    'First Touch',
    'Technical',
    'Rapid',
    'Press Proven',
    'Flair',
    'Trickster',
  ],
  DEFENSE: [
    'Block',
    'Intercept',
    'Jockey',
    'Slide Tackle',
    'Anticipate',
    'Aerial Fortress',
  ],
  PHYSICAL: [
    'Quick Step',
    'Relentless',
    'Bruiser',
    'Long Throw',
    'Enforcer',
  ],
  GOALKEEPER: [
    'Footwork',
    'Cross Claimer',
    'Rush Out',
    'Far Throw',
    'Far Reach',
    'Deflector',
  ],
} as const;

export const FORMATIONS = {
  '4-3-3': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 35, y: 45 }, { x: 50, y: 40 }, { x: 65, y: 45 },
    { x: 25, y: 20 }, { x: 50, y: 15 }, { x: 75, y: 20 },
  ],
  '4-3-3 Holding': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 50, y: 50 }, { x: 35, y: 40 }, { x: 65, y: 40 },
    { x: 25, y: 20 }, { x: 50, y: 15 }, { x: 75, y: 20 },
  ],
  '4-3-3 False 9': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 35, y: 45 }, { x: 50, y: 40 }, { x: 65, y: 45 },
    { x: 25, y: 18 }, { x: 50, y: 28 }, { x: 75, y: 18 },
  ],
  '4-3-3 Asimétrica': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 30, y: 48 }, { x: 50, y: 40 }, { x: 70, y: 42 },
    { x: 20, y: 20 }, { x: 50, y: 15 }, { x: 75, y: 22 },
  ],
  '4-4-2': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 20, y: 45 }, { x: 40, y: 40 }, { x: 60, y: 40 }, { x: 80, y: 45 },
    { x: 40, y: 15 }, { x: 60, y: 15 },
  ],
  '4-2-3-1': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 40, y: 45 }, { x: 60, y: 45 },
    { x: 30, y: 30 }, { x: 50, y: 25 }, { x: 70, y: 30 },
    { x: 50, y: 10 },
  ],
  '4-1-4-1': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 50, y: 52 },
    { x: 25, y: 38 }, { x: 40, y: 35 }, { x: 60, y: 35 }, { x: 75, y: 38 },
    { x: 50, y: 12 },
  ],
  '4-3-1-2': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 35, y: 48 }, { x: 50, y: 42 }, { x: 65, y: 48 },
    { x: 50, y: 28 },
    { x: 40, y: 12 }, { x: 60, y: 12 },
  ],
  '4-5-1': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 20, y: 45 }, { x: 35, y: 38 }, { x: 50, y: 35 }, { x: 65, y: 38 }, { x: 80, y: 45 },
    { x: 50, y: 12 },
  ],
  '3-5-2': [
    { x: 50, y: 90 },
    { x: 30, y: 70 }, { x: 50, y: 65 }, { x: 70, y: 70 },
    { x: 20, y: 50 }, { x: 35, y: 45 }, { x: 50, y: 40 }, { x: 65, y: 45 }, { x: 80, y: 50 },
    { x: 40, y: 15 }, { x: 60, y: 15 },
  ],
  '3-4-3': [
    { x: 50, y: 90 },
    { x: 30, y: 70 }, { x: 50, y: 65 }, { x: 70, y: 70 },
    { x: 25, y: 45 }, { x: 42, y: 40 }, { x: 58, y: 40 }, { x: 75, y: 45 },
    { x: 25, y: 18 }, { x: 50, y: 12 }, { x: 75, y: 18 },
  ],
  '3-4-2-1': [
    { x: 50, y: 90 },
    { x: 30, y: 70 }, { x: 50, y: 65 }, { x: 70, y: 70 },
    { x: 25, y: 48 }, { x: 42, y: 42 }, { x: 58, y: 42 }, { x: 75, y: 48 },
    { x: 38, y: 28 }, { x: 62, y: 28 },
    { x: 50, y: 10 },
  ],
  '3-2-4-1': [
    { x: 50, y: 90 },
    { x: 30, y: 70 }, { x: 50, y: 65 }, { x: 70, y: 70 },
    { x: 38, y: 50 }, { x: 62, y: 50 },
    { x: 20, y: 32 }, { x: 40, y: 28 }, { x: 60, y: 28 }, { x: 80, y: 32 },
    { x: 50, y: 10 },
  ],
  '5-4-1': [
    { x: 50, y: 90 },
    { x: 15, y: 72 }, { x: 32, y: 68 }, { x: 50, y: 65 }, { x: 68, y: 68 }, { x: 85, y: 72 },
    { x: 25, y: 42 }, { x: 42, y: 38 }, { x: 58, y: 38 }, { x: 75, y: 42 },
    { x: 50, y: 12 },
  ],
  '5-3-2': [
    { x: 50, y: 90 },
    { x: 15, y: 72 }, { x: 32, y: 68 }, { x: 50, y: 65 }, { x: 68, y: 68 }, { x: 85, y: 72 },
    { x: 35, y: 42 }, { x: 50, y: 38 }, { x: 65, y: 42 },
    { x: 40, y: 15 }, { x: 60, y: 15 },
  ],
  '4-2-4': [
    { x: 50, y: 90 },
    { x: 20, y: 70 }, { x: 40, y: 65 }, { x: 60, y: 65 }, { x: 80, y: 70 },
    { x: 40, y: 48 }, { x: 60, y: 48 },
    { x: 20, y: 22 }, { x: 40, y: 18 }, { x: 60, y: 18 }, { x: 80, y: 22 },
  ],
  '2-3-5': [
    { x: 50, y: 90 },
    { x: 35, y: 72 }, { x: 65, y: 72 },
    { x: 30, y: 52 }, { x: 50, y: 48 }, { x: 70, y: 52 },
    { x: 15, y: 25 }, { x: 32, y: 20 }, { x: 50, y: 15 }, { x: 68, y: 20 }, { x: 85, y: 25 },
  ],
  'WM': [
    { x: 50, y: 90 },
    { x: 25, y: 70 }, { x: 50, y: 68 }, { x: 75, y: 70 },
    { x: 35, y: 50 }, { x: 65, y: 50 },
    { x: 25, y: 32 }, { x: 75, y: 32 },
    { x: 30, y: 15 }, { x: 50, y: 12 }, { x: 70, y: 15 },
  ],
} as const;

export type FormationType = keyof typeof FORMATIONS;
export type PlaystyleCategory = typeof PLAYSTYLE_CATEGORIES[keyof typeof PLAYSTYLE_CATEGORIES];

export interface Player {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  playstyle?: string;
  playstyle_category?: string;
  playstyle_explanation?: string;
  position?: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  name: string;
  formation_type: FormationType;
  is_active: boolean;
  created_at: string;
}

export interface FormationPlayer {
  id: string;
  formation_id: string;
  player_id: string;
  position_index: number;
  created_at: string;
  player?: Player;
}
