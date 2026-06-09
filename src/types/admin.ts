export interface AdminStats {
  totalUsers: number;
  newToday: number;
  totalExercises: number;
  totalInjuries: number;
}

export interface RecentUser {
  user_id: string;
  coach_name: string;
  created_at: string;
}

export interface ExerciseFormData {
  name: string;
  description: string;
  duration: string;
  benefit: string;
  illustration: string;
  category: string;
  image_url: string;
}

export interface InjuryFormData {
  slug: string;
  category_id: string;
  name: string;
  what_is: string;
  how_it_happens: string;
  treatment: string;
  prevention: string;
}

export interface InjuryCategoryFormData {
  slug: string;
  name: string;
  icon: string;
  color: string;
}
