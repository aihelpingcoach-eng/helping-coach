import { useEffect, useMemo, useState } from 'react';
import { Match } from './useMatches';
import { getRecentMissionCompletions, MISSION_COMPLETED_EVENT } from '../utils/missionNotifications';

export interface SmartReminder {
  id: string;
  type: 'match' | 'player' | 'session' | 'mission';
  title: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
  mode?: string;
}

function daysDiff(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T12:00:00');
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function useSmartReminders(
  matches: Match[],
  playerCount: number
): SmartReminder[] {
  // localStorage no es reactivo: escuchamos el evento que dispara
  // useMissionGenerator al completar una misión para forzar el recálculo.
  const [missionTick, setMissionTick] = useState(0);

  useEffect(() => {
    const bump = () => setMissionTick(t => t + 1);
    window.addEventListener(MISSION_COMPLETED_EVENT, bump);
    return () => window.removeEventListener(MISSION_COMPLETED_EVENT, bump);
  }, []);

  return useMemo(() => {
    const reminders: SmartReminder[] = [];

    // Misiones completadas recientemente
    for (const rec of getRecentMissionCompletions()) {
      reminders.push({
        id: `mission-${rec.id}`,
        type: 'mission',
        title: '¡Misión completada!',
        description: `${rec.title} · +${rec.reward_xp} XP`,
        urgency: 'low',
        mode: 'advanced',
      });
    }

    // Upcoming matches
    const upcoming = matches.filter(m => !m.result);
    for (const match of upcoming) {
      const diff = daysDiff(match.date);
      if (diff === 0) {
        reminders.push({
          id: `match-today-${match.id}`,
          type: 'match',
          title: `¡Partido hoy!`,
          description: `vs ${match.opponent}${match.time ? ` a las ${match.time}` : ''}`,
          urgency: 'high',
          mode: 'calendar',
        });
      } else if (diff === 1) {
        reminders.push({
          id: `match-tomorrow-${match.id}`,
          type: 'match',
          title: `Partido mañana`,
          description: `vs ${match.opponent}${match.competition !== 'Liga' ? ` · ${match.competition}` : ''}`,
          urgency: 'high',
          mode: 'calendar',
        });
      } else if (diff > 1 && diff <= 7) {
        reminders.push({
          id: `match-week-${match.id}`,
          type: 'match',
          title: `Partido en ${diff} días`,
          description: `vs ${match.opponent} · ${match.competition}`,
          urgency: 'medium',
          mode: 'calendar',
        });
      }
    }

    // Players reminder
    if (playerCount > 0) {
      reminders.push({
        id: 'players-progress',
        type: 'player',
        title: 'Revisa el progreso',
        description: `Tienes ${playerCount} jugador${playerCount !== 1 ? 'es' : ''} — actualiza sus niveles`,
        urgency: 'low',
        mode: 'progress',
      });
    }

    return reminders;
    // missionTick no se lee dentro del cuerpo: solo fuerza releer
    // localStorage cuando useMissionGenerator completa una misión.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, playerCount, missionTick]);
}
