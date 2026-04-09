export type AlertType = 'warning' | 'critical' | 'info' | 'success';
export type AlertCategory = 'defensive' | 'offensive' | 'synergy' | 'injury' | 'tactical';

export interface TacticalAlert {
  id: string;
  coach_id: string;
  alert_type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  severity: 1 | 2 | 3 | 4;
  is_active: boolean;
  created_at: string;
}

export type CardType = 'improvement' | 'decline' | 'tactical_conflict' | 'chemistry' | 'medical_alert' | 'streak' | 'demotivated';

export interface EventCard {
  id: string;
  coach_id: string;
  card_type: CardType;
  player_id?: string;
  title: string;
  narrative: string;
  effect: string;
  requires_decision: boolean;
  is_resolved: boolean;
  created_at: string;
  expires_at?: string;
}

export type FatigueLevel = 'optimal' | 'light_fatigue' | 'high_fatigue' | 'injury_risk';

export interface WeeklyWorkload {
  id: string;
  coach_id: string;
  player_id: string;
  week_number: number;
  training_load: number;
  match_minutes: number;
  fatigue_level: FatigueLevel;
  recommendation: string;
  created_at: string;
}

export type MissionType = 'tactical' | 'synergy' | 'training' | 'management' | 'development';
export type MissionFrequency = 'daily' | 'weekly' | 'special';

export interface CoachMission {
  id: string;
  coach_id: string;
  mission_type: MissionType;
  frequency: MissionFrequency;
  title: string;
  description: string;
  objective: string;
  progress: number;
  target: number;
  reward_xp: number;
  reward_description: string;
  is_completed: boolean;
  expires_at?: string;
  created_at: string;
}

export interface CoachCareer {
  id: string;
  coach_id: string;
  coaching_style: string;
  reputation: number;
  total_xp: number;
  current_rank: string;
  matches_managed: number;
  tactical_decisions: number;
  missions_completed: number;
  created_at: string;
  updated_at: string;
}

export const COACH_RANKS = [
  { id: 'amateur', name: 'Entrenador Amateur', minXP: 0, color: 'from-gray-500 to-gray-600' },
  { id: 'regional', name: 'Entrenador Regional', minXP: 1000, color: 'from-green-500 to-green-600' },
  { id: 'professional', name: 'Entrenador Profesional', minXP: 3000, color: 'from-blue-500 to-blue-600' },
  { id: 'elite', name: 'Entrenador Élite', minXP: 7000, color: 'from-purple-500 to-purple-600' },
  { id: 'legendary', name: 'Entrenador Legendario', minXP: 15000, color: 'from-yellow-500 to-orange-600' },
];
