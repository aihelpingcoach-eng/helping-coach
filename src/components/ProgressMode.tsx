import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { Player } from '../constants/playstyles';
import { supabase } from '../lib/supabase';

export default function ProgressMode() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

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
        user_id: user.id,
      });

    await supabase
      .from('players')
      .update({ level: newLevel })
      .eq('id', currentPlayer.id);

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % players.length);
      loadPlayers();
    }, 300);
  };

  if (players.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center px-4">
        <div className="text-center">
          <Trophy size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No hay jugadores</h2>
          <p className="text-gray-400">Añade jugadores en el modo Tácticas</p>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentIndex];

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] flex flex-col px-4 py-4 md:py-8">
      <div className="flex-shrink-0 text-center mb-3 md:mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">Progreso</h1>
        <p className="text-gray-400 text-xs md:text-base">
          Desliza → mejora, ← retroceso
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full mx-auto min-h-0 mb-2">
        <div className="w-full max-w-sm">
          <div
            className={`relative bg-gradient-to-br from-purple-900/40 to-black border-4 border-purple-500/50 rounded-3xl overflow-hidden transition-all duration-300 h-[65vh] md:h-[75vh] flex flex-col ${
              swipeDirection === 'right' ? 'translate-x-12 rotate-6 opacity-50' : ''
            } ${swipeDirection === 'left' ? '-translate-x-12 -rotate-6 opacity-50' : ''}`}
          >
            <div className="flex-1 relative">
              {currentPlayer.image_url ? (
                <img
                  src={currentPlayer.image_url}
                  alt={currentPlayer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-black flex items-center justify-center">
                  <div className="text-6xl md:text-9xl font-bold text-white/20">
                    {currentPlayer.name.charAt(0)}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 md:p-8 space-y-3 md:space-y-4">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 line-clamp-2">{currentPlayer.name}</h2>
                  {currentPlayer.playstyle && (
                    <div className="inline-block bg-purple-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-white font-bold text-sm md:text-base">
                      {currentPlayer.playstyle}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Trophy size={18} className="text-yellow-400 md:w-6 md:h-6 flex-shrink-0" />
                  <span className="text-lg md:text-2xl font-bold text-white">Nivel {currentPlayer.level}</span>
                </div>
                {currentPlayer.playstyle_explanation && (
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-2">{currentPlayer.playstyle_explanation}</p>
                )}
              </div>

              <div className="absolute top-3 md:top-6 right-3 md:right-6 bg-black/70 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                <span className="text-white font-bold text-xs md:text-sm">
                  {currentIndex + 1} / {players.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="flex justify-center gap-4 md:gap-6">
          <button
            onClick={() => handleSwipe('left')}
            disabled={swipeDirection !== null}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 md:p-5 rounded-full transition-all hover:scale-110 shadow-2xl"
            title="Ha empeorado"
          >
            <ChevronLeft size={24} strokeWidth={3} className="md:w-8 md:h-8" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            disabled={swipeDirection !== null}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 md:p-5 rounded-full transition-all hover:scale-110 shadow-2xl"
            title="Ha mejorado"
          >
            <ChevronRight size={24} strokeWidth={3} className="md:w-8 md:h-8" />
          </button>
        </div>

        <div className="text-center text-gray-400 text-xs pb-1">
          ← Retroceso ({currentPlayer.level > 1 ? currentPlayer.level - 1 : 1}) |
          Mejora ({Math.min(99, currentPlayer.level + 1)}) →
        </div>
      </div>
    </div>
  );
}
