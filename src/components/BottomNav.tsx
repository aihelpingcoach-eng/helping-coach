import { Cross, Dumbbell, Shield, Trophy, User, Zap } from 'lucide-react';

export type AppMode = 'injuries' | 'training' | 'tactics' | 'progress' | 'profile' | 'advanced';

interface BottomNavProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function BottomNav({ activeMode, onModeChange }: BottomNavProps) {
  const modes = [
    { id: 'injuries' as AppMode, icon: Cross, label: 'Lesiones', color: '#8B0000' },
    { id: 'training' as AppMode, icon: Dumbbell, label: 'Entrenamiento', color: '#FF8C00' },
    { id: 'tactics' as AppMode, icon: Shield, label: 'Tácticas', color: '#9333EA' },
    { id: 'advanced' as AppMode, icon: Zap, label: 'Avanzado', color: '#3B82F6' },
    { id: 'progress' as AppMode, icon: Trophy, label: 'Progreso', color: '#10B981' },
    { id: 'profile' as AppMode, icon: User, label: 'Perfil', color: '#6B7280' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-purple-500/30 z-50 pb-safe flex-shrink-0" data-tutorial="tutorial-modes">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="flex justify-around items-center gap-1">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`flex flex-col items-center gap-0.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all touch-manipulation min-w-[60px] sm:min-w-[80px] ${
                  isActive
                    ? 'bg-purple-600/30 scale-105'
                    : 'active:bg-white/5'
                }`}
                style={{
                  color: isActive ? mode.color : '#9CA3AF',
                }}
              >
                <Icon size={22} strokeWidth={2.5} className="sm:w-7 sm:h-7" />
                <span className="text-[9px] sm:text-xs font-semibold whitespace-nowrap">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
