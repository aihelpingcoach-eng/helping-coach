import { useMemo } from 'react';
import { Match } from './useMatches';

export interface SmartReminder {
  id: string;
  type: 'match' | 'player' | 'session';
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
  return useMemo(() => {
    const reminders: SmartReminder[] = [];

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
  }, [matches, playerCount]);
}
