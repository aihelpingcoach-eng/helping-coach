import emptyGeneric from '../assets/illustrations/empty-generic.png';
import emptyPlayers from '../assets/illustrations/empty-players.png';
import emptyMatches from '../assets/illustrations/empty-matches.png';

const ILLUSTRATIONS = {
  generic: emptyGeneric,
  players: emptyPlayers,
  matches: emptyMatches,
} as const;

interface EmptyStateProps {
  variant?: keyof typeof ILLUSTRATIONS;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function EmptyState({ variant = 'generic', title, subtitle, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-8 ${className}`}>
      <img src={ILLUSTRATIONS[variant]} alt="" className="w-40 h-40 object-contain mb-2 opacity-90" />
      <p className="text-gray-400 font-semibold">{title}</p>
      {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
