import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Minus, BarChart2, Settings, X, CalendarCheck } from 'lucide-react';
import { useXP } from '../hooks/useXP';
import { Player } from '../constants/playstyles';
import { supabase } from '../lib/supabase';
import { useCoachProfile } from '../hooks/useCoachProfile';
import PlayerHistoryPanel from './progress/PlayerHistoryPanel';
import EmptyState from './EmptyState';
import playerPlaceholder from '../assets/illustrations/player-placeholder.png';

type SwipeDirection = 'left' | 'right' | 'stay';

const DAY_LABELS: { value: number; label: string }[] = [
  { value: 1, label: 'L' },
  { value: 2, label: 'M' },
  { value: 3, label: 'X' },
  { value: 4, label: 'J' },
  { value: 5, label: 'V' },
  { value: 6, label: 'S' },
  { value: 0, label: 'D' },
];

const DAY_NAMES: Record<number, string> = {
  0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miércoles',
  4: 'jueves', 5: 'viernes', 6: 'sábado',
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextAllowedDayLabel(allowedDays: number[]): string | null {
  if (allowedDays.length === 0) return null;
  const today = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const day = (today + i) % 7;
    if (allowedDays.includes(day)) return DAY_NAMES[day];
  }
  return null;
}

function DaySettingsModal({
  selectedDays,
  onSave,
  onClose,
}: {
  selectedDays: number[];
  onSave: (days: number[]) => void;
  onClose: () => void;
}) {
  const [days, setDays] = useState<number[]>(selectedDays);

  const toggleDay = (value: number) => {
    setDays(prev => prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <CalendarCheck className="text-purple-400" size={22} />
          <h2 className="text-lg font-bold text-white">Días de evaluación</h2>
        </div>
        <p className="text-gray-400 text-sm mb-5">
          Elige qué días quieres hacer la ronda de progreso de tus jugadores. Solo podrás hacerla una vez al día, en los días marcados.
        </p>

        <div className="flex justify-between gap-1.5 mb-6">
          {DAY_LABELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleDay(value)}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                days.includes(value)
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { onSave(days); onClose(); }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function ProgressMode() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection | null>(null);
  const [historyPlayer, setHistoryPlayer] = useState<Player | null>(null);
  const [showDaySettings, setShowDaySettings] = useState(false);
  const { giveXP } = useXP();
  const { profile, updateProfile } = useCoachProfile();

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

  const handleSwipe = async (direction: SwipeDirection) => {
    if (players.length === 0) return;

    const currentPlayer = players[currentIndex];
    const levelChange = direction === 'right' ? 1 : direction === 'left' ? -1 : 0;
    const newLevel = Math.max(1, Math.min(99, currentPlayer.level + levelChange));
    const isLastOfRound = currentIndex === players.length - 1;

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

    if (levelChange !== 0) {
      await supabase
        .from('players')
        .update({ level: newLevel })
        .eq('id', currentPlayer.id);
    }

    giveXP('EVALUATE_PLAYER');

    if (isLastOfRound) {
      updateProfile({ last_swipe_session_date: todayISO() });
    }

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

  const allowedDays = profile?.progress_swipe_days ?? [0, 1, 2, 3, 4, 5, 6];
  const todayAllowed = allowedDays.includes(new Date().getDay());
  const doneToday = profile?.last_swipe_session_date === todayISO();
  const roundLocked = !todayAllowed || doneToday;

  if (roundLocked) {
    const nextDay = nextAllowedDayLabel(allowedDays);
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="bg-purple-900/30 border border-purple-500/40 rounded-full p-4">
          <CalendarCheck className="text-purple-400" size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-1">
            {doneToday ? 'Ya evaluaste hoy' : 'Hoy no toca evaluar'}
          </h1>
          <p className="text-gray-400 text-sm">
            {nextDay
              ? `Vuelve el próximo ${nextDay} para tu ronda de progreso.`
              : 'Configura tus días de evaluación para empezar.'}
          </p>
        </div>
        <button
          onClick={() => setShowDaySettings(true)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <Settings size={16} />
          Cambiar días de evaluación
        </button>

        {showDaySettings && (
          <DaySettingsModal
            selectedDays={allowedDays}
            onSave={(days) => updateProfile({ progress_swipe_days: days })}
            onClose={() => setShowDaySettings(false)}
          />
        )}
      </div>
    );
  }

  const currentPlayer = players[currentIndex];

  return (
    <div className="relative w-full flex flex-col px-4 pt-4 pb-4 min-h-[calc(100svh-10rem)]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2 mb-2 relative">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Progreso</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Toca la tarjeta para ver historial · {currentIndex + 1}/{players.length}
          </p>
        </div>
        <button
          onClick={() => setShowDaySettings(true)}
          className="absolute right-0 text-gray-500 hover:text-white transition-colors p-1.5"
          title="Días de evaluación"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-xs">
          <div
            className={`relative bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
              swipeDirection === 'right' ? 'translate-x-12 rotate-6 opacity-50' : ''
            } ${swipeDirection === 'left' ? '-translate-x-12 -rotate-6 opacity-50' : ''} ${
              swipeDirection === 'stay' ? 'scale-95 opacity-50' : ''
            }`}
            style={{ height: 'min(48vh, 340px)' }}
            onClick={() => !swipeDirection && setHistoryPlayer(currentPlayer)}
          >
            <img
              src={currentPlayer.image_url || playerPlaceholder}
              alt={currentPlayer.name}
              className="w-full h-full object-cover"
            />

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
      <div className="flex-shrink-0 flex justify-center items-start gap-4 pt-3">
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
          onClick={() => handleSwipe('stay')}
          disabled={swipeDirection !== null}
          className="flex flex-col items-center gap-1 group pt-1"
          title="Se mantiene"
        >
          <div className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 group-disabled:bg-gray-700 text-white w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-gray-900/40 disabled:shadow-none">
            <Minus size={22} strokeWidth={3} />
          </div>
          <span className="text-gray-400 text-xs font-semibold">
            Mantiene ({currentPlayer.level})
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

      {showDaySettings && (
        <DaySettingsModal
          selectedDays={allowedDays}
          onSave={(days) => updateProfile({ progress_swipe_days: days })}
          onClose={() => setShowDaySettings(false)}
        />
      )}
    </div>
  );
}
