import { Trophy, Sparkles, X } from 'lucide-react';
import { Rank } from '../constants/progression';

interface RankUpModalProps {
  rank: Rank;
  onClose: () => void;
}

export default function RankUpModal({ rank, onClose }: RankUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="relative max-w-lg w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl animate-pulse" />

        <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl border-2 border-purple-500 p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 blur-2xl opacity-50 animate-pulse" />
              <Trophy className="relative mx-auto text-yellow-400 animate-bounce" size={80} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-purple-400" size={20} />
                <p className="text-purple-300 font-semibold text-lg">¡Felicidades!</p>
                <Sparkles className="text-purple-400" size={20} />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                Has alcanzado el rango
              </h2>
              <div className={`inline-block bg-gradient-to-r ${rank.color} text-white px-6 py-3 rounded-xl text-3xl font-bold shadow-lg`}>
                {rank.icon} {rank.name}
              </div>
            </div>

            <p className="text-gray-300 text-lg italic">
              {rank.description}
            </p>

            <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Nuevos Desbloqueos</h3>
              <ul className="space-y-2">
                {rank.unlocks.map((unlock, index) => (
                  <li key={index} className="flex items-center gap-3 text-green-400">
                    <span className="text-2xl">✓</span>
                    <span className="text-left">{formatUnlock(unlock)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              ¡Continuar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatUnlock(unlock: string): string {
  const unlockNames: { [key: string]: string } = {
    'basic_formations': 'Formaciones básicas',
    'basic_playstyles': 'PlayStyles básicos',
    'advanced_formations': 'Formaciones avanzadas',
    'tactical_recommendations': 'Recomendaciones tácticas',
    'synergy_analysis': 'Análisis de sinergias mejorado',
    'ai_detailed_reports': 'Informes detallados de la IA',
    'playstyle_plus': 'PlayStyle+ disponible',
    'custom_training': 'Entrenamientos personalizados',
    'advanced_ai_analysis': 'Análisis IA avanzado',
    'elite_formations': 'Formaciones élite',
    'full_tactical_control': 'Control táctico completo',
    'masterclass_training': 'Entrenamientos masterclass',
    'legendary_insights': 'Insights legendarios',
    'profile_customization': 'Personalización avanzada del perfil',
    'all_features': 'Todas las características desbloqueadas',
  };

  return unlockNames[unlock] || unlock;
}
