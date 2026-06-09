import { CalendarDays, Cross, Dumbbell, User, Zap, Settings2 } from 'lucide-react';

// Campo de fútbol visto desde arriba con jugadores en formación
function TacticsFieldIcon({ size = 22, className = '' }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Campo */}
      <rect x="2" y="3" width="20" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      {/* Línea central */}
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      {/* Círculo central */}
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
      {/* Área penal superior */}
      <rect x="7" y="3" width="10" height="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
      {/* Área penal inferior */}
      <rect x="7" y="17" width="10" height="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
      {/* Jugadores — formación 4-3-3 simplificada */}
      {/* Portero */}
      <circle cx="12" cy="21.5" r="1" fill="currentColor"/>
      {/* Defensas */}
      <circle cx="5.5" cy="18" r="1" fill="currentColor"/>
      <circle cx="9.5" cy="18" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="18" r="1" fill="currentColor"/>
      <circle cx="18.5" cy="18" r="1" fill="currentColor"/>
      {/* Medios */}
      <circle cx="7" cy="14" r="1" fill="currentColor"/>
      <circle cx="12" cy="14" r="1" fill="currentColor"/>
      <circle cx="17" cy="14" r="1" fill="currentColor"/>
      {/* Delanteros */}
      <circle cx="6" cy="10" r="1" fill="currentColor"/>
      <circle cx="12" cy="9.5" r="1" fill="currentColor"/>
      <circle cx="18" cy="10" r="1" fill="currentColor"/>
    </svg>
  );
}

function TwoCardsIcon({ size = 22, className = '' }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Back card — rotated left */}
      <g transform="rotate(-10, 9, 13)">
        <rect x="2" y="6" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.25" />
        <rect x="7.5" y="13.5" width="2" height="6" rx="1" fill="currentColor" opacity="0.8" />
      </g>
      {/* Front card — rotated right */}
      <g transform="rotate(8, 15, 13)">
        <rect x="9" y="6" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.5" />
        <rect x="14.5" y="11" width="2" height="6" rx="1" fill="currentColor" />
        <rect x="12" y="13.5" width="7" height="2" rx="1" fill="currentColor" />
      </g>
    </svg>
  );
}

export type AppMode = 'injuries' | 'training' | 'tactics' | 'progress' | 'profile' | 'advanced' | 'calendar' | 'admin';

interface BottomNavProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  showAdmin?: boolean;
}

export default function BottomNav({ activeMode, onModeChange, showAdmin }: BottomNavProps) {
  const modes = [
    { id: 'injuries' as AppMode, icon: Cross, label: 'Lesiones', color: '#8B0000' },
    { id: 'training' as AppMode, icon: Dumbbell, label: 'Entrenamiento', color: '#FF8C00' },
    { id: 'tactics' as AppMode, icon: TacticsFieldIcon, label: 'Tácticas', color: '#9333EA' },
    { id: 'advanced' as AppMode, icon: Zap, label: 'Avanzado', color: '#3B82F6' },
    { id: 'progress' as AppMode, icon: TwoCardsIcon, label: 'Progreso', color: '#10B981' },
    { id: 'calendar' as AppMode, icon: CalendarDays, label: 'Partidos', color: '#06B6D4' },
    { id: 'profile' as AppMode, icon: User, label: 'Perfil', color: '#6B7280' },
    ...(showAdmin ? [{ id: 'admin' as AppMode, icon: Settings2, label: 'Admin', color: '#F59E0B' }] : []),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-purple-500/20 z-50 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} data-tutorial="tutorial-modes">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center px-1 py-1 min-w-max mx-auto" style={{ justifyContent: modes.length <= 6 ? 'center' : 'flex-start', width: modes.length <= 6 ? '100%' : 'auto' }}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all touch-manipulation flex-shrink-0 ${
                  isActive ? 'bg-purple-600/25' : 'active:bg-white/5'
                }`}
                style={{
                  color: isActive ? mode.color : '#6B7280',
                  minWidth: '56px',
                  minHeight: '52px',
                  padding: '6px 8px',
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold whitespace-nowrap leading-tight" style={{ color: isActive ? mode.color : '#6B7280' }}>
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
