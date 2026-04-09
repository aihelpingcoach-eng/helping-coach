import { useState, useRef, useEffect } from 'react';
import { X, Dumbbell, Shield, AlertCircle, ArrowRight, Star, Zap } from 'lucide-react';
import { Player, PLAYSTYLE_CATEGORIES } from '../constants/playstyles';

interface PlayerProfileProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  allPlayers: Player[];
}

export default function PlayerProfile({ player, isOpen, onClose, allPlayers }: PlayerProfileProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'synergies' | 'history'>('summary');
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.changedTouches[0].screenY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const diff = e.changedTouches[0].screenY - touchStartY;
      if (diff > 100) {
        onClose();
      }
    };

    if (isOpen && modalRef.current) {
      modalRef.current.addEventListener('touchstart', handleTouchStart, false);
      modalRef.current.addEventListener('touchend', handleTouchEnd, false);

      return () => {
        modalRef.current?.removeEventListener('touchstart', handleTouchStart);
        modalRef.current?.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, touchStartY, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPlaystyleColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      'Finalización': 'from-red-500 to-red-600',
      'Pase': 'from-blue-500 to-blue-600',
      'Control de balón': 'from-emerald-500 to-emerald-600',
      'Defensa': 'from-slate-500 to-slate-600',
      'Físico': 'from-orange-500 to-orange-600',
      'Portero': 'from-purple-500 to-purple-600',
    };
    return colorMap[category || ''] || 'from-purple-500 to-purple-600';
  };

  const synergies = allPlayers
    .filter(p => p.id !== player.id && p.playstyle_category === player.playstyle_category)
    .slice(0, 3);

  const stats = {
    overall: Math.min(99, player.level * 8 + 40),
    pace: Math.random() * 30 + 60,
    shooting: Math.random() * 30 + 60,
    passing: Math.random() * 30 + 60,
    dribbling: Math.random() * 30 + 60,
    defense: Math.random() * 30 + 60,
    physical: Math.random() * 30 + 60,
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-0 right-0 max-w-2xl mx-auto rounded-t-3xl bg-gradient-to-b from-slate-900 to-black overflow-hidden transition-all duration-300 ${
          isOpen ? 'translate-y-0 shadow-2xl' : 'translate-y-full'
        } max-h-[90vh] flex flex-col`}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-purple-500/40 rounded-full" />
        </div>

        {/* Header */}
        <div className="relative px-4 sm:px-6 py-4 border-b border-purple-500/20 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="flex gap-4 items-start pr-12">
            {/* Player Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-full h-full rounded-lg object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="w-full h-full rounded-lg border-2 border-purple-500 bg-black/50 flex items-center justify-center">
                  <Zap size={32} className="text-purple-400" />
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="flex-1 pt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{player.name}</h2>
              <p className="text-purple-300 text-sm mb-2">LVL {player.level}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${getPlaystyleColor(
                    player.playstyle_category
                  )} text-white`}
                >
                  {player.playstyle}
                </span>
                {player.position && (
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/30 text-blue-200">
                    {player.position}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 pt-4 border-b border-purple-500/20 overflow-x-auto flex-shrink-0">
          {(['summary', 'synergies', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab === 'summary' && 'Resumen'}
              {tab === 'synergies' && 'Sinergias'}
              {tab === 'history' && 'Historial'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {activeTab === 'summary' && (
            <div className="space-y-5">
              {/* Overall Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Overall</p>
                  <p className="text-3xl font-bold text-purple-400">{Math.round(stats.overall)}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Nivel</p>
                  <p className="text-3xl font-bold text-blue-400">{player.level}</p>
                </div>
              </div>

              {/* Player Stats */}
              <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4 space-y-3">
                <h3 className="text-white font-semibold mb-3">Atributos</h3>
                {[
                  { label: 'Ritmo', value: stats.pace },
                  { label: 'Disparo', value: stats.shooting },
                  { label: 'Pase', value: stats.passing },
                  { label: 'Regate', value: stats.dribbling },
                  { label: 'Defensa', value: stats.defense },
                  { label: 'Físico', value: stats.physical },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300 text-sm">{stat.label}</span>
                      <span className="text-purple-300 font-semibold">{Math.round(stat.value)}</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2 border border-purple-500/30 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-white font-semibold mb-2">Descripción</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{player.description}</p>
              </div>

              {/* Análisis IA */}
              <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-2 items-start">
                  <Zap size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">Análisis IA</h3>
                    <p className="text-blue-200 text-sm">
                      {player.playstyle_explanation ||
                        `${player.name} destaca en ${player.playstyle_category?.toLowerCase() || 'su rol'}. Es un jugador versátil que puede adaptarse a diferentes tácticas.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'synergies' && (
            <div className="space-y-4">
              {synergies.length > 0 ? (
                <>
                  <p className="text-slate-300 text-sm">
                    Jugadores con mejor compatibilidad en {player.playstyle_category?.toLowerCase()}
                  </p>
                  {synergies.map((synergy) => (
                    <div
                      key={synergy.id}
                      className="bg-black/50 border border-purple-500/20 rounded-lg p-3 flex items-center justify-between group hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {synergy.image_url ? (
                          <img
                            src={synergy.image_url}
                            alt={synergy.name}
                            className="w-10 h-10 rounded border border-purple-500/50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded border border-purple-500/50 bg-black/50 flex items-center justify-center">
                            <Zap size={16} className="text-purple-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-semibold text-sm">{synergy.name}</p>
                          <p className="text-slate-400 text-xs">LVL {synergy.level}</p>
                        </div>
                      </div>
                      <Star size={18} className="text-purple-400" />
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Agrega más jugadores con {player.playstyle_category?.toLowerCase()} para ver sinergias</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Star size={20} className="text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Creado</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(player.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowRight size={20} className="text-blue-400" />
                  <div>
                    <p className="text-white font-semibold">Última actualización</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(player.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  Evolución de nivel: {player.level} • Próximo nivel en {Math.round(20 - (player.level % 20))} entrenamientos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 px-4 sm:px-6 py-4 border-t border-purple-500/20 flex-shrink-0 bg-black/50">
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm font-semibold transition-colors">
            <Dumbbell size={16} />
            <span className="hidden sm:inline">Entrenar</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm font-semibold transition-colors">
            <Shield size={16} />
            <span className="hidden sm:inline">Posición</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-semibold transition-colors">
            <AlertCircle size={16} />
            <span className="hidden sm:inline">Lesiones</span>
          </button>
        </div>
      </div>
    </div>
  );
}
