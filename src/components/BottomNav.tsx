import { ButtonHTMLAttributes, ComponentType, useState } from 'react';
import { CalendarDays, ChevronRight, Cross, Dumbbell, LayoutGrid, User, X, Zap, Settings2 } from 'lucide-react';
import Modal from './Modal';

// Campo de fútbol visto desde arriba con jugadores en formación
function TacticsFieldIcon({ size = 22, className = '' }: { size?: number | string; strokeWidth?: number | string; className?: string }) {
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

function TwoCardsIcon({ size = 22, className = '' }: { size?: number | string; strokeWidth?: number | string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Back card — rotated left */}
      <g transform="rotate(-10, 9, 13)">
        <rect x="2" y="6" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </g>
      {/* Front card — rotated right */}
      <g transform="rotate(8, 15, 13)">
        <rect x="9" y="6" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14.5" y="11" width="2" height="6" rx="1" fill="currentColor" />
        <rect x="12" y="13.5" width="7" height="2" rx="1" fill="currentColor" />
      </g>
    </svg>
  );
}

export type AppMode = 'injuries' | 'training' | 'tactics' | 'progress' | 'profile' | 'advanced' | 'calendar' | 'admin';

type NavIcon = ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;

interface NavItem {
  id: AppMode;
  icon: NavIcon;
  label: string;
  description?: string;
}

interface BottomNavProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  showAdmin?: boolean;
}

// Cuatro secciones fijas + "Más": con 7–8 botones la barra no cabía en
// móviles de 360–390 px y Perfil quedaba fuera de pantalla.
const primaryItems: NavItem[] = [
  { id: 'injuries', icon: Cross, label: 'Lesiones' },
  { id: 'training', icon: Dumbbell, label: 'Entreno' },
  { id: 'tactics', icon: TacticsFieldIcon, label: 'Tácticas' },
  { id: 'calendar', icon: CalendarDays, label: 'Partidos' },
];

const moreItems: NavItem[] = [
  { id: 'progress', icon: TwoCardsIcon, label: 'Progreso', description: 'Evalúa a tus jugadores deslizando sus cartas' },
  { id: 'advanced', icon: Zap, label: 'Avanzado', description: 'Alertas, misiones, ADN del equipo e informes' },
  { id: 'profile', icon: User, label: 'Perfil', description: 'Tu XP, rango y estadísticas de entrenador' },
];

const adminItem: NavItem = { id: 'admin', icon: Settings2, label: 'Admin', description: 'Panel de administración' };

function NavButton({
  icon: Icon,
  label,
  isActive,
  ...buttonProps
}: { icon: NavIcon; label: string; isActive: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="group flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-1.5 touch-manipulation [-webkit-tap-highlight-color:transparent]"
      {...buttonProps}
    >
      <span
        className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${
          isActive ? 'bg-purple-600/30 text-purple-200' : 'text-gray-400 group-hover:text-gray-200 group-active:bg-white/5'
        }`}
      >
        <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
      </span>
      <span
        className={`text-[11px] leading-none whitespace-nowrap ${
          isActive ? 'font-bold text-purple-200' : 'font-medium text-gray-400 group-hover:text-gray-200'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function BottomNav({ activeMode, onModeChange, showAdmin }: BottomNavProps) {
  const [showMore, setShowMore] = useState(false);
  const extraItems = showAdmin ? [...moreItems, adminItem] : moreItems;
  const activeExtra = extraItems.find(item => item.id === activeMode);

  const goTo = (mode: AppMode) => {
    onModeChange(mode);
    setShowMore(false);
  };

  return (
    <>
      <nav
        aria-label="Secciones"
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-purple-500/20 z-50 flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        data-tutorial="tutorial-modes"
      >
        <div className="flex items-stretch max-w-lg mx-auto px-1 py-1">
          {primaryItems.map(item => (
            <NavButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeMode === item.id}
              aria-current={activeMode === item.id ? 'page' : undefined}
              onClick={() => goTo(item.id)}
            />
          ))}
          {/* Siempre "Más" (como en iOS/Android); se resalta si la sección
              activa está dentro, y el nombre accesible dice cuál es. */}
          <NavButton
            icon={LayoutGrid}
            label="Más"
            isActive={!!activeExtra || showMore}
            aria-haspopup="dialog"
            aria-expanded={showMore}
            aria-label={activeExtra ? `Más secciones (ahora en ${activeExtra.label})` : 'Más secciones'}
            onClick={() => setShowMore(true)}
          />
        </div>
      </nav>

      {/* Fuera del <nav>: su backdrop-blur haría de contenedor de los fixed */}
      {showMore && (
        <Modal
          align="bottom"
          onClose={() => setShowMore(false)}
          aria-label="Más secciones"
          contentClassName="w-full max-w-lg rounded-t-3xl border-t border-purple-500/30 bg-gradient-to-b from-gray-900 to-black px-4 pt-2 animate-slide-up"
        >
          <div style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/20" aria-hidden="true" />
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Más secciones</h2>
              <button
                type="button"
                onClick={() => setShowMore(false)}
                aria-label="Cerrar"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="space-y-2">
              {extraItems.map(item => {
                const Icon = item.icon;
                const isActive = activeMode === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        isActive
                          ? 'border-purple-500/50 bg-purple-600/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="w-11 h-11 flex-shrink-0 rounded-xl bg-purple-600/20 text-purple-200 flex items-center justify-center">
                        <Icon size={22} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-white">{item.label}</span>
                        <span className="block text-xs text-gray-400">{item.description}</span>
                      </span>
                      <ChevronRight size={18} className="text-gray-500 flex-shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}
