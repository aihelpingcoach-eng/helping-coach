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

// El cálculo es determinista (mismos jugadores + formación = mismo ADN), así
// que se muestra directamente: sobraban los botones "Analizar" y "Volver a
// analizar". El título y el recuadro los pone la sección que lo contiene.
export default function TeamDNAAnalysis({ formation, players }: TeamDNAAnalysisProps) {
  const analysis = useMemo(
    () => (players.length > 0 ? computeTeamDNA(formation, players) : null),
    [formation, players]
  );

  if (!analysis) {
    return (
      <div className="text-center py-6">
        <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">
          Añade jugadores a la alineación de este equipo para conocer su identidad táctica.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4">
        <p className="text-xs font-semibold text-purple-200/80 mb-0.5">{analysis.style}</p>
        <h3 className="text-xl font-bold text-white">{analysis.name}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mt-1">{analysis.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Fortalezas
          </h4>
          <ul className="space-y-1.5">
            {analysis.strengths.map(strength => (
              <li key={strength} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-green-400" aria-hidden="true">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Debilidades
          </h4>
          <ul className="space-y-1.5">
            {analysis.weaknesses.map(weakness => (
              <li key={weakness} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-orange-400" aria-hidden="true">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-300" />
          Recomendación
        </h4>
        <p className="text-gray-300 text-sm leading-relaxed">{analysis.recommendation}</p>
      </div>
    </div>
  );
}
