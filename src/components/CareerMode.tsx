import { useState, useEffect } from 'react';
import { Trophy, Calendar, Dumbbell, Award, TrendingUp, Info } from 'lucide-react';
import { RANKS, getXPProgress } from '../constants/progression';
import { getLevelByXP } from '../constants/levels';
import { useXP } from '../hooks/useXP';
import { supabase } from '../lib/supabase';
import { Match } from '../hooks/useMatches';
import { TrainingSession } from '../hooks/useTrainingSessions';

interface CareerModeProps {
  coachId: string;
  matches: Match[];
  sessions: TrainingSession[];
}

// Antes leía reputación, partidos y decisiones de la tabla coach_career, que
// nada actualizaba (siempre 0). Ahora todo sale de la actividad real.
export default function CareerMode({ coachId, matches, sessions }: CareerModeProps) {
  const { totalXP } = useXP();
  const [missionsCompleted, setMissionsCompleted] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('coach_missions')
      .select('id', { count: 'exact', head: true })
      .eq('coach_id', coachId)
      .eq('is_completed', true)
      .then(({ count }) => {
        if (!cancelled) setMissionsCompleted(count ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [coachId]);

  const played = matches.filter(m => m.result !== null);
  const wins = played.filter(m => m.result === 'win').length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const { currentRank, nextRank, progress, currentRankXP, xpForNextRank } = getXPProgress(totalXP);
  const level = getLevelByXP(totalXP);
  const isNewCareer = totalXP < 100 && played.length === 0 && completedSessions === 0;

  const stats = [
    { icon: Calendar, label: 'Partidos jugados', value: played.length },
    { icon: Trophy, label: 'Victorias', value: wins },
    { icon: Dumbbell, label: 'Entrenamientos', value: completedSessions },
    { icon: Award, label: 'Misiones completadas', value: missionsCompleted ?? '–' },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-black p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl" aria-hidden="true">{currentRank.icon}</span>
          <div className="min-w-0">
            <p className="text-purple-200/80 text-xs font-medium">Rango actual</p>
            <h3 className="text-2xl font-bold text-white leading-tight">{currentRank.name}</h3>
            <p className="text-gray-400 text-xs">
              Nivel {level.level} · {level.name} · {totalXP.toLocaleString('es-ES')} XP
            </p>
          </div>
        </div>

        {nextRank ? (
          <>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
              <span>Hacia {nextRank.name}</span>
              <span className="font-bold">
                {currentRankXP.toLocaleString('es-ES')} / {xpForNextRank.toLocaleString('es-ES')} XP
              </span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <p className="text-yellow-200 text-sm font-bold">¡Has alcanzado el rango máximo!</p>
        )}

        <p className="flex gap-2 text-[11px] leading-snug text-gray-400 mt-4">
          <Info size={14} className="flex-shrink-0 mt-px" />
          El rango marca tu etapa como entrenador (hay {RANKS.length}). El nivel, que también ves en tu perfil, avanza más a
          menudo dentro de cada etapa.
        </p>
      </div>

      {isNewCareer && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4 flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">🚀</span>
          <div>
            <p className="text-purple-100 font-bold text-sm">¡Tu carrera acaba de empezar!</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Registra partidos, completa entrenamientos y misiones para ganar XP y subir de rango.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <Icon size={18} className="text-purple-300 mb-2" />
            <p className="text-2xl font-bold text-white leading-none">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="text-purple-300" size={18} />
          <h4 className="text-sm font-bold text-white">Todos los rangos</h4>
        </div>
        <ul className="space-y-1.5">
          {RANKS.map(rank => {
            const isUnlocked = totalXP >= rank.xpRequired;
            const isCurrent = rank.id === currentRank.id;
            return (
              <li
                key={rank.id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl ${
                  isCurrent ? 'bg-purple-600/25 border border-purple-500/50' : 'bg-white/[0.03]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={isUnlocked ? '' : 'opacity-30'} aria-hidden="true">{rank.icon}</span>
                  <span className={`text-sm ${isUnlocked ? 'text-white font-medium' : 'text-gray-500'}`}>{rank.name}</span>
                </span>
                <span className="text-xs text-gray-400">{rank.xpRequired.toLocaleString('es-ES')} XP</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
