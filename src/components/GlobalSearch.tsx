import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, User, Dumbbell, Cross } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EXERCISES } from '../constants/training';
import { INJURY_CATEGORIES } from '../constants/injuries';
import { AppMode } from './BottomNav';

interface SearchResult {
  id: string;
  type: 'player' | 'exercise' | 'injury';
  title: string;
  subtitle: string;
  mode: AppMode;
}

interface Props {
  onClose: () => void;
  onNavigate: (mode: AppMode) => void;
}

function ResultIcon({ type }: { type: SearchResult['type'] }) {
  if (type === 'player')   return <User size={15} className="text-purple-400 flex-shrink-0" />;
  if (type === 'exercise') return <Dumbbell size={15} className="text-orange-400 flex-shrink-0" />;
  return <Cross size={15} className="text-red-400 flex-shrink-0" />;
}

const CATEGORY_LABELS: Record<string, string> = {
  fuerza: 'Fuerza', tactico: 'Táctico', resistencia: 'Resistencia',
  pliometria: 'Pliometría', prevencion: 'Prevención',
};

function buildStaticResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Exercises (static)
  for (const [cat, exercises] of Object.entries(EXERCISES)) {
    for (const ex of exercises) {
      if (ex.name.toLowerCase().includes(q) || ex.description.toLowerCase().includes(q) || ex.benefit.toLowerCase().includes(q)) {
        results.push({
          id: `ex-${cat}-${ex.name}`,
          type: 'exercise',
          title: ex.name,
          subtitle: `${CATEGORY_LABELS[cat] ?? cat} · ${ex.duration}`,
          mode: 'training',
        });
      }
    }
  }

  // Injuries (static)
  for (const cat of INJURY_CATEGORIES) {
    for (const inj of cat.injuries) {
      if (inj.name.toLowerCase().includes(q) || inj.whatIs.toLowerCase().includes(q)) {
        results.push({
          id: `inj-${inj.id}`,
          type: 'injury',
          title: inj.name,
          subtitle: cat.name,
          mode: 'injuries',
        });
      }
    }
  }

  return results;
}

export default function GlobalSearch({ onClose, onNavigate }: Props) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [playerResults, setPlayerResults] = useState<SearchResult[]>([]);
  const [staticResults, setStaticResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const searchPlayers = useCallback(async (q: string) => {
    if (!user?.id || q.length < 2) { setPlayerResults([]); return; }
    const { data } = await supabase
      .from('players')
      .select('id, name, playstyle, position, level')
      .eq('user_id', user.id)
      .or(`name.ilike.%${q}%,playstyle.ilike.%${q}%,position.ilike.%${q}%`)
      .limit(5);
    if (data) {
      setPlayerResults(data.map(p => ({
        id: `player-${p.id}`,
        type: 'player' as const,
        title: p.name,
        subtitle: [p.position, p.playstyle, `Niv. ${p.level}`].filter(Boolean).join(' · '),
        mode: 'tactics' as AppMode,
      })));
    }
  }, [user?.id]);

  useEffect(() => {
    if (query.length < 2) {
      setPlayerResults([]);
      setStaticResults([]);
      return;
    }
    setStaticResults(buildStaticResults(query));
    const timer = setTimeout(() => searchPlayers(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchPlayers]);

  const allResults = [...playerResults, ...staticResults].slice(0, 12);

  const grouped = {
    player:   allResults.filter(r => r.type === 'player'),
    exercise: allResults.filter(r => r.type === 'exercise'),
    injury:   allResults.filter(r => r.type === 'injury'),
  };

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col">
      {/* Search input */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
        <Search size={20} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Busca jugadores, ejercicios, lesiones..."
          className="flex-1 bg-transparent text-white text-base placeholder-gray-600 focus:outline-none"
        />
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
          <X size={20} />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {query.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Search size={40} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">Escribe al menos 2 caracteres para buscar</p>
          </div>
        ) : allResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-gray-400 font-semibold">Sin resultados</p>
            <p className="text-gray-600 text-sm mt-1">para "{query}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.player.length > 0 && (
              <ResultGroup label="Jugadores" results={grouped.player} onSelect={handleSelect} />
            )}
            {grouped.exercise.length > 0 && (
              <ResultGroup label="Ejercicios" results={grouped.exercise} onSelect={handleSelect} />
            )}
            {grouped.injury.length > 0 && (
              <ResultGroup label="Lesiones" results={grouped.injury} onSelect={handleSelect} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultGroup({ label, results, onSelect }: {
  label: string;
  results: SearchResult[];
  onSelect: (r: SearchResult) => void;
}) {
  return (
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 px-1">{label}</p>
      <div className="space-y-1">
        {results.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900/60 hover:bg-gray-800 active:bg-gray-700 transition-colors text-left"
          >
            <ResultIcon type={r.type} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{r.title}</p>
              <p className="text-gray-500 text-xs truncate">{r.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
