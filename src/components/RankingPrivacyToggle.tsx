import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useCoachProfile } from '../hooks/useCoachProfile';

// Aparecer en la clasificación pública es opcional: otros entrenadores ven tu
// nombre, foto, equipo y XP (la edad ya no se muestra a nadie).
export default function RankingPrivacyToggle() {
  const { profile, updateProfile } = useCoachProfile();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  if (!profile) return null;
  const visible = profile.show_in_ranking !== false;

  const toggle = async () => {
    setSaving(true);
    setError(false);
    const ok = await updateProfile({ show_in_ranking: !visible });
    setSaving(false);
    if (!ok) setError(true);
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-4 sm:p-5 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-2 min-w-0">
          <Trophy size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 id="ranking-privacy-label" className="text-base font-bold text-white">
              Aparecer en la clasificación
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Otros entrenadores verán tu nombre, foto, equipo y XP en Avanzado → Retos.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={saving}
          role="switch"
          aria-checked={visible}
          aria-labelledby="ranking-privacy-label"
          className={`relative w-12 h-7 flex-shrink-0 rounded-full transition-colors disabled:opacity-60 ${
            visible ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
              visible ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-2">No se ha podido guardar. Inténtalo de nuevo.</p>}
    </div>
  );
}
