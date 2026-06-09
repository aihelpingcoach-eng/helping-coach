import { useState } from 'react';
import { Plus, CalendarDays, Trophy, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMatches, Match } from '../hooks/useMatches';
import { useXP } from '../hooks/useXP';
import CreateMatchModal from './matches/CreateMatchModal';
import MatchResultModal from './matches/MatchResultModal';
import MatchCard from './matches/MatchCard';

type Tab = 'upcoming' | 'history';

export default function MatchCalendarMode() {
  const { user } = useAuth();
  const { matches, loading, createMatch, updateMatch, deleteMatch } = useMatches(user?.id);
  const { giveXP } = useXP();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [showCreate, setShowCreate] = useState(false);
  const [resultMatch, setResultMatch] = useState<Match | null>(null);

  const upcoming = matches.filter(m => !m.result);
  const history = matches.filter(m => m.result !== null);

  const wins   = history.filter(m => m.result === 'win').length;
  const draws  = history.filter(m => m.result === 'draw').length;
  const losses = history.filter(m => m.result === 'loss').length;

  const handleSaveResult = async (scoreFor: number, scoreAgainst: number) => {
    if (!resultMatch) return;
    const result = scoreFor > scoreAgainst ? 'win' : scoreFor < scoreAgainst ? 'loss' : 'draw';
    const ok = await updateMatch(resultMatch.id, { result, score_for: scoreFor, score_against: scoreAgainst });
    if (ok) giveXP('REGISTER_MATCH');
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm('¿Eliminar este partido?')) return;
    await deleteMatch(matchId);
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] flex flex-col px-4 py-4">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={22} className="text-cyan-400" />
          <h1 className="text-xl font-bold text-white">Partidos</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors touch-manipulation"
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      {/* Stats W-D-L */}
      {history.length > 0 && (
        <div className="flex-shrink-0 grid grid-cols-3 gap-2 mb-3">
          <div className="bg-green-900/30 border border-green-800/40 rounded-xl p-2.5 text-center">
            <p className="text-2xl font-bold text-green-400">{wins}</p>
            <p className="text-gray-400 text-xs">Victorias</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-800/40 rounded-xl p-2.5 text-center">
            <p className="text-2xl font-bold text-yellow-400">{draws}</p>
            <p className="text-gray-400 text-xs">Empates</p>
          </div>
          <div className="bg-red-900/30 border border-red-800/40 rounded-xl p-2.5 text-center">
            <p className="text-2xl font-bold text-red-400">{losses}</p>
            <p className="text-gray-400 text-xs">Derrotas</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex-shrink-0 flex gap-1 mb-3 bg-gray-900/60 rounded-xl p-1">
        {(['upcoming', 'history'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'upcoming' ? `Próximos${upcoming.length ? ` (${upcoming.length})` : ''}` : 'Historial'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : tab === 'upcoming' ? (
          upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CalendarDays size={48} className="text-gray-700 mb-3" />
              <p className="text-gray-400 font-semibold">Sin partidos programados</p>
              <p className="text-gray-600 text-sm mt-1">Pulsa "Nuevo" para añadir un partido</p>
            </div>
          ) : (
            upcoming.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onResult={setResultMatch}
                onDelete={handleDelete}
              />
            ))
          )
        ) : (
          history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Trophy size={48} className="text-gray-700 mb-3" />
              <p className="text-gray-400 font-semibold">Sin historial todavía</p>
              <p className="text-gray-600 text-sm mt-1">Registra resultados de tus partidos</p>
            </div>
          ) : (
            [...history].reverse().map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onResult={setResultMatch}
                onDelete={handleDelete}
              />
            ))
          )
        )}
      </div>

      {showCreate && (
        <CreateMatchModal
          onClose={() => setShowCreate(false)}
          onCreate={createMatch}
        />
      )}

      {resultMatch && (
        <MatchResultModal
          match={resultMatch}
          onClose={() => setResultMatch(null)}
          onSave={handleSaveResult}
        />
      )}
    </div>
  );
}
