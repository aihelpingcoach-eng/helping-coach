import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { WeeklyWorkload, FatigueLevel } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';

interface WorkloadManagerProps {
  coachId: string;
  players: any[];
}

export default function WorkloadManager({ coachId, players }: WorkloadManagerProps) {
  const [workloads, setWorkloads] = useState<WeeklyWorkload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkloads();
  }, [coachId]);

  const loadWorkloads = async () => {
    try {
      const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
      const { data, error } = await supabase
        .from('weekly_workload')
        .select('*')
        .eq('coach_id', coachId)
        .eq('week_number', currentWeek);

      if (error) throw error;
      setWorkloads(data || []);
    } catch (error) {
      console.error('Error loading workloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFatigueColor = (level: FatigueLevel) => {
    switch (level) {
      case 'optimal':
        return 'text-green-400 bg-green-900/30';
      case 'light_fatigue':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'high_fatigue':
        return 'text-orange-400 bg-orange-900/30';
      case 'injury_risk':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getFatigueIcon = (level: FatigueLevel) => {
    switch (level) {
      case 'optimal':
        return <CheckCircle size={18} />;
      case 'light_fatigue':
        return <Activity size={18} />;
      case 'high_fatigue':
        return <AlertTriangle size={18} />;
      case 'injury_risk':
        return <XCircle size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  const getFatigueLabel = (level: FatigueLevel) => {
    switch (level) {
      case 'optimal':
        return 'Óptimo';
      case 'light_fatigue':
        return 'Fatiga Leve';
      case 'high_fatigue':
        return 'Fatiga Alta';
      case 'injury_risk':
        return 'Riesgo de Lesión';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-center">Cargando carga semanal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-blue-400" size={24} />
        <h3 className="text-xl font-bold text-white">Gestión de Carga Semanal</h3>
      </div>

      {workloads.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">No hay datos de carga para esta semana</p>
          <p className="text-gray-500 text-sm mt-2">Los datos se generarán automáticamente con la actividad del equipo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workloads.map((workload) => {
            const player = players.find(p => p.id === workload.player_id);
            return (
              <div
                key={workload.id}
                className="bg-gray-900/70 border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold">{player?.name || 'Jugador Desconocido'}</h4>
                    <p className="text-gray-400 text-sm">{player?.position || 'N/A'}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getFatigueColor(workload.fatigue_level)}`}>
                    {getFatigueIcon(workload.fatigue_level)}
                    <span className="text-sm font-bold">{getFatigueLabel(workload.fatigue_level)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Carga de Entrenamiento</p>
                    <p className="text-white font-bold">{workload.training_load} pts</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Minutos Jugados</p>
                    <p className="text-white font-bold">{workload.match_minutes} min</p>
                  </div>
                </div>

                <div className="bg-blue-900/20 border-l-4 border-blue-500 rounded p-3">
                  <p className="text-xs text-gray-400 mb-1">Recomendación</p>
                  <p className="text-sm text-blue-200">{workload.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
