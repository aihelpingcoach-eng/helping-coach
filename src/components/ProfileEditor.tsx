import { useState, useEffect } from 'react';
import { User, Save, X } from 'lucide-react';
import { useCoachProfile } from '../hooks/useCoachProfile';

interface ProfileEditorProps {
  onClose: () => void;
}

interface EditableFields {
  coach_name: string;
  team_name: string;
  age: number | null;
  country: string;
  years_experience: number | null;
  coaching_style: string;
  favorite_formation: string;
  coach_level: string;
  team_objective: string;
  language: string;
}

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { profile, loading, updateProfile } = useCoachProfile();
  const [form, setForm] = useState<EditableFields | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile && !form) {
      setForm({
        coach_name: profile.coach_name,
        team_name: profile.team_name,
        age: profile.age,
        country: profile.country,
        years_experience: profile.years_experience,
        coaching_style: profile.coaching_style,
        favorite_formation: profile.favorite_formation,
        coach_level: profile.coach_level,
        team_objective: profile.team_objective,
        language: profile.language,
      });
    }
    // Solo debe inicializar el formulario una vez, cuando llega el perfil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setMessage('');
    try {
      const ok = await updateProfile(form);
      setMessage(ok ? 'Perfil actualizado correctamente' : 'Error al guardar el perfil');
      if (ok) setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-500/30">
          <div className="p-6 border-b border-purple-500/30 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="text-purple-400" size={28} />
              Editar Perfil
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <p className="text-gray-400 text-sm -mt-2">
              Estos datos ajustan cómo te habla el coach de IA: su nivel de detalle, el tono y sus
              recomendaciones tácticas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Entrenador</label>
                <input
                  type="text"
                  value={form.coach_name}
                  onChange={(e) => setForm({ ...form, coach_name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Equipo</label>
                <input
                  type="text"
                  value={form.team_name}
                  onChange={(e) => setForm({ ...form, team_name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mi Equipo FC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Edad</label>
                <input
                  type="number"
                  value={form.age ?? ''}
                  onChange={(e) => setForm({ ...form, age: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="35"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="España"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Años de Experiencia</label>
                <input
                  type="number"
                  value={form.years_experience ?? ''}
                  onChange={(e) => setForm({ ...form, years_experience: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estilo de Entrenador</label>
                <select
                  value={form.coaching_style}
                  onChange={(e) => setForm({ ...form, coaching_style: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Defensivo">Defensivo</option>
                  <option value="Ofensivo">Ofensivo</option>
                  <option value="Posesión">Posesión</option>
                  <option value="Contraataque">Contraataque</option>
                  <option value="Equilibrado">Equilibrado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Formación Favorita</label>
                <select
                  value={form.favorite_formation}
                  onChange={(e) => setForm({ ...form, favorite_formation: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-4-2">4-4-2</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="5-3-2">5-3-2</option>
                  <option value="4-1-4-1">4-1-4-1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nivel del Entrenador</label>
                <select
                  value={form.coach_level}
                  onChange={(e) => setForm({ ...form, coach_level: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Amateur">Amateur</option>
                  <option value="Semi-profesional">Semi-profesional</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Élite">Élite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo del Equipo</label>
                <select
                  value={form.team_objective}
                  onChange={(e) => setForm({ ...form, team_objective: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Desarrollo de jóvenes">Desarrollo de jóvenes</option>
                  <option value="Ganar partidos">Ganar partidos</option>
                  <option value="Equilibrio">Equilibrio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-center ${
                message.includes('correctamente')
                  ? 'bg-green-500/20 border border-green-500 text-green-200'
                  : 'bg-red-500/20 border border-red-500 text-red-200'
              }`}>
                {message}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
