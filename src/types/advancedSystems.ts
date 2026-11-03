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
