import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ExerciseFormData } from '../../types/admin';
import { ExerciseRow } from '../../hooks/useExercises';

const CATEGORIES = ['fuerza', 'tactico', 'resistencia', 'pliometria', 'prevencion'];

interface Props {
  exercise?: ExerciseRow;
  onClose: () => void;
  onSaved: () => void;
}

const empty: ExerciseFormData = {
  name: '', description: '', duration: '', benefit: '',
  illustration: 'squat', category: 'fuerza', image_url: '',
};

export default function ExerciseFormModal({ exercise, onClose, onSaved }: Props) {
  const [form, setForm] = useState<ExerciseFormData>(exercise ? {
    name: exercise.name,
    description: exercise.description,
    duration: exercise.duration,
    benefit: exercise.benefit,
    illustration: exercise.illustration,
    category: exercise.category,
    image_url: exercise.image_url ?? '',
  } : empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof ExerciseFormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('exercise-images').upload(path, file);
    if (uploadError) {
      setError('Error al subir imagen');
    } else {
      const { data } = supabase.storage.from('exercise-images').getPublicUrl(path);
      set('image_url', data.publicUrl);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      duration: form.duration,
      benefit: form.benefit,
      illustration: form.illustration,
      category: form.category,
      image_url: form.image_url || null,
    };

    const { error: saveError } = exercise
      ? await supabase.from('exercises').update(payload).eq('id', exercise.id)
      : await supabase.from('exercises').insert(payload);

    if (saveError) {
      setError('Error al guardar: ' + saveError.message);
    } else {
      onSaved();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{exercise ? 'Editar ejercicio' : 'Nuevo ejercicio'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          {(['name', 'description', 'duration', 'benefit'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm text-gray-300 mb-1 capitalize">{field}</label>
              <input
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Imagen</label>
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg px-3 py-2 text-orange-300 text-sm transition-colors">
              <Upload size={16} />
              {uploading ? 'Subiendo...' : 'Subir imagen'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="flex gap-3 p-5 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
