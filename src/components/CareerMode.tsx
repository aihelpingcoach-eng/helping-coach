import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Target, Award, Users, BarChart3 } from 'lucide-react';
import { CoachCareer, COACH_RANKS } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';

interface CareerModeProps {
  coachId: string;
}

export default function CareerMode({ coachId }: CareerModeProps) {
  const [career, setCareer] = useState<CoachCareer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareer();
  }, [coachId]);

  const loadCareer = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_career')
        .select('*')
        .eq('coach_id', coachId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        await createCareer();
      } else {
        setCareer(data);
      }
    } catch (error) {
      console.error('Error loading career:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCareer = async () => {
    try {
      const { data, error } = await supabase
        .from('coach_career')
        .insert({
          coach_id: coachId,
          coaching_style: 'balanced',
          reputation: 0,
          total_xp: 0,
          current_rank: 'amateur',
          matches_managed: 0,
          tactical_decisions: 0,
          missions_completed: 0,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      setCareer(data);
    } catch (error) {
      console.error('Error creating career:', error);
    }
  };

  const getCurrentRank = () => {
    if (!career) return COACH_RANKS[0];
    return COACH_RANKS.find(rank => rank.id === career.current_rank) || COACH_RANKS[0];
  };

  const getNextRank = () => {
    const currentRankIndex = COACH_RANKS.findIndex(rank => rank.id === career?.current_rank);
    if (currentRankIndex === -1 || currentRankIndex >= COACH_RANKS.length - 1) return null;
    return COACH_RANKS[currentRankIndex + 1];
  };

  const getXPProgress = () => {
    if (!career) return 0;
    const currentRank = getCurrentRank();
    const nextRank = getNextRank();

    if (!nextRank) return 100;

    const xpInCurrentRank = career.total_xp - currentRank.minXP;
    const xpNeededForNext = nextRank.minXP - currentRank.minXP;

    return Math.min((xpInCurrentRank / xpNeededForNext) * 100, 100);
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8">
        <p className="text-gray-400 text-center">Cargando modo carrera...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">No se pudo cargar la información de carrera</p>
      </div>
    );
  }

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();
  const xpProgress = getXPProgress();

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-br ${currentRank.color} rounded-2xl p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 text-9xl opacity-10">
          <Trophy />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-white" size={32} />
            <div>
              <p className="text-white/70 text-sm font-medium">Rango Actual</p>
              <h2 className="text-3xl font-bold text-white">{currentRank.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-white/70 text-xs mb-1">Experiencia Total</p>
              <p className="text-2xl font-bold text-white">{career.total_xp} XP</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-white/70 text-xs mb-1">Reputación</p>
              <p className="text-2xl font-bold text-white">{career.reputation}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-white/70 text-xs mb-1">Partidos</p>
              <p className="text-2xl font-bold text-white">{career.matches_managed}</p>
            </div>
          </div>

          {nextRank && (
            <div>
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Progreso al siguiente rango</span>
                <span className="font-bold">{Math.floor(xpProgress)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden mb-2">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-white/70 text-xs">
                Próximo rango: <span className="font-bold">{nextRank.name}</span> ({nextRank.minXP} XP)
              </p>
            </div>
          )}

          {!nextRank && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
              <p className="text-yellow-200 text-sm font-bold">¡Máximo rango alcanzado!</p>
              <p className="text-yellow-200/70 text-xs">Eres un Entrenador Legendario</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-400" size={24} />
            <h3 className="text-lg font-bold text-white">Estadísticas de Carrera</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-yellow-400" size={18} />
                <span className="text-gray-300">Decisiones Tácticas</span>
              </div>
              <span className="text-white font-bold">{career.tactical_decisions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="text-green-400" size={18} />
                <span className="text-gray-300">Misiones Completadas</span>
              </div>
              <span className="text-white font-bold">{career.missions_completed}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-purple-400" size={18} />
                <span className="text-gray-300">Estilo de Entrenamiento</span>
              </div>
              <span className="text-white font-bold capitalize">{career.coaching_style}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-400" size={24} />
            <h3 className="text-lg font-bold text-white">Rangos Disponibles</h3>
          </div>

          <div className="space-y-2">
            {COACH_RANKS.map((rank, index) => {
              const isUnlocked = career.total_xp >= rank.minXP;
              const isCurrent = rank.id === career.current_rank;

              return (
                <div
                  key={rank.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    isCurrent ? 'bg-blue-900/30 border border-blue-500' : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <Trophy className="text-yellow-400" size={16} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                    )}
                    <span className={`text-sm ${isUnlocked ? 'text-white font-medium' : 'text-gray-500'}`}>
                      {rank.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{rank.minXP} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
