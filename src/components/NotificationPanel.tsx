import { useEffect, useRef } from 'react';
import { CalendarDays, Trophy, CheckCircle, Zap, X } from 'lucide-react';
import { SmartReminder } from '../hooks/useNotifications';
import { AppMode } from './BottomNav';

interface Props {
  reminders: SmartReminder[];
  onClose: () => void;
  onNavigate: (mode: AppMode) => void;
}

const URGENCY_STYLES = {
  high:   'border-red-500/40 bg-red-900/20',
  medium: 'border-yellow-500/40 bg-yellow-900/20',
  low:    'border-gray-600/40 bg-gray-800/40',
};

const URGENCY_DOT = {
  high:   'bg-red-500',
  medium: 'bg-yellow-500',
  low:    'bg-gray-500',
};

function ReminderIcon({ type }: { type: SmartReminder['type'] }) {
  if (type === 'match')   return <CalendarDays size={16} className="text-cyan-400 flex-shrink-0" />;
  if (type === 'player')  return <Trophy size={16} className="text-yellow-400 flex-shrink-0" />;
  return <CheckCircle size={16} className="text-green-400 flex-shrink-0" />;
}

export default function NotificationPanel({ reminders, onClose, onNavigate }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleReminderClick = (reminder: SmartReminder) => {
    if (reminder.mode) {
      onNavigate(reminder.mode as AppMode);
      onClose();
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h3 className="text-white font-bold text-sm">Notificaciones</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <CheckCircle size={32} className="text-green-500 mb-2" />
            <p className="text-white font-semibold text-sm">Todo en orden</p>
            <p className="text-gray-500 text-xs mt-1">No hay recordatorios pendientes</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {reminders.map(reminder => (
              <button
                key={reminder.id}
                onClick={() => handleReminderClick(reminder)}
                className={`w-full text-left border rounded-xl px-3 py-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] ${URGENCY_STYLES[reminder.urgency]}`}
              >
                <div className="flex items-start gap-2.5">
                  <ReminderIcon type={reminder.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-xs font-semibold leading-tight">{reminder.title}</p>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${URGENCY_DOT[reminder.urgency]}`} />
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 leading-tight">{reminder.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer — link to tactical alerts */}
      <div className="border-t border-gray-800 px-4 py-2.5">
        <button
          onClick={() => { onNavigate('advanced'); onClose(); }}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs font-semibold transition-colors w-full"
        >
          <Zap size={13} />
          Ver alertas tácticas en Avanzado
        </button>
      </div>
    </div>
  );
}
