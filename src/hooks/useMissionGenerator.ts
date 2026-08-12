import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Match } from './useMatches';
import { TrainingSession } from './useTrainingSessions';
import { MissionType, MissionFrequency } from '../types/advancedSystems';

interface MissionTemplate {
  mission_type: MissionType;
  frequency: MissionFrequency;
  title: string;
  description: string;
  objective: string;
  target: number;
  reward_description: string;
  computeProgress: (stats: Stats) => number;
}

interface Stats {
  playerCount: number;
  matchesPlayed: number;
  matchesWithResult: number;
  sessionsThisWeek: number;
}

const REWARD_XP = 50;

const TEMPLATES: MissionTemplate[] = [
  {
    mission_type: 'tactical',
    frequency: 'special',
    title: 'Arma tu plantilla',
    description: 'Añade jugadores a tu equipo para poder crear alineaciones completas.',
    objective: 'Añadir 5 jugadores',
    target: 5,
    reward_description: 'Desbloquea análisis de sinergias',
    computeProgress: (s) => Math.min(s.playerCount, 5),
  },
  {
    mission_type: 'tactical',
    frequency: 'weekly',
    title: 'Plantilla titular completa',
    description: 'Ten al menos 11 jugadores disponibles para completar una alineación titular.',
    objective: 'Llegar a 11 jugadores',
    target: 11,
    reward_description: 'Coach más experimentado',
    computeProgress: (s) => Math.min(s.playerCount, 11),
  },
  {
    mission_type: 'management',
    frequency: 'special',
    title: 'Debut oficial',
    description: 'Registra tu primer partido para empezar a llevar el historial del equipo.',
    objective: 'Registrar 1 partido',
    target: 1,
    reward_description: 'Desbloquea estadísticas de equipo',
    computeProgress: (s) => Math.min(s.matchesPlayed, 1),
  },
  {
    mission_type: 'management',
    frequency: 'weekly',
    title: 'Analista de resultados',
    description: 'Registra el resultado de tus partidos para llevar un seguimiento real del rendimiento.',
    objective: 'Registrar 3 resultados',
    target: 3,
    reward_description: 'Mejor análisis de rendimiento',
    computeProgress: (s) => Math.min(s.matchesWithResult, 3),
  },
  {
    mission_type: 'training',
    frequency: 'weekly',
    title: 'Semana de trabajo',
    description: 'Completa sesiones de entrenamiento con tu equipo esta semana.',
    objective: 'Completar 3 sesiones',
    target: 3,
    reward_description: 'Equipo mejor preparado',
    computeProgress: (s) => Math.min(s.sessionsThisWeek, 3),
  },
];

export function useMissionGenerator(
  coachId: string,
  matches: Match[],
  sessions: TrainingSession[],
  giveXP: (actionKey: 'COMPLETE_MISSION') => Promise<void>
) {
  const ran = useRef(false);

  useEffect(() => {
    if (!coachId || ran.current) return;
    ran.current = true;

    (async () => {
      const { count: playerCount } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true });

      const last7days = new Date();
      last7days.setDate(last7days.getDate() - 7);
      const sessionsThisWeek = sessions.filter(
        s => s.completed && new Date(s.completed_at ?? '') >= last7days
      ).length;

      const stats: Stats = {
        playerCount: playerCount ?? 0,
        matchesPlayed: matches.length,
        matchesWithResult: matches.filter(m => m.result !== null).length,
        sessionsThisWeek,
      };

      const { data: existing } = await supabase
        .from('coach_missions')
        .select('id, title, progress, target, is_completed')
        .eq('coach_id', coachId);

      for (const tmpl of TEMPLATES) {
        const current = existing?.find(m => m.title === tmpl.title && !m.is_completed);
        const progress = tmpl.computeProgress(stats);
        const completed = progress >= tmpl.target;

        if (current) {
          if (progress !== current.progress || completed) {
            await supabase
              .from('coach_missions')
              .update({ progress, is_completed: completed })
              .eq('id', current.id);
            if (completed) await giveXP('COMPLETE_MISSION');
          }
        } else {
          const alreadyCompletedBefore = existing?.some(m => m.title === tmpl.title && m.is_completed);
          if (alreadyCompletedBefore) continue;
          await supabase.from('coach_missions').insert({
            coach_id: coachId,
            mission_type: tmpl.mission_type,
            frequency: tmpl.frequency,
            title: tmpl.title,
            description: tmpl.description,
            objective: tmpl.objective,
            progress,
            target: tmpl.target,
            reward_xp: REWARD_XP,
            reward_description: tmpl.reward_description,
            is_completed: completed,
          });
          if (completed) await giveXP('COMPLETE_MISSION');
        }
      }
    })().catch(() => {});
    // Se usa .length a proposito, igual que useEventGenerator: matches/sessions
    // son arrays nuevos en cada fetch y solo nos importa si cambio la cantidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachId, matches.length, sessions.length]);
}
