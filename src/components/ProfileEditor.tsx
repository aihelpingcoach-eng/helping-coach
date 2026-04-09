import { useState, useEffect } from 'react';
import { User, Camera, Save, LogOut, Trash2, Lock, X, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getXPProgress, RANKS } from '../constants/progression';

interface CoachProfile {
  id: string;
  user_id: string;
  coach_name: string;
  team_name: string;
  profile_photo: string;
  age: number | null;
  country: string;
  years_experience: number | null;
  coaching_style: string;
  favorite_formation: string;
  coach_level: string;
  team_objective: string;
  language: string;
  theme: string;
  total_xp: number;
  rank: string;
  unlocked_features: string[];
}

interface ProfileEditorProps {
  onClose: () => void;
}

export default function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('coach_profiles')
        .update({
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
          theme: profile.theme,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setMessage('Perfil actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    console.log('Delete account functionality to be implemented');
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white">No se pudo cargar el perfil</div>
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
              Perfil del Entrenador
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.coach_name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-2 transition-colors">
                  <Camera size={20} className="text-white" />
                </button>
              </div>
            </div>

            {(() => {
              const progression = getXPProgress(profile.total_xp || 0);
              const rankData = RANKS.find(r => r.name === profile.rank) || RANKS[0];

              return (
                <div className="bg-gradient-to-br from-black/60 to-purple-900/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="text-yellow-400" size={28} />
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-2xl">{rankData.icon}</span>
                          {progression.currentRank.name}
                        </h3>
                        <p className="text-sm text-gray-400">{progression.currentRank.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-purple-300">
                        <TrendingUp size={16} />
                        <span className="text-2xl font-bold">{profile.total_xp || 0}</span>
                      </div>
                      <p className="text-xs text-gray-400">XP Total</p>
                    </div>
                  </div>

                  {progression.nextRank && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">
                          {progression.currentRankXP} / {progression.xpForNextRank} XP
                        </span>
                        <span className="text-purple-400 font-semibold">
                          Siguiente: {progression.nextRank.name}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${progression.currentRank.color} transition-all duration-500`}
                          style={{ width: `${Math.min(progression.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!progression.nextRank && (
                    <div className="text-center py-2">
                      <p className="text-yellow-400 font-bold flex items-center justify-center gap-2">
                        <span className="text-2xl">⭐</span>
                        Has alcanzado el rango máximo
                        <span className="text-2xl">⭐</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Entrenador
                </label>
                <input
                  type="text"
                  value={profile.coach_name}
                  onChange={(e) => setProfile({ ...profile, coach_name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Equipo
                </label>
                <input
                  type="text"
                  value={profile.team_name}
                  onChange={(e) => setProfile({ ...profile, team_name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Mi Equipo FC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="35"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  País
                </label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="España"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Años de Experiencia
                </label>
                <input
                  type="number"
                  value={profile.years_experience || ''}
                  onChange={(e) => setProfile({ ...profile, years_experience: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estilo de Entrenador
                </label>
                <select
                  value={profile.coaching_style}
                  onChange={(e) => setProfile({ ...profile, coaching_style: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Formación Favorita
                </label>
                <select
                  value={profile.favorite_formation}
                  onChange={(e) => setProfile({ ...profile, favorite_formation: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nivel del Entrenador
                </label>
                <select
                  value={profile.coach_level}
                  onChange={(e) => setProfile({ ...profile, coach_level: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Amateur">Amateur</option>
                  <option value="Semi-profesional">Semi-profesional</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Élite">Élite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Objetivo del Equipo
                </label>
                <select
                  value={profile.team_objective}
                  onChange={(e) => setProfile({ ...profile, team_objective: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Desarrollo de jóvenes">Desarrollo de jóvenes</option>
                  <option value="Ganar partidos">Ganar partidos</option>
                  <option value="Equilibrio">Equilibrio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tema Visual
                </label>
                <select
                  value={profile.theme}
                  onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
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

            <div className="border-t border-purple-500/30 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="text-purple-400" size={20} />
                Cuenta
              </h3>

              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>

                <button
                  onClick={signOut}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Eliminar Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/50 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
