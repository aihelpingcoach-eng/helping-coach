import { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { computeTeamDNA } from '../constants/teamDNA';

interface Player {
  id: string;
  name: string;
  position: string;
  playstyle: string;
}

interface TeamDNAAnalysisProps {
  formation: string;
  players: Player[];
}

export default function TeamDNAAnalysis({ formation, players }: TeamDNAAnalysisProps) {
  const analysis = useMemo(
    () => players.length > 0 ? computeTeamDNA(formation, players) : null,
    [formation, players]
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Team DNA</h3>
          <p className="text-sm text-slate-400">Identidad táctica del equipo</p>
        </div>
      </div>

      {!analysis ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Agrega jugadores a tu equipo para analizar su identidad táctica
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">{analysis.name}</h4>
                <p className="text-purple-400 text-sm font-medium mb-1">{analysis.style}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{analysis.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h5 className="font-bold text-white">Fortalezas</h5>
            </div>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h5 className="font-bold text-white">Debilidades</h5>
            </div>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              <h5 className="font-bold text-white">Recomendación</h5>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{analysis.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
