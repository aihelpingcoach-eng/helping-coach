import { MissionType } from '../types/advancedSystems';

export interface MissionTemplate {
  type: MissionType;
  title: string;
  description: string;
  objective: string;
  target: number;
  reward_xp: number;
  reward_description: string;
}

export const DAILY_MISSIONS: MissionTemplate[] = [
  {
    type: 'tactical',
    title: 'Ajuste Táctico',
    description: 'Realiza cambios tácticos en tu formación',
    objective: 'Cambiar la formación o posición de jugadores',
    target: 1,
    reward_xp: 50,
    reward_description: '+50 XP',
  },
  {
    type: 'training',
    title: 'Sesión de Entrenamiento',
    description: 'Completa una sesión de entrenamiento con tus jugadores',
    objective: 'Realizar un entrenamiento',
    target: 1,
    reward_xp: 50,
    reward_description: '+50 XP',
  },
  {
    type: 'synergy',
    title: 'Mejora la Química',
    description: 'Coloca jugadores con alta sinergia juntos',
    objective: 'Conseguir 3+ sinergias activas',
    target: 3,
    reward_xp: 75,
    reward_description: '+75 XP',
  },
];

export const WEEKLY_MISSIONS: MissionTemplate[] = [
  {
    type: 'management',
    title: 'Gestión sin Lesiones',
    description: 'Completa la semana sin que ningún jugador se lesione',
    objective: 'Evitar lesiones durante 7 días',
    target: 7,
    reward_xp: 200,
    reward_description: '+200 XP + Carta especial',
  },
  {
    type: 'development',
    title: 'Desarrollo de Talento',
    description: 'Mejora el nivel de un jugador joven',
    objective: 'Subir nivel de jugador sub-23',
    target: 1,
    reward_xp: 150,
    reward_description: '+150 XP',
  },
  {
    type: 'tactical',
    title: 'Maestro Táctico',
    description: 'Usa 3 formaciones diferentes esta semana',
    objective: 'Variar formaciones',
    target: 3,
    reward_xp: 150,
    reward_description: '+150 XP',
  },
];

export const SPECIAL_MISSIONS: MissionTemplate[] = [
  {
    type: 'synergy',
    title: 'Química Perfecta',
    description: 'Consigue una alineación con 10+ sinergias activas',
    objective: 'Lograr 10 sinergias simultáneas',
    target: 10,
    reward_xp: 500,
    reward_description: '+500 XP + Desbloqueo especial',
  },
  {
    type: 'management',
    title: 'Temporada Sin Lesiones',
    description: 'Completa 30 días sin lesiones graves',
    objective: 'Gestión perfecta durante un mes',
    target: 30,
    reward_xp: 1000,
    reward_description: '+1000 XP + Título especial',
  },
];
