import { CalendarClock, CalendarX, CheckCircle2, ChevronRight, Dumbbell, TrendingDown, Users } from 'lucide-react';
import { TeamAlert, TeamAlertKind } from '../hooks/useTeamAlerts';
import type { AppMode } from './BottomNav';

const KIND_STYLE: Record<TeamAlertKind, { icon: typeof Users; accent: string }> = {
  upcoming_match: { icon: CalendarClock, accent: 'bg-cyan-500/15 text-cyan-300' },
  missing_result: { icon: CalendarX, accent: 'bg-yellow-500/15 text-yellow-300' },
  lineup_gaps: { icon: Users, accent: 'bg-purple-500/20 text-purple-200' },
  player_decline: { icon: TrendingDown, accent: 'bg-orange-500/15 text-orange-300' },
  no_training: { icon: Dumbbell, accent: 'bg-green-500/15 text-green-300' },
};

interface TeamAlertsListProps {
  alerts: TeamAlert[];
  loading: boolean;
  onNavigate?: (mode: AppMode) => void;
}

export default function TeamAlertsList({ alerts, loading, onNavigate }: TeamAlertsListProps) {
  if (loading && alerts.length === 0) {
    return <div className="h-20 rounded-2xl bg-white/5 animate-pulse" />;
  }

  if (alerts.length === 0) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
        <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
        Todo en orden: no hay nada pendiente en tu equipo.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {alerts.map(alert => {
        const { icon: Icon, accent } = KIND_STYLE[alert.kind];
        return (
          <li key={alert.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <span className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${accent}`}>
                <Icon size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white leading-snug">{alert.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{alert.detail}</p>
                {alert.action && onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(alert.action!.mode)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-purple-200"
                  >
                    {alert.action.label}
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
