import { useState, useEffect, useMemo } from 'react';
import { BarChart3, Trophy, Dumbbell, TrendingUp, Users, Download } from 'lucide-react';
import { downloadTextFile, buildTeamStatsText } from '../utils/exportReport';
import { useMatches } from '../hooks/useMatches';
import { useTrainingSessions } from '../hooks/useTrainingSessions';
import { supabase } from '../lib/supabase';

interface PlayerRow {
  id: string;
  name: string;
  position: string;
  level: number;
}

interface ProgressRow {
  level_change: number;
  swipe_direction: string;
}

interface TeamStatsPanelProps {
  userId: string;
}

export default function TeamStatsPanel({ userId }: TeamStatsPanelProps) {
  const { matches } = useMatches(userId);
  const { sessions } = useTrainingSessions(userId);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('players')
      .select('id, name, position, level')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (!error && data) {
          const rows = data as PlayerRow[];
          setPlayers(rows);
          if (rows.length > 0) {
            const ids = rows.map(p => p.id);
            supabase
              .from('player_progress')
              .select('level_change, swipe_direction')
              .in('player_id', ids)
              .then(({ data: prog, error: progErr }) => {
                if (!progErr && prog) setProgress(prog as ProgressRow[]);
              });
          }
        }
      });
  }, [userId]);

  const matchStats = useMemo(() => {
    const played = matches.filter(m => m.result !== null);
    const wins = played.filter(m => m.result === 'win').length;
    const draws = played.filter(m => m.result === 'draw').length;
    const losses = played.filter(m => m.result === 'loss').length;
    const goalsFor = played.reduce((sum, m) => sum + (m.score_for ?? 0), 0);
    const goalsAgainst = played.reduce((sum, m) => sum + (m.score_against ?? 0), 0);
    const winRate = played.length > 0 ? Math.round((wins / played.length) * 100) : 0;
    return { total: played.length, wins, draws, losses, goalsFor, goalsAgainst, winRate };
  }, [matches]);

  const playerStats = useMemo(() => {
    if (players.length === 0) return { total: 0, avgLevel: 0, byPosition: {} as Record<string, number> };
    const avgLevel = Math.round(players.reduce((sum, p) => sum + p.level, 0) / players.length);
    const byPosition: Record<string, number> = {};
    for (const p of players) {
      const pos = p.position || 'Sin posición';
      byPosition[pos] = (byPosition[pos] ?? 0) + 1;
    }
    return { total: players.length, avgLevel, byPosition };
  }, [players]);

  const trainingStats = useMemo(() => {
    const total = sessions.length;
    const completed = sessions.filter(s => s.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending: total - completed, rate };
  }, [sessions]);

  const progressStats = useMemo(() => {
    const improvements = progress.filter(p => p.level_change > 0).length;
    const regressions = progress.filter(p => p.level_change < 0).length;
    const total = progress.length;
    const rate = total > 0 ? Math.round((improvements / total) * 100) : 0;
    return { total, improvements, regressions, rate };
  }, [progress]);

  const maxPositionCount = Math.max(...Object.values(playerStats.byPosition), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-yellow-400" size={24} />
          <h2 className="text-xl font-bold text-white">Estadísticas del Equipo</h2>
        </div>
        <button
          onClick={() => {
            const text = buildTeamStatsText({
              wins: matchStats.wins, draws: matchStats.draws, losses: matchStats.losses,
              goalsFor: matchStats.goalsFor, goalsAgainst: matchStats.goalsAgainst,
              winRate: matchStats.winRate,
              totalPlayers: playerStats.total, avgLevel: playerStats.avgLevel,
              byPosition: playerStats.byPosition,
              totalSessions: trainingStats.total, completedSessions: trainingStats.completed,
              trainingRate: trainingStats.rate,
              totalEvals: progressStats.total, improvements: progressStats.improvements,
              regressions: progressStats.regressions, progressRate: progressStats.rate,
            });
            downloadTextFile(text, `estadisticas-equipo-${new Date().toISOString().slice(0, 10)}.txt`);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/40 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={14} />
          Exportar
        </button>
      </div>

      {/* Match stats */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-400" size={20} />
          <h3 className="text-lg font-bold text-white">Rendimiento en Partidos</h3>
        </div>

        {matchStats.total === 0 ? (
          <p className="text-gray-500 text-sm">Sin partidos registrados</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-900/40 border border-green-700/50 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-green-400">{matchStats.wins}</p>
                <p className="text-xs text-green-300/70 mt-1">Victorias</p>
              </div>
              <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-yellow-400">{matchStats.draws}</p>
                <p className="text-xs text-yellow-300/70 mt-1">Empates</p>
              </div>
              <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-red-400">{matchStats.losses}</p>
                <p className="text-xs text-red-300/70 mt-1">Derrotas</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{matchStats.goalsFor}</p>
                <p className="text-xs text-gray-400 mt-1">Goles a favor</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{matchStats.goalsAgainst}</p>
                <p className="text-xs text-gray-400 mt-1">Goles en contra</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${matchStats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                  {matchStats.winRate}%
                </p>
                <p className="text-xs text-gray-400 mt-1">Win rate</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Player stats */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-blue-400" size={20} />
          <h3 className="text-lg font-bold text-white">Plantilla</h3>
        </div>

        {playerStats.total === 0 ? (
          <p className="text-gray-500 text-sm">Sin jugadores registrados</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-white">{playerStats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Jugadores</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-3xl font-bold text-purple-400">{playerStats.avgLevel}</p>
                <p className="text-xs text-gray-400 mt-1">Nivel promedio</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Por posición</p>
              {Object.entries(playerStats.byPosition).map(([pos, count]) => (
                <div key={pos} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 w-32 truncate">{pos}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxPositionCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Training stats */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="text-orange-400" size={20} />
          <h3 className="text-lg font-bold text-white">Entrenamiento</h3>
        </div>

        {trainingStats.total === 0 ? (
          <p className="text-gray-500 text-sm">Sin sesiones registradas</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{trainingStats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Total sesiones</p>
              </div>
              <div className="bg-green-900/40 border border-green-700/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{trainingStats.completed}</p>
                <p className="text-xs text-green-300/70 mt-1">Completadas</p>
              </div>
              <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">{trainingStats.pending}</p>
                <p className="text-xs text-yellow-300/70 mt-1">Pendientes</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Tasa de finalización</span>
                <span className="font-bold text-white">{trainingStats.rate}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${trainingStats.rate}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progression stats */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-400" size={20} />
          <h3 className="text-lg font-bold text-white">Progresión de Jugadores</h3>
        </div>

        {progressStats.total === 0 ? (
          <p className="text-gray-500 text-sm">Sin evaluaciones registradas</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{progressStats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Evaluaciones</p>
              </div>
              <div className="bg-green-900/40 border border-green-700/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{progressStats.improvements}</p>
                <p className="text-xs text-green-300/70 mt-1">Mejoras</p>
              </div>
              <div className="bg-red-900/40 border border-red-700/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{progressStats.regressions}</p>
                <p className="text-xs text-red-300/70 mt-1">Retrocesos</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Tasa de mejora positiva</span>
                <span className="font-bold text-white">{progressStats.rate}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressStats.rate}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
