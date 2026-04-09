import React, { useState } from 'react';
import { Lightbulb, Loader, Shield, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { recommendFormation } from '../utils/ai';

interface Player {
  id: string;
  name: string;
  position: string;
  playstyle: string;
}

interface FormationRecommendation {
  recommended_formation: string;
  style: string;
  reason: string;
  strengths: string[];
  risks: string[];
  ideal_scenario: string;
}

interface FormationAdvisorProps {
  currentFormation: string;
  players: Player[];
  onFormationSelect?: (formation: string) => void;
}

export default function FormationAdvisor({ currentFormation, players, onFormationSelect }: FormationAdvisorProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<FormationRecommendation | null>(null);
  const [error, setError] = useState('');

  const [tacticalObjective, setTacticalObjective] = useState('Equilibrado');
  const [physicalState, setPhysicalState] = useState('Óptimo');

  const generateRecommendations = async () => {
    if (players.length === 0) {
      setError('Necesitas al menos un jugador para obtener recomendaciones');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await recommendFormation(
        currentFormation,
        tacticalObjective,
        physicalState,
        players.map(p => ({
          name: p.name,
          position: p.position,
          playstyle: p.playstyle,
        }))
      );
      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Asesor de Formaciones</h3>
          <p className="text-sm text-blue-200/70">Recomendación táctica con IA</p>
        </div>
      </div>

      {!recommendation && (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Objetivo Táctico
            </label>
            <select
              value={tacticalObjective}
              onChange={(e) => setTacticalObjective(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Equilibrado">Equilibrado</option>
              <option value="Ofensivo">Ofensivo</option>
              <option value="Defensivo">Defensivo</option>
              <option value="Contraataque">Contraataque</option>
              <option value="Posesión">Posesión</option>
              <option value="Presión Alta">Presión Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estado Físico del Equipo
            </label>
            <select
              value={physicalState}
              onChange={(e) => setPhysicalState(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Óptimo">Óptimo</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Fatigado">Fatigado</option>
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!recommendation && (
        <button
          onClick={generateRecommendations}
          disabled={loading || players.length === 0}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              Obtener Recomendación
            </>
          )}
        </button>
      )}

      {recommendation && (
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">
                  {recommendation.recommended_formation}
                </h4>
                <p className="text-blue-400 text-sm font-medium">{recommendation.style}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{recommendation.reason}</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h5 className="font-bold text-white">Fortalezas</h5>
            </div>
            <ul className="space-y-2">
              {recommendation.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h5 className="font-bold text-white">Riesgos</h5>
            </div>
            <ul className="space-y-2">
              {recommendation.risks.map((risk: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span className="text-slate-300 text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <h5 className="font-bold text-white">Escenario Ideal</h5>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{recommendation.ideal_scenario}</p>
          </div>

          <div className="flex gap-2">
            {onFormationSelect && (
              <button
                onClick={() => onFormationSelect(recommendation.recommended_formation)}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors font-medium"
              >
                Aplicar formación
              </button>
            )}
            <button
              onClick={() => setRecommendation(null)}
              className="flex-1 px-3 py-2 bg-blue-600/50 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            >
              Nueva recomendación
            </button>
          </div>
        </div>
      )}

      {players.length === 0 && !recommendation && (
        <p className="text-blue-200/50 text-sm text-center mt-4">
          Agrega jugadores para recibir recomendaciones
        </p>
      )}
    </div>
  );
}
