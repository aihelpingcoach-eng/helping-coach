import { X, TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { Player } from '../../constants/playstyles';
import { usePlayerHistory } from '../../hooks/usePlayerHistory';

interface Props {
  player: Player;
  onClose: () => void;
}

function LevelChart({ history, currentLevel }: { history: ReturnType<typeof usePlayerHistory>['history'], currentLevel: number }) {
  if (history.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-500 text-sm">
        Necesitas más swipes para ver el gráfico
      </div>
    );
  }

  // Reconstruct level at each point
  // If level_after is available use it; otherwise accumulate from current level backwards
  const points: number[] = [];

  const hasLevelAfter = history.some(h => h.level_after !== null);
  if (hasLevelAfter) {
    history.forEach(h => {
      if (h.level_after !== null) points.push(h.level_after);
    });
  } else {
    // Reconstruct: start from current and go backwards
    let level = currentLevel;
    const reversed = [...history].reverse();
    const levels: number[] = [level];
    for (const entry of reversed) {
      level = Math.max(1, Math.min(99, level - entry.level_change));
      levels.unshift(level);
    }
    points.push(...levels.slice(0, history.length));
  }

  const min = Math.max(1, Math.min(...points) - 2);
  const max = Math.min(99, Math.max(...points) + 2);
  const range = max - min || 1;

  const W = 280;
  const H = 100;
  const pad = 8;

  const coords = points.map((p, i) => ({
    x: pad + (i / (points.length - 1)) * (W - pad * 2),
    y: H - pad - ((p - min) / range) * (H - pad * 2),
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${H} L ${coords[0].x} ${H} Z`;

  const trend = points[points.length - 1] - points[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{points.length} registros</span>
        <span className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend > 0 ? `+${trend}` : trend} desde el inicio
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={pad} y1={pad + t * (H - pad * 2)}
            x2={W - pad} y2={pad + t * (H - pad * 2)}
            stroke="#374151" strokeWidth="0.5"
          />
        ))}
        {/* Area */}
        <path d={areaD} fill="url(#chartGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="3" fill="#7c3aed" />
        ))}
        {/* Y labels */}
        <text x={0} y={pad + 4} fill="#6b7280" fontSize="8">{max}</text>
        <text x={0} y={H - pad + 4} fill="#6b7280" fontSize="8">{min}</text>
      </svg>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export default function PlayerHistoryPanel({ player, onClose }: Props) {
  const { history, loading } = usePlayerHistory(player.id);

  const improvements = history.filter(h => h.level_change > 0).length;
  const regressions = history.filter(h => h.level_change < 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border-t border-gray-700 rounded-t-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center font-bold text-white text-lg overflow-hidden flex-shrink-0">
              {player.image_url
                ? <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" />
                : player.name.charAt(0)
              }
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">{player.name}</h3>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Trophy size={12} />
                <span>Nivel {player.level}</span>
                {player.playstyle && <span className="text-gray-500">· {player.playstyle}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Stats rápidas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{player.level}</p>
              <p className="text-gray-400 text-xs">Nivel actual</p>
            </div>
            <div className="bg-green-900/30 border border-green-800/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{improvements}</p>
              <p className="text-gray-400 text-xs">Mejoras</p>
            </div>
            <div className="bg-red-900/30 border border-red-800/40 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{regressions}</p>
              <p className="text-gray-400 text-xs">Retrocesos</p>
            </div>
          </div>

          {/* Gráfico */}
          {loading ? (
            <div className="h-32 bg-gray-800 rounded-xl animate-pulse" />
          ) : (
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Evolución de nivel</h4>
              <LevelChart history={history} currentLevel={player.level} />
            </div>
          )}

          {/* Historial reciente */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Historial reciente</h4>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />)}
              </div>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Sin registros todavía</p>
            ) : (
              <div className="space-y-2">
                {[...history].reverse().slice(0, 15).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2.5">
                    <span className="text-gray-400 text-sm">{formatDate(entry.created_at)}</span>
                    <span className={`flex items-center gap-1 font-bold text-sm ${
                      entry.level_change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {entry.level_change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {entry.level_change > 0 ? `+${entry.level_change}` : entry.level_change}
                      {entry.level_after !== null && (
                        <span className="text-gray-500 font-normal ml-1">→ niv. {entry.level_after}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
