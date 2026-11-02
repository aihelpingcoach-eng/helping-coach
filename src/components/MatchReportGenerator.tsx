import { useState } from 'react';
import { FileText, Loader, Users, AlertCircle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import { generateMatchReport } from '../utils/ai';
import { downloadTextFile, buildMatchReportText } from '../utils/exportReport';
import AdGate from './AdGate';
import { useAdGate } from '../hooks/useAdGate';
import { Match } from '../hooks/useMatches';

interface MatchReportGeneratorProps {
  teamPlaystyles: string[];
  /** Partidos registrados en Partidos: los que tienen resultado se pueden elegir */
  matches: Match[];
}

interface MatchReport {
  summary: string;
  key_players: string[];
  issues: string[];
  recommendations: string[];
}

const RESULT_LABEL = { win: 'Victoria', draw: 'Empate', loss: 'Derrota' } as const;

const inputClass =
  'w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500';

function matchLabel(m: Match) {
  const date = new Date(`${m.date}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return `${date} · ${m.opponent} · ${m.score_for}-${m.score_against}`;
}

export default function MatchReportGenerator({ teamPlaystyles, matches }: MatchReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<MatchReport | null>(null);
  const [error, setError] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const { withAdGate, showAdGate, featureName, handleAdComplete, handleAdCancel } = useAdGate();

  const [matchData, setMatchData] = useState({
    result: '',
    possession: 50,
    shots: 10,
  });

  const playedMatches = matches
    .filter(m => m.result !== null && m.score_for !== null && m.score_against !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  const pickMatch = (id: string) => {
    setSelectedMatchId(id);
    const match = playedMatches.find(m => m.id === id);
    setMatchData(data => ({
      ...data,
      result: match?.result
        ? `${match.score_for}-${match.score_against} ${RESULT_LABEL[match.result]} contra ${match.opponent}`
        : '',
    }));
  };

  const handleGenerate = async () => {
    if (!matchData.result) {
      setError('Elige un partido o escribe el resultado');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const result = await generateMatchReport(
        matchData.result,
        matchData.possession,
        matchData.shots,
        teamPlaystyles
      );
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el informe');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      {!report && (
        <div className="space-y-4 mb-5">
          <div>
            <label htmlFor="report-match" className="block text-sm font-medium text-gray-300 mb-2">
              Partido
            </label>
            <select
              id="report-match"
              value={selectedMatchId}
              onChange={e => pickMatch(e.target.value)}
              className={inputClass}
            >
              <option value="">Escribir el resultado a mano</option>
              {playedMatches.map(m => (
                <option key={m.id} value={m.id}>
                  {matchLabel(m)}
                </option>
              ))}
            </select>
            {playedMatches.length === 0 && (
              <p className="text-xs text-gray-500 mt-1.5">
                Cuando añadas resultados en Partidos podrás elegirlos aquí.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="report-result" className="block text-sm font-medium text-gray-300 mb-2">
              Resultado
            </label>
            <input
              id="report-result"
              type="text"
              value={matchData.result}
              onChange={e => {
                setSelectedMatchId('');
                setMatchData({ ...matchData, result: e.target.value });
              }}
              placeholder="Ej.: 3-1 Victoria"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="report-possession" className="block text-sm font-medium text-gray-300 mb-2">
              Posesión
            </label>
            <input
              id="report-possession"
              type="range"
              min="0"
              max="100"
              value={matchData.possession}
              onChange={e => setMatchData({ ...matchData, possession: parseInt(e.target.value, 10) })}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>0%</span>
              <span className="font-bold text-white">{matchData.possession}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label htmlFor="report-shots" className="block text-sm font-medium text-gray-300 mb-2">
              Tiros a puerta
            </label>
            <input
              id="report-shots"
              type="number"
              min="0"
              inputMode="numeric"
              value={matchData.shots}
              onChange={e => setMatchData({ ...matchData, shots: Math.max(0, parseInt(e.target.value, 10) || 0) })}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!report && (
        <button
          type="button"
          onClick={() => withAdGate(handleGenerate, 'informe de partido')}
          disabled={generating || !matchData.result}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generando informe...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generar informe
            </>
          )}
        </button>
      )}

      {report && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">{matchData.result}</p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="font-bold text-white text-sm mb-2">Resumen</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{report.summary}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
              <Users className="w-4 h-4 text-yellow-300" />
              Jugadores destacados
            </h4>
            <ul className="space-y-1.5">
              {report.key_players.map((player, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  {player}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              Problemas detectados
            </h4>
            <ul className="space-y-1.5">
              {report.issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-orange-400" aria-hidden="true">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Recomendaciones
            </h4>
            <ul className="space-y-1.5">
              {report.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-green-400" aria-hidden="true">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const text = buildMatchReportText({ ...matchData, ...report });
                downloadTextFile(text, `informe-partido-${new Date().toISOString().slice(0, 10)}.txt`);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button
              type="button"
              onClick={() => setReport(null)}
              className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors text-sm font-semibold"
            >
              Nuevo informe
            </button>
          </div>
        </div>
      )}

      {showAdGate && (
        <AdGate featureName={featureName} onComplete={handleAdComplete} onCancel={handleAdCancel} />
      )}
    </div>
  );
}
