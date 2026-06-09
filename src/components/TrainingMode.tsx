import { useState } from 'react';
import { MessageCircle, Zap, Brain, Heart, Rocket, Shield, Plus, History } from 'lucide-react';
import CoachChat from './CoachChat';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useXP } from '../hooks/useXP';
import { useAuth } from '../contexts/AuthContext';
import LevelUpModal from './LevelUpModal';
import { TrainingCategory } from '../constants/training';
import ExerciseIllustration from './ExerciseIllustration';
import { useExercises } from '../hooks/useExercises';
import { useTrainingSessions, TrainingSession } from '../hooks/useTrainingSessions';
import CreateSessionModal from './training/CreateSessionModal';
import ActiveSession from './training/ActiveSession';
import SessionHistory from './training/SessionHistory';

type View = 'library' | 'history';

export default function TrainingMode() {
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>('fuerza');
  const [view, setView] = useState<View>('library');
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);

  const { user } = useAuth();
  const { profile: coachProfile } = useCoachProfile();
  const { giveXP, showLevelUpModal, newLevel, closeLevelUpModal } = useXP();
  const { exercises, loading } = useExercises(selectedCategory);
  const { sessions, loading: sessionsLoading, createSession, completeSession, deleteSession } = useTrainingSessions(user?.id);

  const categories = [
    { id: 'fuerza' as TrainingCategory, name: 'Fuerza', icon: Zap, color: 'bg-yellow-600' },
    { id: 'tactico' as TrainingCategory, name: 'Táctico', icon: Brain, color: 'bg-purple-600' },
    { id: 'resistencia' as TrainingCategory, name: 'Resistencia', icon: Heart, color: 'bg-red-600' },
    { id: 'pliometria' as TrainingCategory, name: 'Pliometría', icon: Rocket, color: 'bg-blue-600' },
    { id: 'prevencion' as TrainingCategory, name: 'Prevención', icon: Shield, color: 'bg-green-600' },
  ];

  const handleCreateSession = async (name: string, exerciseIds: string[]) => {
    const session = await createSession({ name, category: selectedCategory, exercise_ids: exerciseIds });
    if (session) {
      setShowCreateModal(false);
      setActiveSession(session);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeSession) return;
    const ok = await completeSession(activeSession.id);
    if (ok) {
      await giveXP('USE_TRAINING');
      setActiveSession(null);
      setView('history');
    }
  };

  // Vista: sesión activa en curso
  if (activeSession) {
    return (
      <div className="relative w-full p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <ActiveSession
            session={activeSession}
            exercises={exercises}
            onComplete={handleCompleteSession}
            onBack={() => setActiveSession(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-white">Entrenamiento</h1>
            <p className="text-gray-400 mt-1">Ejercicios para mejorar el rendimiento de tus jugadores</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg flex-shrink-0"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva sesión</span>
          </button>
        </div>

        {/* Tabs: Biblioteca / Historial */}
        <div className="flex gap-1 bg-gray-800/60 rounded-xl p-1 mb-6 w-fit mt-6">
          <button
            onClick={() => setView('library')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
              view === 'library' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap size={16} />
            Ejercicios
          </button>
          <button
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
              view === 'history' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <History size={16} />
            Historial
            {sessions.filter(s => !s.completed).length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {sessions.filter(s => !s.completed).length}
              </span>
            )}
          </button>
        </div>

        {/* Historial */}
        {view === 'history' && (
          <SessionHistory
            sessions={sessions}
            loading={sessionsLoading}
            onResume={session => setActiveSession(session)}
            onDelete={deleteSession}
          />
        )}

        {/* Biblioteca de ejercicios */}
        {view === 'library' && (
          <>
            {/* Categorías */}
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

            {/* Ejercicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 border-2 border-gray-700 rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full h-36 bg-gray-700/50" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-700 rounded w-full" />
                      <div className="h-4 bg-gray-700 rounded w-5/6" />
                    </div>
                  </div>
                ))
              ) : (
                exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-gradient-to-br from-orange-900/20 to-black border-2 border-orange-800/50 rounded-xl overflow-hidden hover:border-orange-600 transition-all"
                  >
                    <div className="w-full" style={{ height: '140px' }}>
                      {exercise.image_url ? (
                        <img src={exercise.image_url} alt={exercise.name} className="w-full h-full object-cover" />
                      ) : (
                        <ExerciseIllustration type={exercise.illustration} />
                      )}
                    </div>
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
                ))
              )}
            </div>
          </>
        )}

        {/* Botón CoachChat */}
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
            context={{ mode: 'training', category: selectedCategory, coachProfile }}
            onXPEarned={() => giveXP('CONSULT_AI')}
          />
        )}

        {showCreateModal && (
          <CreateSessionModal
            exercises={exercises}
            category={selectedCategory}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateSession}
          />
        )}

        {showLevelUpModal && (
          <LevelUpModal visible={showLevelUpModal} newLevel={newLevel} onClose={closeLevelUpModal} />
        )}
      </div>
    </div>
  );
}
