import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Match } from './useMatches';
import { TrainingSession } from './useTrainingSessions';
import type { AppMode } from '../components/BottomNav';

export type TeamAlertKind = 'upcoming_match' | 'missing_result' | 'lineup_gaps' | 'player_decline' | 'no_training';

export interface TeamAlert {
  id: string;
  kind: TeamAlertKind;
  title: string;
  detail: string;
  action?: { label: string; mode: AppMode };
}

const DAY = 86_400_000;
const UPCOMING_DAYS = 3;
const NO_TRAINING_DAYS = 7;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysUntil(date: string) {
  return Math.round((new Date(`${date}T00:00:00`).getTime() - startOfToday().getTime()) / DAY);
}

function whenLabel(days: number) {
  if (days === 0) return 'hoy';
  if (days === 1) return 'mañana';
  return `en ${days} días`;
}

/** Jugadores que pide la formación: "4-3-3" → 4 + 3 + 3 + portero. */
export function playersRequired(formationType: string) {
  const outfield = formationType.split('-').reduce((sum, n) => sum + (parseInt(n, 10) || 0), 0);
  return outfield + 1;
}

export function matchAlerts(matches: Match[]): TeamAlert[] {
  const alerts: TeamAlert[] = [];

  const upcoming = matches
    .filter(m => m.result === null && daysUntil(m.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (upcoming && daysUntil(upcoming.date) <= UPCOMING_DAYS) {
    const extra = [upcoming.competition, upcoming.time ? `a las ${upcoming.time.slice(0, 5)}` : '']
      .filter(Boolean)
      .join(' · ');
    alerts.push({
      id: `upcoming-${upcoming.id}`,
      kind: 'upcoming_match',
      title: `Partido contra ${upcoming.opponent} ${whenLabel(daysUntil(upcoming.date))}`,
      detail: `${extra ? `${extra}. ` : ''}Revisa la alineación antes del partido.`,
      action: { label: 'Ir a Tácticas', mode: 'tactics' },
    });
  }

  const missing = matches.filter(m => m.result === null && daysUntil(m.date) < 0);
  if (missing.length > 0) {
    const rivals = missing.slice(0, 2).map(m => m.opponent).join(' y ');
    alerts.push({
      id: 'missing-results',
      kind: 'missing_result',
      title: missing.length === 1 ? `Falta el resultado contra ${rivals}` : `Faltan ${missing.length} resultados de partidos`,
      detail:
        missing.length === 1
          ? 'Añádelo para que cuente en tus estadísticas y misiones.'
          : `Entre ellos, contra ${rivals}. Añádelos para que cuenten en tus estadísticas.`,
      action: { label: 'Ir a Partidos', mode: 'calendar' },
    });
  }

  return alerts;
}

export function trainingAlert(sessions: TrainingSession[]): TeamAlert | null {
  const lastCompleted = sessions
    .filter(s => s.completed && s.completed_at)
    .map(s => new Date(s.completed_at as string).getTime())
    .sort((a, b) => b - a)[0];
  // Si nunca ha completado una sesión no se avisa: las misiones ya le empujan a empezar.
  if (!lastCompleted) return null;
  const days = Math.floor((Date.now() - lastCompleted) / DAY);
  if (days < NO_TRAINING_DAYS) return null;
  return {
    id: 'no-training',
    kind: 'no_training',
    title: `Llevas ${days} días sin completar un entrenamiento`,
    detail: 'Una sesión corta ayuda a llegar mejor al próximo partido.',
    action: { label: 'Ir a Entreno', mode: 'training' },
  };
}

interface FormationRow {
  id: string;
  team_slot: number;
  formation_type: string;
}

interface ProgressRow {
  player_id: string;
  level_change: number;
}

/**
 * Avisos del equipo calculados al momento a partir de sus datos. No se guardan
 * en la base de datos: así nunca se quedan desfasados (si completas la
 * alineación, el aviso desaparece solo).
 */
export function useTeamAlerts(userId: string | undefined, matches: Match[], sessions: TrainingSession[]) {
  const [dataAlerts, setDataAlerts] = useState<TeamAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const [{ data: formations }, { data: progress }] = await Promise.all([
        supabase.from('formations').select('id, team_slot, formation_type').order('created_at', { ascending: false }),
        // Sin embed players(name): la relación no está declarada en la BD y
        // PostgREST responde 400. Los nombres se piden aparte.
        supabase
          .from('player_progress')
          .select('player_id, level_change')
          .order('created_at', { ascending: false })
          .limit(300),
      ]);

      const alerts: TeamAlert[] = [];

      // Alineaciones a medias: la formación más reciente de cada equipo
      const latestBySlot = new Map<number, FormationRow>();
      ((formations ?? []) as FormationRow[]).forEach(f => {
        if (!latestBySlot.has(f.team_slot)) latestBySlot.set(f.team_slot, f);
      });
      const latest = [...latestBySlot.values()];
      if (latest.length > 0) {
        const { data: links } = await supabase
          .from('formation_players')
          .select('formation_id')
          .in('formation_id', latest.map(f => f.id));
        const counts = new Map<string, number>();
        (links ?? []).forEach(l => counts.set(l.formation_id, (counts.get(l.formation_id) ?? 0) + 1));
        latest
          .sort((a, b) => a.team_slot - b.team_slot)
          .forEach(f => {
            const filled = counts.get(f.id) ?? 0;
            const missing = playersRequired(f.formation_type) - filled;
            // Un equipo vacío es uno que no se usa: solo se avisa si está a medias
            if (filled > 0 && missing > 0) {
              alerts.push({
                id: `lineup-${f.team_slot}`,
                kind: 'lineup_gaps',
                title: `Equipo ${f.team_slot}: ${missing === 1 ? 'falta 1 jugador' : `faltan ${missing} jugadores`} en la alineación`,
                detail: `La formación ${f.formation_type} necesita ${playersRequired(f.formation_type)} y tienes ${filled}.`,
                action: { label: 'Ir a Tácticas', mode: 'tactics' },
              });
            }
          });
      }

      // Jugadores que han bajado de nivel en sus dos últimas evaluaciones
      const byPlayer = new Map<string, ProgressRow[]>();
      ((progress ?? []) as ProgressRow[]).forEach(p => {
        const list = byPlayer.get(p.player_id) ?? [];
        if (list.length < 2) list.push(p);
        byPlayer.set(p.player_id, list);
      });
      const declining = [...byPlayer.entries()]
        .filter(([, list]) => list.length === 2 && list.every(p => p.level_change < 0))
        .slice(0, 3)
        .map(([playerId]) => playerId);
      const names = new Map<string, string>();
      if (declining.length > 0) {
        const { data: players } = await supabase.from('players').select('id, name').in('id', declining);
        (players ?? []).forEach(p => names.set(p.id, p.name));
      }
      declining.forEach(playerId => {
        alerts.push({
          id: `decline-${playerId}`,
          kind: 'player_decline',
          title: `${names.get(playerId) ?? 'Un jugador'} ha bajado en sus dos últimas evaluaciones`,
          detail: 'Puede ser cansancio, una molestia o falta de confianza: conviene revisar su caso.',
          action: { label: 'Ir a Progreso', mode: 'progress' },
        });
      });

      if (!cancelled) {
        setDataAlerts(alerts);
        setLoading(false);
      }
    })().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const training = trainingAlert(sessions);
  const alerts = [...matchAlerts(matches), ...dataAlerts, ...(training ? [training] : [])];
  return { alerts, loading };
}
