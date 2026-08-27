import { useState, useEffect } from 'react';
import { Target, Zap, Activity, Trophy, Sparkles, FileText, BarChart3, ListOrdered, Award } from 'lucide-react';
import TacticalAlerts from './TacticalAlerts';
import EventCards from './EventCards';
import WorkloadManager from './WorkloadManager';
import MissionsPanel from './MissionsPanel';
import CareerMode from './CareerMode';
import TeamDNAAnalysis from './TeamDNAAnalysis';
import MatchReportGenerator from './MatchReportGenerator';
import TeamStatsPanel from './TeamStatsPanel';
import LeaderboardPanel from './LeaderboardPanel';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useAuth } from '../contexts/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useTrainingSessions } from '../hooks/useTrainingSessions';
import { useEventGenerator } from '../hooks/useEventGenerator';
import { useMissionGenerator } from '../hooks/useMissionGenerator';
import { useXP } from '../hooks/useXP';
import { supabase } from '../lib/supabase';

type AdvancedTab = 'overview' | 'alerts' | 'events' | 'workload' | 'missions' | 'career' | 'report' | 'stats' | 'ranking';

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
  const { giveCustomXP } = useXP();
  const [missionToast, setMissionToast] = useState<{ title: string; reward_xp: number } | null>(null);
  useEventGenerator(profile?.id ?? '', matches, sessions);
  useMissionGenerator(profile?.id ?? '', matches, sessions, giveCustomXP, (tmpl) => {
    setMissionToast({ title: tmpl.title, reward_xp: tmpl.reward_xp });
    setTimeout(() => setMissionToast(null), 3200);
  }, activeTab);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeFormation, setActiveFormation] = useState('4-3-3');
  const [teamSlot, setTeamSlot] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    loadTeamData(teamSlot);
  }, [teamSlot]);

  const loadTeamData = async (slot: 1 | 2 | 3) => {
    const { data: formations } = await supabase
      .from('formations')
      .select('id, formation_type')
      .eq('team_slot', slot)
      .order('created_at', { ascending: false })
      .limit(1);

    const formation = formations?.[0];
    if (!formation) {
      setPlayers([]);
      setActiveFormation('4-3-3');
      return;
    }

    setActiveFormation(formation.formation_type);

    const { data: links, error } = await supabase
      .from('formation_players')
      .select('player:players(id, name, position, playstyle)')
      .eq('formation_id', formation.id);

    if (!error && links) {
      setPlayers(links.map(l => l.player).filter(Boolean) as unknown as Player[]);
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
    { id: 'ranking' as AdvancedTab, label: 'Clasificación', icon: ListOrdered },
  ];

  const teamPlaystyles = players.map(p => p.playstyle).filter(Boolean);

  return (
    <>
      {missionToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-amber-500 text-black font-bold px-5 py-2.5 rounded-full shadow-lg animate-bounce text-sm max-w-[92vw]">
          <Award size={16} className="flex-shrink-0" />
          <span className="truncate">¡Misión completada! {missionToast.title} · +{missionToast.reward_xp} XP</span>
        </div>
      )}
    <div className="w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Sistemas Avanzados</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Gestión completa de tu carrera como entrenador
          </p>
        </div>

        <div className="relative mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
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
          <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-black to-transparent" />
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
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-purple-400" />
                    ADN del Equipo
                  </h3>
                  <TeamSlotSelector value={teamSlot} onChange={setTeamSlot} />
                </div>
                <TeamDNAAnalysis key={teamSlot} formation={activeFormation} players={players} />
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
              <div className="flex items-center justify-end mb-4">
                <TeamSlotSelector value={teamSlot} onChange={setTeamSlot} />
              </div>
              <MatchReportGenerator key={teamSlot} teamPlaystyles={teamPlaystyles} />
            </div>
          )}

          {activeTab === 'stats' && (
            <TeamStatsPanel userId={user?.id ?? ''} />
          )}

          {activeTab === 'ranking' && (
            <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ListOrdered className="text-purple-400" />
                Clasificación de Entrenadores
              </h3>
              <LeaderboardPanel />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function TeamSlotSelector({ value, onChange }: { value: 1 | 2 | 3; onChange: (slot: 1 | 2 | 3) => void }) {
  return (
    <div className="flex items-center gap-1 bg-gray-800/70 rounded-lg p-1">
      {([1, 2, 3] as const).map(slot => (
        <button
          key={slot}
          onClick={() => onChange(slot)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            value === slot ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Equipo {slot}
        </button>
      ))}
    </div>
  );
}
