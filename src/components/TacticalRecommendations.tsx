import { useState } from 'react';
import { Player, FormationType } from '../constants/playstyles';
import { Lightbulb, X } from 'lucide-react';

interface TacticalRecommendationsProps {
  formation: FormationType;
  players: Player[];
}

export default function TacticalRecommendations({ formation, players }: TacticalRecommendationsProps) {
  const [showModal, setShowModal] = useState(false);

  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];

    const categories = players.map(p => p.playstyle_category).filter(Boolean);
    const categoryCount = categories.reduce((acc, cat) => {
      acc[cat!] = (acc[cat!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (categoryCount['Pase'] >= 3) {
      recommendations.push('Alto control de balón: juega con posesión');
    } else if (categoryCount['Físico'] >= 3) {
      recommendations.push('Equipo físico: presión alta');
    }

    if (categoryCount['Finalización'] >= 2 && categoryCount['Pase'] >= 2) {
      recommendations.push('Balance ofensivo: juego directo efectivo');
    }

    if (categoryCount['Defensa'] >= 3) {
      recommendations.push('Sólido atrás: contraataque rápido');
    }

    if (formation === '4-3-3') {
      recommendations.push('4-3-3: Amplitud por bandas');
    } else if (formation === '4-4-2') {
      recommendations.push('4-4-2: Control del centro del campo');
    } else if (formation === '3-5-2') {
      recommendations.push('3-5-2: Dominio del mediocampo');
    }

    if (recommendations.length === 0) {
      recommendations.push('Añade más jugadores para recomendaciones');
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 active:bg-blue-700 text-white p-2 sm:p-3 rounded-full transition-all active:scale-95 shadow-lg touch-manipulation h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] flex items-center justify-center"
        title="Recomendaciones Tácticas"
      >
        <Lightbulb size={20} className="sm:w-6 sm:h-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/50 rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-3 rounded-full">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Recomendaciones Tácticas</h2>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-gray-200">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
