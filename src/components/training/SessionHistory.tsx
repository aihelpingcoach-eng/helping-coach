import { CheckCircle2, Clock, Trash2, Play } from 'lucide-react';
import { TrainingSession } from '../../hooks/useTrainingSessions';
import EmptyState from '../EmptyState';

interface Props {
  sessions: TrainingSession[];
  loading: boolean;
  onResume: (session: TrainingSession) => void;
  onDelete: (sessionId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  fuerza:      'bg-yellow-600/20 text-yellow-400 border-yellow-700/40',
  tactico:     'bg-purple-600/20 text-purple-400 border-purple-700/40',
  resistencia: 'bg-red-600/20 text-red-400 border-red-700/40',
  pliometria:  'bg-blue-600/20 text-blue-400 border-blue-700/40',
  prevencion:  'bg-green-600/20 text-green-400 border-green-700/40',
};

const CATEGORY_NAMES: Record<string, string> = {
  fuerza: 'Fuerza', tactico: 'Táctico', resistencia: 'Resistencia',
  pliometria: 'Pliometría', prevencion: 'Prevención',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SessionHistory({ sessions, loading, onResume, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        variant="generic"
        title="Sin sesiones todavía"
        subtitle="Crea tu primera sesión desde la pestaña de ejercicios"
        className="py-16"
      />
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {sessions.map(session => {
        const colorClass = CATEGORY_COLORS[session.category] ?? 'bg-gray-700/20 text-gray-400 border-gray-600/40';
        return (
          <div
            key={session.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition-colors"
          >
            {/* Estado */}
            <div className={`flex-shrink-0 ${session.completed ? 'text-green-400' : 'text-gray-600'}`}>
              {session.completed ? <CheckCircle2 size={28} /> : <Clock size={28} />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{session.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
                  {CATEGORY_NAMES[session.category] ?? session.category}
                </span>
                <span className="text-gray-500 text-xs">{session.exercise_ids.length} ejercicios</span>
                <span className="text-gray-600 text-xs">{formatDate(session.created_at)}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!session.completed && (
                <button
                  onClick={() => onResume(session)}
                  className="p-2 rounded-lg bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 transition-colors"
                  title="Reanudar sesión"
                >
                  <Play size={16} />
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('¿Eliminar esta sesión?')) onDelete(session.id);
                }}
                className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                title="Eliminar sesión"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
