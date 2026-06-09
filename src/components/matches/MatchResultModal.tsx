import { useState } from 'react';
import { X } from 'lucide-react';
import { Match } from '../../hooks/useMatches';

interface Props {
  match: Match;
  onClose: () => void;
  onSave: (scoreFor: number, scoreAgainst: number) => void;
}

export default function MatchResultModal({ match, onClose, onSave }: Props) {
  const [scoreFor, setScoreFor] = useState<string>(match.score_for?.toString() ?? '');
  const [scoreAgainst, setScoreAgainst] = useState<string>(match.score_against?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const sf = parseInt(scoreFor, 10);
  const sa = parseInt(scoreAgainst, 10);
  const valid = !isNaN(sf) && !isNaN(sa) && sf >= 0 && sa >= 0;
  const preview = valid ? (sf > sa ? 'Victoria' : sf < sa ? 'Derrota' : 'Empate') : null;
  const previewColor = valid ? (sf > sa ? 'text-green-400' : sf < sa ? 'text-red-400' : 'text-yellow-400') : '';

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    await onSave(sf, sa);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-purple-500/40 rounded-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Resultado</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <p className="text-gray-400 text-sm text-center">
            vs <span className="text-white font-semibold">{match.opponent}</span>
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">Nosotros</p>
              <input
                type="number"
                min="0"
                max="99"
                value={scoreFor}
                onChange={e => setScoreFor(e.target.value)}
                className="w-20 h-16 bg-gray-800 border border-gray-700 text-white text-3xl font-bold text-center rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-gray-500 text-2xl font-bold">—</span>
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1">Rival</p>
              <input
                type="number"
                min="0"
                max="99"
                value={scoreAgainst}
                onChange={e => setScoreAgainst(e.target.value)}
                className="w-20 h-16 bg-gray-800 border border-gray-700 text-white text-3xl font-bold text-center rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {preview && (
            <p className={`text-center font-bold text-lg ${previewColor}`}>{preview}</p>
          )}

          <button
            onClick={handleSave}
            disabled={!valid || saving}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar resultado'}
          </button>
        </div>
      </div>
    </div>
  );
}
