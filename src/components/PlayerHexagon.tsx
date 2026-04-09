import { useRef } from 'react';
import { Player } from '../constants/playstyles';

interface PlayerHexagonProps {
  position: { x: number; y: number };
  player?: Player;
  onClick: () => void;
  onDoubleClick?: () => void;
  allPlayers: Player[];
  isHighlighted?: boolean;
  hasInjuryRisk?: boolean;
  isPerformingWell?: boolean;
}

export default function PlayerHexagon({
  position,
  player,
  onClick,
  onDoubleClick,
  isHighlighted = false,
  hasInjuryRisk = false,
  isPerformingWell = false
}: PlayerHexagonProps) {
  const lastTapTime = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTap = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTapTime.current;

    if (timeDifference < 300) {
      clearTimeout(tapTimeoutRef.current);
      onDoubleClick?.();
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = currentTime;
      tapTimeoutRef.current = setTimeout(() => {
        onClick();
      }, 300);
    }
  };
  const size = 50;
  const hexagonPath = `
    M ${size * 0.5} ${size * 0.067}
    L ${size * 0.933} ${size * 0.25}
    L ${size * 0.933} ${size * 0.75}
    L ${size * 0.5} ${size * 0.933}
    L ${size * 0.067} ${size * 0.75}
    L ${size * 0.067} ${size * 0.25}
    Z
  `;

  const getStrokeColor = () => {
    if (hasInjuryRisk) return '#EF4444';
    if (isPerformingWell) return '#10B981';
    if (isHighlighted) return '#A855F7';
    return '#9333EA';
  };

  const getGlowClass = () => {
    if (hasInjuryRisk) return 'animate-pulse-glow text-red-500';
    if (isPerformingWell) return 'animate-pulse-glow text-green-500';
    return '';
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group animate-scale-in ${
        hasInjuryRisk ? 'animate-shake' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onClick={handleTap}
    >
      <svg
        width={size}
        height={size}
        className={`transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-2xl ${getGlowClass()}`}
      >
        <defs>
          {player?.image_url && (
            <pattern
              id={`player-${player.id}`}
              x="0"
              y="0"
              width="1"
              height="1"
            >
              <image
                href={player.image_url}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          )}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {isPerformingWell && (
          <path
            d={hexagonPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeOpacity="0.3"
            filter="url(#glow)"
            className="animate-pulse-glow"
          />
        )}

        <path
          d={hexagonPath}
          fill={player?.image_url ? `url(#player-${player.id})` : '#000'}
          stroke={getStrokeColor()}
          strokeWidth={isHighlighted || hasInjuryRisk ? "4" : "3"}
          className="drop-shadow-2xl transition-all duration-300"
        />

        {!player && (
          <text
            x={size / 2}
            y={size / 2 + 4}
            textAnchor="middle"
            className="text-2xl font-bold fill-purple-400 transition-all group-hover:fill-purple-300"
          >
            +
          </text>
        )}
      </svg>

      {player && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-semibold shadow-xl border border-purple-500/30">
            {player.name}
          </div>
          {player.playstyle && (
            <div className="text-center text-xs mt-1 px-2 py-0.5 bg-purple-600/80 rounded text-white font-bold shadow-lg">
              {player.playstyle}
            </div>
          )}
        </div>
      )}

      {player && (
        <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2">
          <div className={`${
            hasInjuryRisk
              ? 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'
              : isPerformingWell
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : 'bg-gradient-to-r from-purple-600 to-pink-600'
          } text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg`}>
            Nv. {player.level}
          </div>
        </div>
      )}

      {isPerformingWell && (
        <div className="absolute -top-2 -right-2 text-yellow-400 animate-float">
          <span className="text-lg">⭐</span>
        </div>
      )}

      {hasInjuryRisk && (
        <div className="absolute -top-2 -right-2 text-red-500 animate-pulse">
          <span className="text-lg">⚠️</span>
        </div>
      )}
    </div>
  );
}
