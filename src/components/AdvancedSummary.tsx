import { useEffect, useState, ReactNode } from 'react';
import { Bell, ChevronRight, Medal, Sparkles, CheckCircle2 } from 'lucide-react';
import { getXPProgress } from '../constants/progression';
import { getLevelByXP } from '../constants/levels';
import { useXP } from '../hooks/useXP';
import { useRankingPosition } from '../hooks/useRankingPosition';
import { TeamAlert } from '../hooks/useTeamAlerts';
import { supabase } from '../lib/supabase';
import type { AdvancedTab } from './AdvancedMode';

interface MissionPreview {
  title: string;
  progress: number;
  target: number;
}

interface AdvancedSummaryProps {
  coachId: string;
  userId: string | undefined;
  alerts: TeamAlert[];
  dna: { slot: number; name: string; style: string } | null;
  onGoTo: (tab: AdvancedTab) => void;
}

function SummaryCard({ label, onClick, children, className = '' }: { label: string; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors flex items-center gap-3 ${className}`}
    >
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">{label}</span>
        {children}
      </span>
      <ChevronRight size={18} className="text-gray-500 flex-shrink-0" />
    </button>
  );
}

// Una pantalla con lo esencial de cada pestaña. Antes el Resumen repetía las
// pestañas completas y medía más de 3.000 px en el móvil.
export default function AdvancedSummary({ coachId, userId, alerts, dna, onGoTo }: AdvancedSummaryProps) {
  const { totalXP } = useXP();
  const weekly = useRankingPosition(userId, 'weekly');
  const global = useRankingPosition(userId, 'global');
  const [mission, setMission] = useState<MissionPreview | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('coach_missions')
      .select('title, progress, target')
      .eq('coach_id', coachId)
      .eq('is_completed', false)
      .then(({ data }) => {
        if (cancelled) return;
        const closest = (data ?? []).sort((a, b) => b.progress / b.target - a.progress / a.target)[0];
        setMission(closest ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [coachId]);

  const { currentRank, nextRank, progress } = getXPProgress(totalXP);
  const level = getLevelByXP(totalXP);
  const ranking = weekly.position !== null ? { ...weekly, when: 'esta semana' } : { ...global, when: 'en la general' };

  return (
    <div className="space-y-3">
      <SummaryCard label="Tu carrera" onClick={() => onGoTo('challenges')}>
        <span className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{currentRank.icon}</span>
          <span className="flex-1 min-w-0">
            <span className="block text-lg font-bold text-white leading-tight">{currentRank.name}</span>
            <span className="block text-xs text-gray-400">
              Nivel {level.level} · {totalXP.toLocaleString('es-ES')} XP
              {nextRank && ` · Siguiente: ${nextRank.name}`}
            </span>
            {nextRank && (
              <span className="block w-full bg-black/40 rounded-full h-1.5 overflow-hidden mt-2">
                <span className="block bg-purple-400 h-full rounded-full" style={{ width: `${progress}%` }} />
              </span>
            )}
          </span>
        </span>
      </SummaryCard>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard label="Misión más cerca" onClick={() => onGoTo('challenges')} className="items-start">
          {mission === undefined ? (
            <span className="block h-10 rounded-lg bg-white/5 animate-pulse" />
          ) : mission ? (
            <>
              <span className="block text-sm font-bold text-white leading-snug line-clamp-2">{mission.title}</span>
              <span className="block text-xs text-gray-400 mt-1">
                {mission.progress}/{mission.target}
              </span>
            </>
          ) : (
            <span className="block text-sm text-gray-400">Sin misiones activas</span>
          )}
        </SummaryCard>

        <SummaryCard label="Clasificación" onClick={() => onGoTo('challenges')} className="items-start">
          {ranking.loading ? (
            <span className="block h-10 rounded-lg bg-white/5 animate-pulse" />
          ) : ranking.position !== null ? (
            <>
              <span className="flex items-center gap-1.5 text-2xl font-bold text-white leading-none">
                <Medal size={18} className="text-yellow-400" />
                {ranking.position}º
              </span>
              <span className="block text-xs text-gray-400 mt-1">{ranking.when}</span>
            </>
          ) : (
            <span className="block text-sm text-gray-400">Sin puesto todavía</span>
          )}
        </SummaryCard>
      </div>

      <SummaryCard label="Avisos" onClick={() => onGoTo('alerts')}>
        {alerts.length > 0 ? (
          <span className="flex items-start gap-2">
            <Bell size={16} className="text-orange-300 flex-shrink-0 mt-0.5" />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white leading-snug">{alerts[0].title}</span>
              {alerts.length > 1 && (
                <span className="block text-xs text-gray-400 mt-0.5">
                  y {alerts.length - 1} aviso{alerts.length - 1 === 1 ? '' : 's'} más
                </span>
              )}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-green-400" />
            Todo en orden
          </span>
        )}
      </SummaryCard>

      <SummaryCard label={dna ? `ADN · Equipo ${dna.slot}` : 'ADN del equipo'} onClick={() => onGoTo('team')}>
        {dna ? (
          <span className="flex items-start gap-2">
            <Sparkles size={16} className="text-purple-300 flex-shrink-0 mt-0.5" />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-white">{dna.name}</span>
              <span className="block text-xs text-gray-400">{dna.style}</span>
            </span>
          </span>
        ) : (
          <span className="block text-sm text-gray-400">Añade jugadores a tu alineación para conocer su identidad táctica.</span>
        )}
      </SummaryCard>
    </div>
  );
}
