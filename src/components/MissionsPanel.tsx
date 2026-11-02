import { useState, useEffect } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { CoachMission, MissionType } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';
import EmptyState from './EmptyState';

interface MissionsPanelProps {
  coachId: string;
}

export default function MissionsPanel({ coachId }: MissionsPanelProps) {
  const [missions, setMissions] = useState<CoachMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

  useEffect(() => {
    loadMissions();
    // loadMissions no está memoizada; solo debe recargar cuando cambia coachId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coachId]);

  const loadMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_missions')
        .select('*')
        .eq('coach_id', coachId)
        .eq('is_completed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissions(data || []);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMissionIcon = (type: MissionType) => {
    switch (type) {
      case 'tactical':
        return '🎯';
      case 'synergy':
        return '🧩';
      case 'training':
        return '💪';
      case 'management':
        return '📋';
      case 'development':
        return '⭐';
      default:
        return '📋';
    }
  };

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.frequency === filter;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map(i => (
          <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10" role="group" aria-label="Filtrar misiones">
        {(['all', 'daily', 'weekly', 'special'] as const).map(f => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              filter === f ? 'bg-purple-600/30 text-purple-100' : 'text-gray-400 hover:text-white'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {filteredMissions.length === 0 ? (
        <EmptyState
          variant="generic"
          title="No hay misiones activas"
          subtitle="Las misiones nuevas aparecen al usar la app: registra partidos o completa entrenamientos."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredMissions.map(mission => {
            const expiry = expiryLabel(mission.expires_at);
            return (
              <div key={mission.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="w-10 h-10 flex-shrink-0 rounded-xl bg-purple-600/20 flex items-center justify-center text-xl"
                    aria-hidden="true"
                  >
                    {getMissionIcon(mission.mission_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-200/80">
                      <span>{FREQUENCY_LABELS[mission.frequency]}</span>
                      {expiry && (
                        <span className="flex items-center gap-1 text-gray-400 font-medium">
                          <Clock size={11} />
                          {expiry}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-white leading-snug">{mission.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{mission.description}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Progreso</span>
                    <span className="font-bold text-white">
                      {mission.progress}/{mission.target}
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((mission.progress / mission.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className="flex items-center gap-1 text-sm font-bold text-yellow-300">
                    <Trophy size={14} />+{mission.reward_xp} XP
                  </span>
                  <span className="text-[11px] text-gray-400 text-right">{mission.reward_description}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const FILTER_LABELS = { all: 'Todas', daily: 'Diarias', weekly: 'Semanales', special: 'Especiales' } as const;
const FREQUENCY_LABELS: Record<CoachMission['frequency'], string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  special: 'Especial',
};

function expiryLabel(expiresAt: string | null | undefined) {
  if (!expiresAt) return null;
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return 'Caduca hoy';
  if (days === 1) return 'Caduca mañana';
  return `Quedan ${days} días`;
}
