import { MapPin, Clock, Trash2, Edit3 } from 'lucide-react';
import { Match } from '../../hooks/useMatches';

interface Props {
  match: Match;
  onResult: (match: Match) => void;
  onDelete: (matchId: string) => void;
}

const COMPETITION_COLORS: Record<string, string> = {
  Liga: 'bg-blue-600/30 text-blue-300 border-blue-600/40',
  Copa: 'bg-amber-600/30 text-amber-300 border-amber-600/40',
  Amistoso: 'bg-gray-600/30 text-gray-300 border-gray-600/40',
  Torneo: 'bg-purple-600/30 text-purple-300 border-purple-600/40',
  'Play-off': 'bg-rose-600/30 text-rose-300 border-rose-600/40',
  Supercopa: 'bg-yellow-600/30 text-yellow-300 border-yellow-600/40',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
}

function resultBadge(match: Match) {
  if (!match.result) return null;
  const configs = {
    win:  { label: 'Victoria', classes: 'bg-green-600/20 text-green-400 border-green-600/40' },
    draw: { label: 'Empate',   classes: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/40' },
    loss: { label: 'Derrota',  classes: 'bg-red-600/20 text-red-400 border-red-600/40' },
  };
  const { label, classes } = configs[match.result];
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${classes}`}>{label}</span>
  );
}

export default function MatchCard({ match, onResult, onDelete }: Props) {
  const hasResult = match.result !== null;
  const compColor = COMPETITION_COLORS[match.competition] ?? COMPETITION_COLORS['Amistoso'];

  const borderColor = !hasResult
    ? 'border-gray-700/60'
    : match.result === 'win'
      ? 'border-green-600/40'
      : match.result === 'loss'
        ? 'border-red-600/40'
        : 'border-yellow-600/40';

  return (
    <div className={`bg-gray-900/70 border ${borderColor} rounded-xl p-4 flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base truncate">vs {match.opponent}</p>
          <p className="text-gray-400 text-xs mt-0.5">{formatDate(match.date)}{match.time ? ` · ${match.time}` : ''}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${compColor}`}>
            {match.competition}
          </span>
        </div>
      </div>

      {match.location && (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <MapPin size={11} />
          <span className="truncate">{match.location}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {hasResult ? (
            <>
              {resultBadge(match)}
              <span className="text-white font-bold text-sm">
                {match.score_for} – {match.score_against}
              </span>
            </>
          ) : (
            <span className="text-gray-500 text-xs">Sin resultado</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onResult(match)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-colors"
            title={hasResult ? 'Editar resultado' : 'Añadir resultado'}
          >
            <Edit3 size={13} />
            {hasResult ? 'Editar' : 'Resultado'}
          </button>
          <button
            onClick={() => onDelete(match.id)}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
