import { useState, useEffect } from 'react';
import { Trophy, User, Crown, Medal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RankingRow {
  user_id: string;
  coach_name: string;
  team_name: string;
  profile_photo: string;
  total_xp: number;
  rank: string;
}

const MEDAL_COLORS = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];

export default function LeaderboardPanel() {
  const { user } = useAuth();
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('coach_rankings')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) setRows(data as RankingRow[]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-10">
        <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Todavía no hay entrenadores en la clasificación</p>
      </div>
    );
  }

  const myPosition = rows.findIndex(r => r.user_id === user?.id);

  return (
    <div className="space-y-2">
      {rows.map((row, index) => {
        const isMe = row.user_id === user?.id;
        const position = index + 1;
        return (
          <div
            key={row.user_id}
            className={`flex items-center gap-3 rounded-xl p-3 border transition-colors ${
              isMe
                ? 'bg-purple-900/40 border-purple-500/60'
                : 'bg-gray-900/50 border-gray-700/50'
            }`}
          >
            <div className="w-8 flex-shrink-0 flex items-center justify-center font-bold">
              {position <= 3 ? (
                <Medal size={20} className={MEDAL_COLORS[position - 1]} />
              ) : (
                <span className="text-gray-500 text-sm">{position}</span>
              )}
            </div>

            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-700 flex items-center justify-center flex-shrink-0">
              {row.profile_photo ? (
                <img src={row.profile_photo} alt={row.coach_name} className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate flex items-center gap-1.5">
                {row.coach_name || 'Entrenador'}
                {isMe && <span className="text-purple-400 text-xs font-normal">(tú)</span>}
              </p>
              <p className="text-gray-500 text-xs truncate">{row.team_name || row.rank}</p>
            </div>

            <div className="flex items-center gap-1 text-purple-300 font-bold text-sm flex-shrink-0">
              <Crown size={14} className="text-yellow-400" />
              {row.total_xp.toLocaleString()}
            </div>
          </div>
        );
      })}

      {myPosition === -1 && (
        <p className="text-center text-gray-500 text-xs pt-2">Aún no apareces en la clasificación</p>
      )}
    </div>
  );
}
