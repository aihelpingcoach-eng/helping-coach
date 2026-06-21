import { useState, useEffect } from 'react';
import { Target, Zap, Activity, Trophy, Sparkles, FileText, BarChart3 } from 'lucide-react';
import TacticalAlerts from './TacticalAlerts';
import EventCards from './EventCards';
import WorkloadManager from './WorkloadManager';
import MissionsPanel from './MissionsPanel';
import CareerMode from './CareerMode';
import TeamDNAAnalysis from './TeamDNAAnalysis';
import MatchReportGenerator from './MatchReportGenerator';
import TeamStatsPanel from './TeamStatsPanel';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useAuth } from '../contexts/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useTrainingSessions } from '../hooks/useTrainingSessions';
import { useEventGenerator } from '../hooks/useEventGenerator';
import { supabase } from '../lib/supabase';

type AdvancedTab = 'overview' | 'alerts' | 'events' | 'workload' | 'missions' | 'career' | 'report' | 'stats';

interface Player {
  id: string;
  name: string;
  position: string;
  playstyle: string;
}

export default function AdvancedMode() {
  const [activeTab, setActiveTab] = useState<AdvancedTab>('overview');
  const { profile } = useCoachProfile();
  const { user } = useAuth();
  const { matches } = useMatches(user?.id);
  const { sessions } = useTrainingSessions(user?.id);
  useEventGenerator(profile?.id ?? '', matches, sessions);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeFormation, setActiveFormation] = useState('4-3-3');

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    const [playersRes, formationRes] = await Promise.all([
      supabase.from('players').select('id, name, position, playstyle').order('created_at', { ascending: false }),
      supabase.from('formations').select('formation_type').eq('team_slot', 1).order('created_at', { ascending: false }).limit(1),
    ]);

    if (!playersRes.error && playersRes.data) {
      setPlayers(playersRes.data as Player[]);
    }
    if (!formationRes.error && formationRes.data && formationRes.data[0]) {
      setActiveFormation(formationRes.data[0].formation_type);
    }
  };

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as AdvancedTab, label: 'Resumen', icon: Trophy },
    { id: 'alerts' as AdvancedTab, label: 'Alertas', icon: Zap },
    { id: 'events' as AdvancedTab, label: 'Eventos', icon: Target },
    { id: 'workload' as AdvancedTab, label: 'Carga', icon: Activity },
    { id: 'missions' as AdvancedTab, label: 'Misiones', icon: Target },
    { id: 'career' as AdvancedTab, label: 'Carrera', icon: Trophy },
    { id: 'report' as AdvancedTab, label: 'Informe', icon: FileText },
    { id: 'stats' as AdvancedTab, label: 'Estadísticas', icon: BarChart3 },
  ];

  const teamPlaystyles = players.map(p => p.playstyle).filter(Boolean);

  return (
    <div className="w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Sistemas Avanzados</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Gestión completa de tu carrera como entrenador
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="text-yellow-400" />
                    Alertas Tácticas Recientes
                  </h3>
                  <TacticalAlerts coachId={profile.id} />
                </div>

                <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="text-blue-400" />
                    Misiones Activas
                  </h3>
                  <MissionsPanel coachId={profile.id} />
                </div>
              </div>

              <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Eventos Destacados</h3>
                <EventCards coachId={profile.id} />
              </div>

              <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="text-purple-400" />
                  ADN del Equipo
                </h3>
                <TeamDNAAnalysis formation={activeFormation} players={players} />
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <TacticalAlerts coachId={profile.id} />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <EventCards coachId={profile.id} />
            </div>
          )}

          {activeTab === 'workload' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <WorkloadManager coachId={profile.id} players={[]} />
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <MissionsPanel coachId={profile.id} />
            </div>
          )}

          {activeTab === 'career' && (
            <div>
              <CareerMode coachId={profile.id} />
            </div>
          )}

          {activeTab === 'report' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <MatchReportGenerator teamPlaystyles={teamPlaystyles} />
            </div>
          )}

          {activeTab === 'stats' && (
            <TeamStatsPanel userId={user?.id ?? ''} />
          )}
        </div>
      </div>
    </div>
  );
}
