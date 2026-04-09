import React, { useState } from 'react';
import { FileText, Loader, Users, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { generateMatchReport } from '../utils/ai';

interface MatchReportGeneratorProps {
  teamPlaystyles: string[];
}

interface MatchReport {
  summary: string;
  key_players: string[];
  issues: string[];
  recommendations: string[];
}

export default function MatchReportGenerator({ teamPlaystyles }: MatchReportGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<MatchReport | null>(null);
  const [error, setError] = useState('');

  const [matchData, setMatchData] = useState({
    result: '',
    possession: 50,
    shots: 10,
  });

  const handleGenerate = async () => {
    if (!matchData.result) {
      setError('Ingresa el resultado del partido');
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
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Informe de Partido</h3>
          <p className="text-sm text-slate-400">Análisis táctico post-partido</p>
        </div>
      </div>

      {!report && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Resultado
            </label>
            <input
              type="text"
              value={matchData.result}
              onChange={(e) => setMatchData({ ...matchData, result: e.target.value })}
              placeholder="Ej: 3-1 Victoria"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Posesión (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={matchData.possession}
              onChange={(e) => setMatchData({ ...matchData, possession: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400 mt-1">
              <span>0%</span>
              <span className="font-bold text-white">{matchData.possession}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tiros al arco
            </label>
            <input
              type="number"
              value={matchData.shots}
              onChange={(e) => setMatchData({ ...matchData, shots: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!report && (
        <button
          onClick={handleGenerate}
          disabled={generating || !matchData.result}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generando informe...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generar Informe
            </>
          )}
        </button>
      )}

      {report && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h5 className="font-bold text-white mb-2">Resumen</h5>
            <p className="text-slate-300 text-sm leading-relaxed">{report.summary}</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <h5 className="font-bold text-white">Jugadores Destacados</h5>
            </div>
            <ul className="space-y-2">
              {report.key_players.map((player: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{player}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <h5 className="font-bold text-white">Problemas Detectados</h5>
            </div>
            <ul className="space-y-2">
              {report.issues.map((issue: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h5 className="font-bold text-white">Recomendaciones</h5>
            </div>
            <ul className="space-y-2">
              {report.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setReport(null)}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
          >
            Generar nuevo informe
          </button>
        </div>
      )}
    </div>
  );
}
