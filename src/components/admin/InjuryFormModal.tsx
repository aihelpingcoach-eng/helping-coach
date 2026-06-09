import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { InjuryFormData } from '../../types/admin';
import { InjuryRow, InjuryCategoryRow } from '../../hooks/useInjuries';

interface Props {
  injury?: InjuryRow;
  categories: InjuryCategoryRow[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function InjuryFormModal({ injury, categories, defaultCategoryId, onClose, onSaved }: Props) {
  const [form, setForm] = useState<InjuryFormData>(injury ? {
    slug: injury.slug,
    category_id: defaultCategoryId ?? '',
    name: injury.name,
    what_is: injury.what_is,
    how_it_happens: injury.how_it_happens,
    treatment: injury.treatment,
    prevention: injury.prevention,
  } : {
    slug: '', category_id: defaultCategoryId ?? categories[0]?.id ?? '',
    name: '', what_is: '', how_it_happens: '', treatment: '', prevention: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof InjuryFormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError('');

    const payload = {
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      category_id: form.category_id,
      name: form.name,
      what_is: form.what_is,
      how_it_happens: form.how_it_happens,
      treatment: form.treatment,
      prevention: form.prevention,
    };

    const { error: saveError } = injury
      ? await supabase.from('injuries').update(payload).eq('id', injury.id)
      : await supabase.from('injuries').insert(payload);

    if (saveError) {
      setError('Error al guardar: ' + saveError.message);
    } else {
      onSaved();
    }
    setSaving(false);
  };

  const textFields: { field: keyof InjuryFormData; label: string }[] = [
    { field: 'name', label: 'Nombre' },
    { field: 'what_is', label: '¿Qué es?' },
    { field: 'how_it_happens', label: '¿Cómo ocurre?' },
    { field: 'treatment', label: 'Tratamiento' },
    { field: 'prevention', label: 'Prevención' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{injury ? 'Editar lesión' : 'Nueva lesión'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Categoría</label>
            <select
              value={form.category_id}
              onChange={e => set('category_id', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {textFields.map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm text-gray-300 mb-1">{label}</label>
              <textarea
                rows={field === 'name' ? 1 : 3}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="flex gap-3 p-5 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
