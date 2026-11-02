import { useState, useEffect } from 'react';
import { Trophy, User, Crown, Medal, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { RANKING_SOURCE, RankingScope, useRankingPosition } from '../hooks/useRankingPosition';
import { supabase } from '../lib/supabase';
import CoachProfileModal, { RankingRow } from './CoachProfileModal';

const MEDAL_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];
const LIMIT = 100;

interface LeaderboardPanelProps {
  /** Abre Perfil, donde se decide si aparecer en la clasificación */
  onOpenProfile?: () => void;
}

export default function LeaderboardPanel({ onOpenProfile }: LeaderboardPanelProps) {
  const { user } = useAuth();
  const { profile } = useCoachProfile();
  const [scope, setScope] = useState<RankingScope>('weekly');
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<RankingRow | null>(null);
  const me = useRankingPosition(user?.id, scope);
  const hidden = profile?.show_in_ranking === false;

  useEffect(() => {
    let cancelled = false;
    const { view, xpColumn } = RANKING_SOURCE[scope];
    setLoading(true);
    supabase
      .from(view)
      .select('*')
      .order(xpColumn, { ascending: false })
      .limit(LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        setUnavailable(!!error);
        setRows(!error && data ? (data as RankingRow[]) : []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const xpOf = (row: RankingRow) => (scope === 'weekly' ? row.weekly_xp ?? 0 : row.total_xp);
  const inList = rows.some(r => r.user_id === user?.id);

  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10" role="group" aria-label="Periodo de la clasificación">
        {(['weekly', 'global'] as const).map(s => (
          <button
            key={s}
            type="button"
            aria-pressed={scope === s}
            onClick={() => setScope(s)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              scope === s ? 'bg-purple-600/30 text-purple-100' : 'text-gray-400 hover:text-white'
            }`}
          >
            {s === 'weekly' ? 'Esta semana' : 'Global'}
          </button>
        ))}
      </div>

      {scope === 'weekly' && !unavailable && (
        <p className="text-xs text-gray-500">XP ganada desde el lunes. Se reinicia cada semana.</p>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : unavailable ? (
        <div className="text-center py-8">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">La clasificación semanal estará disponible muy pronto.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {scope === 'weekly'
              ? 'Nadie ha sumado XP esta semana todavía. ¡Sé el primero!'
              : 'Todavía no hay entrenadores en la clasificación.'}
          </p>
        </div>
      ) : (
        <ol className="space-y-2">
          {rows.map((row, index) => {
            const isMe = row.user_id === user?.id;
            const position = index + 1;
            return (
              <li key={row.user_id}>
                <button
                  type="button"
                  onClick={() => setSelectedCoach(row)}
                  aria-label={`Puesto ${position}: ${row.coach_name || 'Entrenador'}, ${xpOf(row)} XP`}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 border transition-colors text-left active:scale-[0.99] ${
                    isMe ? 'bg-purple-900/40 border-purple-500/60 hover:border-purple-500' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="w-7 flex-shrink-0 flex items-center justify-center font-bold">
                    {position <= 3 ? (
                      <Medal size={20} className={MEDAL_COLORS[position - 1]} />
                    ) : (
                      <span className="text-gray-500 text-sm">{position}</span>
                    )}
                  </span>

                  <span className="w-10 h-10 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center flex-shrink-0">
                    {row.profile_photo ? (
                      <img src={row.profile_photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm truncate flex items-center gap-1.5">
                      {row.coach_name || 'Entrenador'}
                      {isMe && <span className="text-purple-300 text-xs font-normal">(tú)</span>}
                    </span>
                    <span className="block text-gray-500 text-xs truncate">{row.team_name || row.rank}</span>
                  </span>

                  <span className="flex items-center gap-1 text-purple-200 font-bold text-sm flex-shrink-0">
                    <Crown size={14} className="text-yellow-400" />
                    {scope === 'weekly' && '+'}
                    {xpOf(row).toLocaleString('es-ES')}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {/* Tu puesto, también cuando estás fuera de los 100 primeros */}
      {!loading && !unavailable && (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          {hidden ? (
            <p className="flex items-start gap-2 text-gray-300">
              <EyeOff size={16} className="flex-shrink-0 mt-0.5 text-gray-400" />
              No apareces en la clasificación porque lo has desactivado en tu perfil.
            </p>
          ) : me.position !== null ? (
            !inList && (
              <p className="text-gray-300">
                Tú: <strong className="text-white">puesto {me.position}</strong> · {me.xp.toLocaleString('es-ES')} XP
                {scope === 'weekly' && ' esta semana'}
              </p>
            )
          ) : (
            <p className="text-gray-400">
              {scope === 'weekly' ? 'Aún no has sumado XP esta semana.' : 'Aún no apareces en la clasificación.'}
            </p>
          )}
          {onOpenProfile && (
            <button type="button" onClick={onOpenProfile} className="mt-1 text-xs font-semibold text-purple-300 hover:text-purple-200">
              {hidden ? 'Volver a aparecer desde tu perfil' : 'Puedes ocultarte de la clasificación desde tu perfil'}
            </button>
          )}
        </div>
      )}

      {selectedCoach && <CoachProfileModal coach={selectedCoach} onClose={() => setSelectedCoach(null)} />}
    </div>
  );
}
