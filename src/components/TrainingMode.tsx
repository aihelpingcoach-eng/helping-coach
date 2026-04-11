import { useState } from 'react';
import { MessageCircle, Zap, Brain, Heart, Rocket, Shield } from 'lucide-react';
import CoachChat from './CoachChat';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useXP } from '../hooks/useXP';
import RankUpModal from './RankUpModal';
import { EXERCISES, TrainingCategory } from '../constants/training';
import ExerciseIllustration from './ExerciseIllustration';

export default function TrainingMode() {
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>('fuerza');
  const [showCoachChat, setShowCoachChat] = useState(false);
  const { profile: coachProfile } = useCoachProfile();
  const { giveXP, showRankUpModal, newRank, closeRankUpModal } = useXP();

  const categories = [
    { id: 'fuerza' as TrainingCategory, name: 'Fuerza', icon: Zap, color: 'bg-yellow-600' },
    { id: 'tactico' as TrainingCategory, name: 'Táctico', icon: Brain, color: 'bg-purple-600' },
    { id: 'resistencia' as TrainingCategory, name: 'Resistencia', icon: Heart, color: 'bg-red-600' },
    { id: 'pliometria' as TrainingCategory, name: 'Pliometría', icon: Rocket, color: 'bg-blue-600' },
    { id: 'prevencion' as TrainingCategory, name: 'Prevención', icon: Shield, color: 'bg-green-600' },
  ];

  return (
    <div className="relative w-full h-full min-h-screen pb-32 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Entrenamiento</h1>
        <p className="text-gray-400 mb-8">Ejercicios para mejorar el rendimiento de tus jugadores</p>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? `${category.color} text-white scale-105`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISES[selectedCategory].map((exercise, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-900/20 to-black border-2 border-orange-800/50 rounded-xl overflow-hidden hover:border-orange-600 transition-all"
            >
              {/* Illustration */}
              <div className="w-full" style={{ height: '140px' }}>
                <ExerciseIllustration type={exercise.illustration} />
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{exercise.name}</h3>
                <p className="text-gray-300 mb-4">{exercise.description}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400 font-semibold">Duración:</span>
                    <span className="text-gray-200">{exercise.duration}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-semibold">Beneficio:</span>
                    <span className="text-gray-200">{exercise.benefit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCoachChat(true)}
          className="fixed bottom-32 right-8 z-20 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full transition-all hover:scale-110 shadow-2xl"
          title="Training Coach"
        >
          <MessageCircle size={32} />
        </button>

        {showCoachChat && (
          <CoachChat
            coachType="training"
            onClose={() => setShowCoachChat(false)}
            context={{
              mode: 'training',
              category: selectedCategory,
              coachProfile,
            }}
            onXPEarned={() => giveXP('CONSULT_AI')}
          />
        )}

        {showRankUpModal && newRank && (
          <RankUpModal rank={newRank} onClose={closeRankUpModal} />
        )}
      </div>
    </div>
  );
}
