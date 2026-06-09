import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Match } from './useMatches';
import { TrainingSession } from './useTrainingSessions';

interface EventSeed {
  card_type: string;
  title: string;
  narrative: string;
  effect: string;
  requires_decision: boolean;
}

async function alreadyExists(coachId: string, cardType: string): Promise<boolean> {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const { data } = await supabase
    .from('event_cards')
    .select('id')
    .eq('coach_id', coachId)
    .eq('card_type', cardType)
    .eq('is_resolved', false)
    .gte('created_at', since.toISOString())
    .limit(1);
  return (data?.length ?? 0) > 0;
}

async function insertEvent(coachId: string, seed: EventSeed) {
  if (await alreadyExists(coachId, seed.card_type)) return;
  await supabase.from('event_cards').insert({ coach_id: coachId, ...seed });
}

export function useEventGenerator(
  coachId: string,
  matches: Match[],
  sessions: TrainingSession[]
) {
  const ran = useRef(false);

  useEffect(() => {
    if (!coachId || ran.current) return;
    ran.current = true;

    const played = matches.filter(m => m.result !== null);
    const recent = played.slice(-10);
    const wins = recent.filter(m => m.result === 'win').length;
    const lastResult = played[played.length - 1]?.result ?? null;

    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);
    const recentSessions = sessions.filter(
      s => s.completed && new Date(s.completed_at ?? '') >= last7days
    );

    const events: EventSeed[] = [];

    // Derrota reciente
    if (lastResult === 'loss') {
      events.push({
        card_type: 'decline',
        title: 'Derrota reciente — análisis necesario',
        narrative: 'Tu equipo acaba de sufrir una derrota. Es el momento de revisar qué falló tácticamente y corregir el rumbo.',
        effect: 'Revisa las sinergias de tu equipo y considera ajustar la formación.',
        requires_decision: false,
      });
    }

    // Racha ganadora
    if (wins >= 3) {
      events.push({
        card_type: 'streak',
        title: '¡Racha ganadora en marcha!',
        narrative: `Tu equipo lleva ${wins} victorias en los últimos partidos. La moral está por las nubes.`,
        effect: '+5% rendimiento del equipo. Mantén la dinámica.',
        requires_decision: false,
      });
    }

    // Constancia en entrenamiento
    if (recentSessions.length >= 3) {
      events.push({
        card_type: 'improvement',
        title: 'Constancia en el entrenamiento',
        narrative: `Has completado ${recentSessions.length} sesiones esta semana. El trabajo físico se nota en el campo.`,
        effect: 'El equipo llega más preparado a los próximos partidos.',
        requires_decision: false,
      });
    }

    // Sin partidos registrados
    if (matches.length === 0) {
      events.push({
        card_type: 'tactical_conflict',
        title: 'Sin historial de partidos',
        narrative: 'Aún no has registrado ningún partido. Llevar el historial te permitirá analizar el rendimiento del equipo.',
        effect: 'Registra tus partidos para desbloquear estadísticas y análisis tácticos.',
        requires_decision: false,
      });
    }

    // Insertar en paralelo
    Promise.all(events.map(e => insertEvent(coachId, e))).catch(() => {});
  }, [coachId, matches.length, sessions.length]);
}
