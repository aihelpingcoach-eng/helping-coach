import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { useXP } from '../hooks/useXP';
import { Player } from '../constants/playstyles';
import { supabase } from '../lib/supabase';
import PlayerHistoryPanel from './progress/PlayerHistoryPanel';
import EmptyState from './EmptyState';

export default function ProgressMode() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [historyPlayer, setHistoryPlayer] = useState<Player | null>(null);
  const { giveXP } = useXP();

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPlayers(data);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (players.length === 0) return;

    const currentPlayer = players[currentIndex];
    const levelChange = direction === 'right' ? 1 : -1;
    const newLevel = Math.max(1, Math.min(99, currentPlayer.level + levelChange));

    setSwipeDirection(direction);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('player_progress')
      .insert({
        player_id: currentPlayer.id,
        swipe_direction: direction,
        level_change: levelChange,
        level_after: newLevel,
        user_id: user.id,
      });

    await supabase
      .from('players')
      .update({ level: newLevel })
      .eq('id', currentPlayer.id);

    giveXP('EVALUATE_PLAYER');

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % players.length);
      loadPlayers();
    }, 300);
  };

  if (players.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center px-4">
        <EmptyState
          variant="players"
          title="No hay jugadores"
          subtitle="Añade jugadores en el modo Tácticas"
        />
      </div>
    );
  }

  const currentPlayer = players[currentIndex];

  return (
    <div className="relative w-full flex flex-col px-4 pt-4 pb-4 min-h-[calc(100svh-10rem)]">
      {/* Header */}
      <div className="flex-shrink-0 text-center mb-2">
        <h1 className="text-xl font-bold text-white">Progreso</h1>
        <p className="text-gray-500 text-xs mt-0.5">
          Toca la tarjeta para ver historial · {currentIndex + 1}/{players.length}
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-xs">
          <div
            className={`relative bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
              swipeDirection === 'right' ? 'translate-x-12 rotate-6 opacity-50' : ''
            } ${swipeDirection === 'left' ? '-translate-x-12 -rotate-6 opacity-50' : ''}`}
            style={{ height: 'min(48vh, 340px)' }}
            onClick={() => !swipeDirection && setHistoryPlayer(currentPlayer)}
          >
            {currentPlayer.image_url ? (
              <img
                src={currentPlayer.image_url}
                alt={currentPlayer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-black flex items-center justify-center">
                <div className="text-7xl font-bold text-white/20">
                  {currentPlayer.name.charAt(0)}
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
              <h2 className="text-lg font-bold text-white line-clamp-1">{currentPlayer.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {currentPlayer.playstyle && (
                  <span className="bg-purple-600 px-2 py-0.5 rounded-full text-white font-semibold text-xs">
                    {currentPlayer.playstyle}
                  </span>
                )}
                <span className="bg-yellow-500/20 border border-yellow-500/40 px-2 py-0.5 rounded-full text-yellow-300 font-bold text-xs">
                  Niv. {currentPlayer.level}
                </span>
              </div>
              {currentPlayer.playstyle_explanation && (
                <p className="text-gray-400 text-xs line-clamp-2">{currentPlayer.playstyle_explanation}</p>
              )}
            </div>

            {/* Historial button */}
            <button
              onClick={e => { e.stopPropagation(); setHistoryPlayer(currentPlayer); }}
              className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm p-1.5 rounded-full text-purple-400 hover:text-purple-300 transition-colors"
              title="Ver historial"
            >
              <BarChart2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-shrink-0 flex justify-center gap-6 pt-3">
        <button
          onClick={() => handleSwipe('left')}
          disabled={swipeDirection !== null}
          className="flex flex-col items-center gap-1 group"
          title="Ha empeorado"
        >
          <div className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 group-disabled:bg-gray-700 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-900/40 disabled:shadow-none">
            <ChevronLeft size={28} strokeWidth={3} />
          </div>
          <span className="text-red-400 text-xs font-semibold">
            Retroceso ({currentPlayer.level > 1 ? currentPlayer.level - 1 : 1})
          </span>
        </button>

        <button
          onClick={() => handleSwipe('right')}
          disabled={swipeDirection !== null}
          className="flex flex-col items-center gap-1 group"
          title="Ha mejorado"
        >
          <div className="bg-green-600 hover:bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-green-900/40">
            <ChevronRight size={28} strokeWidth={3} />
          </div>
          <span className="text-green-400 text-xs font-semibold">
            Mejora ({Math.min(99, currentPlayer.level + 1)})
          </span>
        </button>
      </div>

      {historyPlayer && (
        <PlayerHistoryPanel
          player={historyPlayer}
          onClose={() => setHistoryPlayer(null)}
        />
      )}
    </div>
  );
}
