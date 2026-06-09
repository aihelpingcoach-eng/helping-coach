import { useState } from 'react';
import { X } from 'lucide-react';
import { CreateMatchPayload } from '../../hooks/useMatches';

interface Props {
  onClose: () => void;
  onCreate: (payload: CreateMatchPayload) => void;
}

const COMPETITIONS = ['Liga', 'Copa', 'Amistoso', 'Torneo', 'Play-off', 'Supercopa'];

export default function CreateMatchModal({ onClose, onCreate }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [competition, setCompetition] = useState('Liga');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim() || !date) return;
    setSaving(true);
    await onCreate({ opponent: opponent.trim(), date, time, location, competition, notes });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-purple-500/40 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Nuevo partido</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Rival *</label>
            <input
              type="text"
              value={opponent}
              onChange={e => setOpponent(e.target.value)}
              placeholder="Nombre del equipo rival"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500 placeholder-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Fecha *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Hora</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Competición</label>
            <select
              value={competition}
              onChange={e => setCompetition(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500"
            >
              {COMPETITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Lugar</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Campo / estadio"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500 placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Notas</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Observaciones previas..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-purple-500 placeholder-gray-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !opponent.trim() || !date}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar partido'}
          </button>
        </form>
      </div>
    </div>
  );
}
