import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ExerciseRow } from '../../hooks/useExercises';
import ExerciseFormModal from './ExerciseFormModal';

export default function AdminExercises() {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ExerciseRow | undefined>();

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('exercises')
      .select('id, name, description, duration, benefit, illustration, category, image_url')
      .order('category')
      .order('name');
    setExercises(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    await supabase.from('exercises').delete().eq('id', id);
    fetchExercises();
  };

  const openAdd = () => { setEditTarget(undefined); setShowModal(true); };
  const openEdit = (ex: ExerciseRow) => { setEditTarget(ex); setShowModal(true); };
  const handleSaved = () => { setShowModal(false); fetchExercises(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Ejercicios ({exercises.length})</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> Añadir
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {exercises.map(ex => (
              <div key={ex.id} className="flex items-center gap-3 px-4 py-3">
                {ex.image_url && (
                  <img src={ex.image_url} alt={ex.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{ex.name}</div>
                  <div className="text-gray-400 text-xs capitalize">{ex.category}</div>
                </div>
                <button onClick={() => openEdit(ex)} className="text-gray-400 hover:text-orange-400 transition-colors p-1">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(ex.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">Sin ejercicios. Añade el primero.</div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <ExerciseFormModal
          exercise={editTarget}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
