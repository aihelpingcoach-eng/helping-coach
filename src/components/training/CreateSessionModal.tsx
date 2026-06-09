import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { ExerciseRow } from '../../hooks/useExercises';
import { TrainingCategory } from '../../constants/training';

interface Props {
  exercises: ExerciseRow[];
  category: TrainingCategory;
  onClose: () => void;
  onCreate: (name: string, exerciseIds: string[]) => Promise<void>;
}

const today = new Date();
const defaultName = `Sesión ${today.getDate()}/${today.getMonth() + 1}`;

export default function CreateSessionModal({ exercises, category, onClose, onCreate }: Props) {
  const [name, setName] = useState(defaultName);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError('Ponle un nombre a la sesión'); return; }
    if (selected.size === 0) { setError('Selecciona al menos un ejercicio'); return; }
    setSaving(true);
    await onCreate(name.trim(), Array.from(selected));
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Nueva sesión</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la sesión</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              placeholder="Ej: Sesión de fuerza lunes"
            />
          </div>

          {/* Ejercicios */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Selecciona ejercicios ({selected.size}/{exercises.length})
            </label>
            <div className="space-y-2">
              {exercises.map(ex => {
                const isSelected = selected.has(ex.id);
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggle(ex.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                      isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-600'
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{ex.name}</p>
                      <p className="text-gray-400 text-xs truncate">{ex.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-700">
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={handleCreate}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
          >
            <Plus size={18} />
            {saving ? 'Guardando...' : 'Crear sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
