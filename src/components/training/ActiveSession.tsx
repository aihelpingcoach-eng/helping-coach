import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Trophy, ClipboardList } from 'lucide-react';
import { TrainingSession } from '../../hooks/useTrainingSessions';
import { ExerciseRow } from '../../hooks/useExercises';

interface Props {
  session: TrainingSession;
  exercises: ExerciseRow[];
  onComplete: () => Promise<void>;
  onBack: () => void;
}

export default function ActiveSession({ session, exercises, onComplete, onBack }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [finishing, setFinishing] = useState(false);

  const sessionExercises = exercises.filter(e => session.exercise_ids.includes(e.id));
  const total = sessionExercises.length;
  const done = completed.size;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const toggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleFinish = async () => {
    setFinishing(true);
    await onComplete();
    setFinishing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">{session.name}</h2>
          <p className="text-gray-400 text-sm">{total} ejercicios · {done} completados</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progreso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lista de ejercicios */}
      {sessionExercises.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
          <p>No se encontraron los ejercicios de esta sesión.</p>
          <p className="text-xs mt-1">Es posible que los datos aún no hayan cargado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessionExercises.map(ex => {
            const isDone = completed.has(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => toggle(ex.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  isDone
                    ? 'border-green-700/60 bg-green-900/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 transition-colors ${isDone ? 'text-green-400' : 'text-gray-600'}`}>
                  {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isDone ? 'text-green-300 line-through' : 'text-white'}`}>
                    {ex.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{ex.duration}</p>
                  {!isDone && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ex.description}</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Botón finalizar */}
      <button
        onClick={handleFinish}
        disabled={finishing || done === 0}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg"
      >
        <Trophy size={20} />
        {finishing ? 'Guardando...' : `Finalizar sesión (${done}/${total})`}
      </button>

      {done === 0 && (
        <p className="text-center text-gray-500 text-xs -mt-3">Marca al menos un ejercicio para finalizar</p>
      )}
    </div>
  );
}
