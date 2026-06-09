import { useEffect, useRef, useState } from 'react';
import { X, ChevronRight, Play, SkipForward, ArrowRight } from 'lucide-react';
import { useTutorial, TutorialStep } from '../hooks/useTutorial';

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function Tutorial() {
  const { currentStep, isOpen, steps, nextStep, skipTutorial, closeTutorial } = useTutorial();
  const [elementPosition, setElementPosition] = useState<ElementPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isWelcomeStep = currentStep === 0;
  const isCenteredStep = !step?.element || !elementPosition;

  useEffect(() => {
    if (!isOpen || !step?.element) return;

    const updatePosition = () => {
      const element = document.querySelector(`[data-tutorial="${step.element}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [step, isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      skipTutorial();
    }
  };

  const handleNext = () => {
    nextStep();
  };

  if (isWelcomeStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={handleBackdropClick}>
        <div className="animate-scale-in bg-gradient-to-br from-slate-900/95 to-black border-2 border-purple-500/50 rounded-3xl p-8 w-[340px] shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <div className="text-8xl mb-4 drop-shadow-lg" style={{ animation: 'bounce 2.5s ease-in-out infinite' }}>⚽</div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              {step.title}
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full mb-4" />
            <p className="text-slate-300 text-base leading-relaxed">{step.description}</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:from-purple-700 active:to-purple-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl hover:shadow-purple-500/50"
            >
              <Play size={20} className="fill-current" />
              Empezar Tutorial
            </button>
            <button
              onClick={skipTutorial}
              className="w-full bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <SkipForward size={18} />
              Saltar por ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLastStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={handleBackdropClick}>
        <div className="animate-scale-in bg-gradient-to-br from-emerald-900/30 via-slate-900/95 to-black border-2 border-emerald-500/50 rounded-3xl p-8 w-[340px] shadow-2xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center">
            <div className="text-8xl mb-4 drop-shadow-lg" style={{ animation: 'bounce 2.5s ease-in-out infinite' }}>🎯</div>
            <h2 className="text-3xl font-black text-white mb-3 leading-tight bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              {step.title}
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full mb-4" />
            <p className="text-slate-300 text-base leading-relaxed">{step.description}</p>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl hover:shadow-emerald-500/50"
          >
            ¡Vamos al Campo!
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (isCenteredStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={handleBackdropClick}>
        <div className="animate-scale-in bg-gradient-to-br from-slate-900/95 to-black border-2 border-purple-500/50 rounded-3xl p-7 w-full max-w-sm shadow-2xl flex flex-col gap-5">
          <div>
            <h3 className="text-2xl font-black text-white mb-3 leading-tight bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">{step.title}</h3>
            <div className="h-0.5 w-10 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full mb-4" />
            <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
          </div>

          <div className="space-y-3 pt-1 border-t border-slate-700/50">
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx <= currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-purple-400 w-8 h-2'
                      : 'bg-slate-700 w-2 h-2'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Paso {currentStep + 1}/{steps.length}</span>
              <span className="text-xs text-purple-400 font-bold">{Math.round((currentStep + 1) / steps.length * 100)}%</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={skipTutorial}
              className="flex-1 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-all rounded-xl font-semibold uppercase tracking-wide"
            >
              Saltar
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={skipTutorial}
          className="fixed top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors pointer-events-auto"
        >
          <X size={20} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Overlay base */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Spotlight en elemento */}
      {elementPosition && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: elementPosition.top - 12,
            left: elementPosition.left - 12,
            width: elementPosition.width + 24,
            height: elementPosition.height + 24,
            borderRadius: '16px',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl border-2 border-purple-500 animate-pulse-glow"
            style={{
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
            }}
          />
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/50" />
        </div>
      )}

      {/* Tarjeta de información */}
      <div className="absolute pointer-events-auto">
        <div
          className="animate-slide-up bg-gradient-to-br from-slate-900/95 to-black border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl w-[320px] flex flex-col backdrop-blur-md"
          style={{
            top: elementPosition
              ? Math.min(
                  elementPosition.top + elementPosition.height + 24,
                  window.innerHeight - 320
                )
              : 'auto',
            left: elementPosition
              ? Math.max(
                  Math.min(
                    elementPosition.left - 160 + elementPosition.width / 2,
                    window.innerWidth - 340
                  ),
                  16
                )
              : 'auto',
            maxHeight: '450px',
          }}
        >
          {/* Contenido Principal */}
          <div className="flex-1 mb-6">
            <h3 className="text-2xl font-black text-white mb-3 leading-tight bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">{step.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{step.description}</p>
          </div>

          {/* Indicador de progreso */}
          <div className="space-y-3 mb-6 pt-2 border-t border-slate-700/50">
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    idx <= currentStep
                      ? 'bg-gradient-to-r from-purple-500 to-purple-400 w-8 h-2'
                      : 'bg-slate-700 w-2 h-2'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Paso {currentStep + 1}/{steps.length}</span>
              <span className="text-xs text-purple-400 font-bold">{Math.round((currentStep + 1) / steps.length * 100)}%</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={skipTutorial}
              className="flex-1 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-all rounded-xl font-semibold uppercase tracking-wide"
            >
              Saltar
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:from-purple-700 active:to-purple-800 text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-purple-500/50"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Botón de cerrar flotante */}
      <button
        onClick={skipTutorial}
        className="fixed top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors pointer-events-auto"
      >
        <X size={20} className="text-white" />
      </button>
    </div>
  );
}
