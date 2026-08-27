import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Match } from './useMatches';
import { TrainingSession } from './useTrainingSessions';
import { MissionType, MissionFrequency } from '../types/advancedSystems';
import { recordMissionCompletion } from '../utils/missionNotifications';

interface MissionTemplate {
  mission_type: MissionType;
  frequency: MissionFrequency;
  title: string;
  description: string;
  objective: string;
  target: number;
  reward_xp: number;
  reward_description: string;
  computeProgress: (stats: Stats) => number;
}

interface Stats {
  playerCount: number;
  matchesPlayed: number;
  matchesWithResult: number;
  sessionsThisWeek: number;
}

// Recompensa proporcional a lo que cuesta cada misión: un gesto trivial de
// una sola vez da poco, una meta que exige mantener un habito da mas.
const TEMPLATES: MissionTemplate[] = [
  {
    mission_type: 'tactical',
    frequency: 'special',
    title: 'Arma tu plantilla',
    description: 'Añade jugadores a tu equipo para poder crear alineaciones completas.',
    objective: 'Añadir 5 jugadores',
    target: 5,
    reward_xp: 30,
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
    reward_xp: 90,
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
    reward_xp: 20,
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
    reward_xp: 60,
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
    reward_xp: 50,
    reward_description: 'Equipo mejor preparado',
    computeProgress: (s) => Math.min(s.sessionsThisWeek, 3),
  },
];

export function useMissionGenerator(
  coachId: string,
  matches: Match[],
  sessions: TrainingSession[],
  giveCustomXP: (amount: number) => Promise<void>,
  onMissionCompleted?: (tmpl: { title: string; reward_xp: number }) => void,
  // No todo lo que mueve el progreso (p.ej. añadir un jugador) cambia
  // matches/sessions, así que no dispara el efecto por sí solo. refreshKey
  // deja que quien llama fuerce una recomprobación (p.ej. al cambiar de tab).
  refreshKey?: string | number
) {
  const matchesPlayed = matches.length;
  const matchesWithResult = matches.filter(m => m.result !== null).length;
  const last7days = new Date();
  last7days.setDate(last7days.getDate() - 7);
  const sessionsThisWeek = sessions.filter(
    s => s.completed && new Date(s.completed_at ?? '') >= last7days
  ).length;

  useEffect(() => {
    if (!coachId) return;

    (async () => {
      const { count: playerCount } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true });

      const stats: Stats = {
        playerCount: playerCount ?? 0,
        matchesPlayed,
        matchesWithResult,
        sessionsThisWeek,
      };

      const { data: existing } = await supabase
        .from('coach_missions')
        .select('id, title, progress, target, reward_xp, is_completed')
        .eq('coach_id', coachId);

      const celebrate = async (tmpl: MissionTemplate) => {
        await giveCustomXP(tmpl.reward_xp);
        recordMissionCompletion(tmpl.title, tmpl.reward_xp);
        onMissionCompleted?.(tmpl);
      };

      for (const tmpl of TEMPLATES) {
        const current = existing?.find(m => m.title === tmpl.title && !m.is_completed);
        const progress = tmpl.computeProgress(stats);
        const completed = progress >= tmpl.target;

        if (current) {
          if (progress !== current.progress || completed || current.reward_xp !== tmpl.reward_xp) {
            // El filtro is_completed=false hace la actualización atómica: si
            // otra ejecución solapada ya la completó primero, esta no
            // devuelve filas y no se vuelve a dar el XP por duplicado.
            const { data: updated } = await supabase
              .from('coach_missions')
              .update({ progress, is_completed: completed, reward_xp: tmpl.reward_xp })
              .eq('id', current.id)
              .eq('is_completed', false)
              .select('id');
            if (completed && updated && updated.length > 0) {
              await celebrate(tmpl);
            }
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
            reward_xp: tmpl.reward_xp,
            reward_description: tmpl.reward_description,
            is_completed: completed,
          });
          if (completed) {
            await celebrate(tmpl);
          }
        }
      }
    })().catch(() => {});
  }, [coachId, matchesPlayed, matchesWithResult, sessionsThisWeek, giveCustomXP, onMissionCompleted, refreshKey]);
}
