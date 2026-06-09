import { getLevelProgress } from '../constants/levels';

interface XPProgressBarProps {
  totalXP: number;
  compact?: boolean;
}

export default function XPProgressBar({ totalXP, compact = false }: XPProgressBarProps) {
  const { currentLevel, nextLevel, xpIntoLevel, xpForNextLevel, progressPercent } = getLevelProgress(totalXP);
  const isMax = currentLevel.level === 20;

  if (compact) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-sm flex-shrink-0 shadow`}>
          <span className="text-xs">{currentLevel.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-white text-xs font-bold truncate">Niv. {currentLevel.level} · {currentLevel.name}</span>
            {!isMax && <span className="text-white/40 text-xs flex-shrink-0 ml-1">{xpIntoLevel}/{xpForNextLevel}</span>}
          </div>
          {isMax ? (
            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full" />
          ) : (
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full`}
                style={{ width: `${progressPercent}%`, transition: 'width 0.6s ease-out' }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentLevel.color} flex items-center justify-center shadow-lg border-2 border-white/20`}>
          <span className="text-2xl">{currentLevel.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-black text-lg">{currentLevel.name}</span>
            <span className="text-white/40 text-sm">Nivel {currentLevel.level}</span>
          </div>
          {isMax ? (
            <span className="text-yellow-400 text-xs font-bold">✨ NIVEL MÁXIMO</span>
          ) : (
            <span className="text-white/40 text-xs">
              {xpIntoLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP → {nextLevel?.name}
            </span>
          )}
        </div>
      </div>

      {isMax ? (
        <div className="w-full h-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg" />
      ) : (
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full shadow`}
            style={{ width: `${progressPercent}%`, transition: 'width 0.6s ease-out' }}
          />
        </div>
      )}

      {!isMax && (
        <div className="flex justify-between mt-1">
          <span className="text-white/30 text-xs">{Math.round(progressPercent)}%</span>
          <span className="text-white/30 text-xs">{(xpForNextLevel - xpIntoLevel).toLocaleString()} XP para subir</span>
        </div>
      )}
    </div>
  );
}
