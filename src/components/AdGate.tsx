import { useEffect, useState } from 'react';
import { X, Play, Zap } from 'lucide-react';

interface AdGateProps {
  onComplete: () => void;
  onCancel: () => void;
  featureName?: string;
}

export default function AdGate({ onComplete, onCancel, featureName = 'esta función' }: AdGateProps) {
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-gradient-to-br from-slate-900 to-black border border-purple-500/40 rounded-2xl p-7 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-purple-400" />
            </div>
            <span className="text-white font-bold text-sm">Función IA</span>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Play size={28} className="text-purple-400 fill-purple-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Desbloquea {featureName}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Con el plan <span className="text-slate-300 font-medium">Free</span>, visualiza un breve anuncio para acceder a las funciones de IA.
          </p>
        </div>

        {/* Countdown / anuncio simulado */}
        <div className="bg-slate-800/60 rounded-xl p-4 mb-5 min-h-[80px] flex items-center justify-center border border-slate-700/50">
          {ready ? (
            <div className="text-center">
              <div className="text-green-400 font-bold text-sm mb-1">Anuncio completado</div>
              <div className="text-slate-400 text-xs">Ya puedes usar la función</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-slate-300 text-sm mb-2">Espera para continuar...</div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-lg">{countdown}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="space-y-2">
          <button
            onClick={onComplete}
            disabled={!ready}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            {ready ? 'Usar función ahora' : `Disponible en ${countdown}s`}
          </button>
          <button
            onClick={onCancel}
            className="w-full text-slate-400 hover:text-white text-sm py-2 transition-colors"
          >
            Cancelar
          </button>
        </div>

        {/* Upgrade hint */}
        <p className="text-center text-xs text-slate-600 mt-4">
          ¿Sin anuncios? Activa <span className="text-purple-500 font-medium">Pro desde 4,99€/mes</span> en tu perfil.
        </p>
      </div>
    </div>
  );
}
