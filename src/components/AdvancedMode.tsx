import { useState, useEffect, useMemo, ReactNode } from 'react';
import { LayoutDashboard, Users, Trophy, Bell, Award, Sparkles, FileText, Target, ListOrdered, Zap, Activity } from 'lucide-react';
import EventCards from './EventCards';
import MissionsPanel from './MissionsPanel';
import CareerMode from './CareerMode';
import TeamDNAAnalysis from './TeamDNAAnalysis';
import MatchReportGenerator from './MatchReportGenerator';
import TeamStatsPanel from './TeamStatsPanel';
import LeaderboardPanel from './LeaderboardPanel';
import AdvancedSummary from './AdvancedSummary';
import TeamAlertsList from './TeamAlertsList';
import MinutesPlayedPanel from './MinutesPlayedPanel';
import type { AppMode } from './BottomNav';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useAuth } from '../contexts/AuthContext';
import { useMatches } from '../hooks/useMatches';
import { useTrainingSessions } from '../hooks/useTrainingSessions';
import { useEventGenerator } from '../hooks/useEventGenerator';
import { useMissionGenerator } from '../hooks/useMissionGenerator';
import { useTeamAlerts } from '../hooks/useTeamAlerts';
import { useXP } from '../hooks/useXP';
import { computeTeamDNA } from '../constants/teamDNA';
import { supabase } from '../lib/supabase';

// Antes eran 9 pestañas (en el móvil solo se veían 3) y dos de ellas, Alertas
// y Carga, siempre vacías: nada generaba sus datos. Ahora 4 que caben enteras;
// Carga ha vuelto dentro de Equipo con los minutos del directo de partido.
export type AdvancedTab = 'overview' | 'team' | 'challenges' | 'alerts';

interface Player {
  id: string;
  name: string;
  position: string;
  playstyle: string;
}

interface AdvancedModeProps {
  /** Lleva a otra sección de la app (los avisos enlazan con Tácticas, Partidos…) */
  onNavigate?: (mode: AppMode) => void;
}

function Section({ title, icon: Icon, action, children }: { title: string; icon: typeof Users; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Icon size={20} className="text-purple-300" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdvancedMode({ onNavigate }: AdvancedModeProps) {
  const [activeTab, setActiveTab] = useState<AdvancedTab>('overview');
  const { profile } = useCoachProfile();
  const { user } = useAuth();
  const { matches, loading: matchesLoading } = useMatches(user?.id);
  const { sessions, loading: sessionsLoading } = useTrainingSessions(user?.id);
  const { giveCustomXP } = useXP();
  const [missionToast, setMissionToast] = useState<{ title: string; reward_xp: number } | null>(null);
  useEventGenerator(profile?.id ?? '', matches, sessions, !matchesLoading && !sessionsLoading);
  useMissionGenerator(profile?.id ?? '', matches, sessions, giveCustomXP, (tmpl) => {
    setMissionToast({ title: tmpl.title, reward_xp: tmpl.reward_xp });
    setTimeout(() => setMissionToast(null), 3200);
  }, activeTab);
  const { alerts, loading: alertsLoading } = useTeamAlerts(user?.id, matches, sessions);
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

  const dna = useMemo(() => {
    if (players.length === 0) return null;
    const result = computeTeamDNA(activeFormation, players);
    return { slot: teamSlot, name: result.name, style: result.style };
  }, [players, activeFormation, teamSlot]);

  if (!profile) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  const tabs: { id: AdvancedTab; label: string; icon: typeof Users; badge?: number }[] = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'challenges', label: 'Retos', icon: Trophy },
    { id: 'alerts', label: 'Avisos', icon: Bell, badge: alerts.length },
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Avanzado</h1>
          <p className="text-gray-400 text-sm">Tu equipo, tus retos y lo que necesita tu atención</p>
        </div>

        <div className="flex gap-1 p-1 mb-5 rounded-2xl bg-white/5 border border-white/10" role="group" aria-label="Secciones de Avanzado">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 min-w-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isActive ? 'bg-purple-600/30 text-purple-100' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="truncate">{tab.label}</span>
                {!!tab.badge && (
                  <span
                    className="absolute top-1 right-1 sm:static min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center"
                    aria-label={`${tab.badge} pendientes`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {activeTab === 'overview' && (
            <AdvancedSummary coachId={profile.id} userId={user?.id} alerts={alerts} dna={dna} onGoTo={setActiveTab} />
          )}

          {activeTab === 'team' && (
            <>
              <TeamStatsPanel userId={user?.id ?? ''} />

              <Section title="Carga: minutos jugados" icon={Activity}>
                <MinutesPlayedPanel userId={user?.id ?? ''} onNavigate={onNavigate} />
              </Section>

              <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
                <p className="text-sm text-gray-400">Análisis por equipo</p>
                <TeamSlotSelector value={teamSlot} onChange={setTeamSlot} />
              </div>

              <Section title="ADN del equipo" icon={Sparkles}>
                <TeamDNAAnalysis key={teamSlot} formation={activeFormation} players={players} />
              </Section>

              <Section title="Informe de partido" icon={FileText}>
                <MatchReportGenerator key={teamSlot} teamPlaystyles={teamPlaystyles} matches={matches} />
              </Section>
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              <Section title="Misiones" icon={Target}>
                <MissionsPanel coachId={profile.id} />
              </Section>

              <Section title="Carrera" icon={Trophy}>
                <CareerMode coachId={profile.id} matches={matches} sessions={sessions} />
              </Section>

              <Section title="Clasificación" icon={ListOrdered}>
                <LeaderboardPanel onOpenProfile={onNavigate ? () => onNavigate('profile') : undefined} />
              </Section>
            </>
          )}

          {activeTab === 'alerts' && (
            <>
              <Section title="Ahora mismo" icon={Bell}>
                <TeamAlertsList alerts={alerts} loading={alertsLoading} onNavigate={onNavigate} />
              </Section>

              <Section title="Eventos" icon={Zap}>
                <EventCards coachId={profile.id} />
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function TeamSlotSelector({ value, onChange }: { value: 1 | 2 | 3; onChange: (slot: 1 | 2 | 3) => void }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1" role="group" aria-label="Equipo">
      {([1, 2, 3] as const).map(slot => (
        <button
          key={slot}
          type="button"
          aria-pressed={value === slot}
          onClick={() => onChange(slot)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            value === slot ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Equipo {slot}
        </button>
      ))}
    </div>
  );
}
