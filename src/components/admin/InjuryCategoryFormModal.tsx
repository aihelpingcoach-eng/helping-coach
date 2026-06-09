import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { InjuryCategoryRow } from '../../hooks/useInjuries';

interface Props {
  category?: InjuryCategoryRow;
  onClose: () => void;
  onSaved: () => void;
}

interface FormData {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

const ICON_OPTIONS = [
  'ankle', 'muscle', 'flame', 'knee', 'tendon', 'bone', 'first-aid',
];

export default function InjuryCategoryFormModal({ category, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormData>({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    icon: category?.icon ?? 'first-aid',
    color: category?.color ?? 'from-gray-500 to-slate-600',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      icon: form.icon || 'first-aid',
      color: form.color || 'from-gray-500 to-slate-600',
    };

    const { error: saveError } = category
      ? await supabase.from('injury_categories').update(payload).eq('id', category.id)
      : await supabase.from('injury_categories').insert(payload);

    if (saveError) {
      setError('Error al guardar: ' + saveError.message);
    } else {
      onSaved();
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {category ? 'Editar tipo de lesión' : 'Nuevo tipo de lesión'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre <span className="text-red-400">*</span></label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ej: Lesiones musculares"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Slug <span className="text-gray-500">(auto si se deja vacío)</span></label>
            <input
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              placeholder="Ej: lesiones-musculares"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Icono</label>
            <select
              value={form.icon}
              onChange={e => set('icon', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {ICON_OPTIONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Color (clases Tailwind gradient)</label>
            <input
              value={form.color}
              onChange={e => set('color', e.target.value)}
              placeholder="from-red-500 to-orange-500"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="flex gap-3 p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm"
          >
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
