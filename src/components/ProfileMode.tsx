import { LogOut, User, Mail, Award, RotateCcw, Zap, Crown, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useXP } from '../hooks/useXP';
import { useTutorial } from '../hooks/useTutorial';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { getXPProgress } from '../constants/progression';
import { supabase } from '../lib/supabase';
import XPProgressBar from './XPProgressBar';
import LevelUpModal from './LevelUpModal';

export default function ProfileMode() {
  const { user, signOut } = useAuth();
  const { totalXP } = useXP();
  const [previewLevel, setPreviewLevel] = useState<number | null>(null);
  const { restartTutorial } = useTutorial();
  const { profile } = useCoachProfile();
  const isPro = profile?.plan === 'pro';

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

  const handleUpgrade = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { userId: user.id, email: user.email },
      });
      if (error) throw new Error(JSON.stringify(error));
      if (!data?.url) throw new Error('No URL returned: ' + JSON.stringify(data));
      window.location.href = data.url;
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="relative w-full p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Perfil del Entrenador</h1>

        <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/40 rounded-2xl p-4 sm:p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-600 p-3 sm:p-4 rounded-full flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-0.5 truncate">{coachName}</h2>
              <p className="text-gray-400 text-sm mb-2">Entrenador Principal</p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${currentRank.color} shadow-lg`}>
                <Award size={14} className="text-white" />
                <span className="text-white font-bold text-xs">{currentRank.name}</span>
                <span className="text-white/90 text-sm">{currentRank.icon}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Mail size={16} className="text-purple-400 flex-shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>

            <XPProgressBar totalXP={totalXP} />

            {nextRank && false && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-gray-400">Progreso al siguiente rango</span>
                  <span className="text-white font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${nextRank.color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1.5">
                  Próximo: <span className="text-white font-semibold">{nextRank.name} {nextRank.icon}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-4 sm:p-5 mb-4">
          <h3 className="text-base font-bold text-white mb-3">Información de la Cuenta</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between items-center">
              <span>Cuenta creada</span>
              <span className="text-white font-semibold">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>ID de Usuario</span>
              <span className="text-white font-mono text-xs">{user?.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between items-center">
              <span>XP Total</span>
              <span className="text-purple-400 font-bold">{totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Plan section */}
        <div className="mb-4">
          {isPro ? (
            <div className="bg-gradient-to-r from-purple-900/50 to-yellow-900/20 border border-yellow-500/40 rounded-2xl p-4 flex items-center gap-3">
              <Crown size={22} className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">Plan Pro activo</p>
                <p className="text-slate-400 text-xs">IA ilimitada · Sin anuncios</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-purple-400" />
                <span className="text-white font-bold text-sm">Activar Plan Pro</span>
                <span className="ml-auto text-purple-300 font-bold text-sm">4,99€/mes</span>
              </div>
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                IA ilimitada sin anuncios: sinergias, asesor de formaciones, informe de partido y chat.
              </p>
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 text-sm"
                style={{ minHeight: '44px' }}
              >
                Ir a Pro — sin anuncios
              </button>
            </div>
          )}
        </div>

        {/* TEST — Previsualizar animaciones de nivel (quitar en producción) */}
        <div className="mb-4 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={16} className="text-slate-400" />
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Preview animaciones</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { lvl: 2,  label: 'T1', color: '#64748b', sub: 'Aluminio' },
              { lvl: 4,  label: 'T2', color: '#78716c', sub: 'Hierro' },
              { lvl: 6,  label: 'T3', color: '#d97706', sub: 'Oro' },
              { lvl: 9,  label: 'T4', color: '#94a3b8', sub: 'Platino' },
              { lvl: 12, label: 'T5', color: '#06b6d4', sub: 'Diamante' },
              { lvl: 15, label: 'T6', color: '#dc2626', sub: 'Rubí' },
              { lvl: 17, label: 'T7', color: '#059669', sub: 'Esmeralda' },
              { lvl: 19, label: 'T8', color: '#2563eb', sub: 'Zafiro' },
            ].map(({ lvl, label, color, sub }) => (
              <button
                key={lvl}
                onClick={() => setPreviewLevel(lvl)}
                className="py-2 px-1 rounded-lg text-xs font-bold text-white transition-all active:scale-95 flex flex-col items-center gap-0.5"
                style={{ background: color }}
              >
                <span>{label}</span>
                <span className="text-white/70 text-[10px] font-normal">{sub}</span>
              </button>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-2 text-center">T1–T8 · Tap para ver</p>
        </div>

        {previewLevel && (
          <LevelUpModal
            visible={true}
            newLevel={previewLevel}
            onClose={() => setPreviewLevel(null)}
          />
        )}

        <div className="space-y-3 mb-4">
          <button
            onClick={handleRestartTutorial}
            className="w-full bg-blue-600 active:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation"
            style={{ minHeight: '48px' }}
          >
            <RotateCcw size={20} />
            Repetir Tutorial
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 active:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation"
            style={{ minHeight: '48px' }}
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

        <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
          <h4 className="text-white font-semibold text-sm mb-1">Tus Datos Están Seguros</h4>
          <p className="text-gray-400 text-xs leading-relaxed">
            Todos tus jugadores, alineaciones y progreso están vinculados a tu cuenta y solo tú puedes acceder a ellos.
          </p>
        </div>
      </div>
    </div>
  );
}
