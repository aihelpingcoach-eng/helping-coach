import { LogOut, User, Mail, Award, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useXP } from '../hooks/useXP';
import { useTutorial } from '../hooks/useTutorial';
import { getXPProgress } from '../constants/progression';

export default function ProfileMode() {
  const { user, signOut } = useAuth();
  const { totalXP } = useXP();
  const { restartTutorial } = useTutorial();

  const coachName = user?.user_metadata?.coach_name || 'Entrenador';
  const { currentRank, nextRank, progress } = getXPProgress(totalXP);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut();
    }
  };

  const handleRestartTutorial = () => {
    restartTutorial();
  };

  return (
    <div className="relative w-full h-full min-h-screen pb-32 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Perfil del Entrenador</h1>

        <div className="bg-gradient-to-br from-purple-900/40 to-black border-2 border-purple-500/50 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-purple-600 p-6 rounded-full">
              <User size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{coachName}</h2>
              <p className="text-gray-400 mb-3">Entrenador Principal</p>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentRank.color} shadow-lg`}>
                <Award size={20} className="text-white" />
                <span className="text-white font-bold text-sm">{currentRank.name}</span>
                <span className="text-white/90 text-lg">{currentRank.icon}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail size={20} className="text-purple-400" />
              <span>{user?.email}</span>
            </div>

            {nextRank && (
              <div className="mt-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-400">Progreso al siguiente rango</span>
                  <span className="text-white font-bold text-lg">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
                  <div
                    className={`h-full bg-gradient-to-r ${nextRank.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Próximo rango: <span className="text-white font-semibold">{nextRank.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Información de la Cuenta</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Cuenta creada:</span>
              <span className="text-white font-semibold">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ID de Usuario:</span>
              <span className="text-white font-mono text-sm">{user?.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleRestartTutorial}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3 group"
          >
            <RotateCcw size={24} className="group-hover:rotate-180 transition-transform" />
            Repetir Tutorial
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3 group"
          >
            <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>

        <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Tus Datos Están Seguros</h4>
          <p className="text-gray-400 text-sm">
            Todos tus jugadores, alineaciones y progreso están vinculados a tu cuenta y solo tú puedes acceder a ellos.
          </p>
        </div>
      </div>
    </div>
  );
}
