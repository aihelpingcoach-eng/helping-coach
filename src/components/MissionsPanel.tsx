import { useState, useEffect } from 'react';
import { Target, Trophy, Star, Clock, CheckCircle } from 'lucide-react';
import { CoachMission, MissionType } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';

interface MissionsPanelProps {
  coachId: string;
  onMissionComplete?: (xp: number) => void;
}

export default function MissionsPanel({ coachId, onMissionComplete }: MissionsPanelProps) {
  const [missions, setMissions] = useState<CoachMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

  useEffect(() => {
    loadMissions();
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
        return '🩺';
      case 'development':
        return '⭐';
      default:
        return '📋';
    }
  };

  const getMissionColor = (type: MissionType) => {
    switch (type) {
      case 'tactical':
        return 'from-blue-600 to-cyan-600';
      case 'synergy':
        return 'from-purple-600 to-pink-600';
      case 'training':
        return 'from-green-600 to-emerald-600';
      case 'management':
        return 'from-red-600 to-orange-600';
      case 'development':
        return 'from-yellow-600 to-orange-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getProgressPercentage = (mission: CoachMission) => {
    return Math.min((mission.progress / mission.target) * 100, 100);
  };

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    return mission.frequency === filter;
  });

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-center">Cargando misiones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-yellow-400" size={24} />
          <h3 className="text-xl font-bold text-white">Misiones del Coach</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'daily' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Diarias
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'weekly' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Semanales
          </button>
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
          <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
          <p className="text-gray-400">No hay misiones activas</p>
          <p className="text-gray-500 text-sm mt-1">Nuevas misiones se generarán pronto</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className={`bg-gradient-to-br ${getMissionColor(mission.mission_type)} rounded-xl p-5 relative overflow-hidden`}
            >
              <div className="absolute top-2 right-2 text-4xl opacity-20">
                {getMissionIcon(mission.mission_type)}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-white/70">
                    {mission.frequency}
                  </span>
                  {mission.expires_at && (
                    <span className="flex items-center gap-1 text-xs text-white/70">
                      <Clock size={12} />
                      Expira pronto
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{mission.title}</h4>
                <p className="text-sm text-white/80 mb-3">{mission.description}</p>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                    <span>Progreso</span>
                    <span className="font-bold">{mission.progress}/{mission.target}</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(mission)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white">
                    <Trophy size={16} />
                    <span className="text-sm font-bold">+{mission.reward_xp} XP</span>
                  </div>
                  <span className="text-xs text-white/70">{mission.reward_description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
