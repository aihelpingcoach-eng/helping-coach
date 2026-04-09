import { useState } from 'react';
import { MessageCircle, ChevronRight, ArrowLeft, Activity, AlertCircle, Shield, Zap, Footprints, Dumbbell, Flame, Radiation, Bone, Cross } from 'lucide-react';
import CoachChat from './CoachChat';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useXP } from '../hooks/useXP';
import RankUpModal from './RankUpModal';
import { INJURY_CATEGORIES, InjuryCategory, InjuryDetail } from '../constants/injuries';

type ViewLevel = 'categories' | 'injuries' | 'detail';

const iconMap = {
  ankle: Footprints,
  muscle: Dumbbell,
  flame: Flame,
  knee: Radiation,
  tendon: Footprints,
  bone: Bone,
  'first-aid': Cross,
};

export default function InjuriesMode() {
  const [currentView, setCurrentView] = useState<ViewLevel>('categories');
  const [selectedCategory, setSelectedCategory] = useState<InjuryCategory | null>(null);
  const [selectedInjury, setSelectedInjury] = useState<InjuryDetail | null>(null);
  const [showCoachChat, setShowCoachChat] = useState(false);
  const { profile: coachProfile } = useCoachProfile();
  const { giveXP, showRankUpModal, newRank, closeRankUpModal } = useXP();

  const handleCategoryClick = (category: InjuryCategory) => {
    setSelectedCategory(category);
    setCurrentView('injuries');
  };

  const handleInjuryClick = (injury: InjuryDetail) => {
    setSelectedInjury(injury);
    setCurrentView('detail');
  };

  const handleBack = () => {
    if (currentView === 'detail') {
      setCurrentView('injuries');
      setSelectedInjury(null);
    } else if (currentView === 'injuries') {
      setCurrentView('categories');
      setSelectedCategory(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen pb-32 p-4 sm:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          {currentView !== 'categories' && (
            <button
              onClick={handleBack}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white p-3 rounded-2xl transition-all border border-white/10 hover:scale-110 active:scale-95"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
              {currentView === 'categories' && 'Centro Médico'}
              {currentView === 'injuries' && selectedCategory?.name}
              {currentView === 'detail' && selectedInjury?.name}
            </h1>
            <p className="text-gray-400 text-sm">
              {currentView === 'categories' && 'Categorías de lesiones deportivas'}
              {currentView === 'injuries' && `${selectedCategory?.injuries.length} lesiones registradas`}
              {currentView === 'detail' && 'Información médica detallada'}
            </p>
          </div>
        </div>

        {currentView === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INJURY_CATEGORIES.map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:border-red-500/50 active:scale-95 animate-scale-in overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="text-red-400" size={32} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <ChevronRight className="text-red-400" size={20} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{category.injuries.length} lesiones</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentView === 'injuries' && selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedCategory.injuries.map((injury, index) => (
              <div
                key={injury.id}
                onClick={() => handleInjuryClick(injury)}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:border-red-500/50 active:scale-95 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-transparent rounded-2xl transition-all duration-300" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                      {injury.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {injury.whatIs}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                    <ChevronRight className="text-red-400" size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'detail' && selectedInjury && (
          <div className="space-y-4 animate-scale-in">
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                  <Activity className="text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Definición</h3>
              </div>
              <p className="text-gray-300 leading-relaxed pl-15">{selectedInjury.whatIs}</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                  <AlertCircle className="text-orange-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Causa</h3>
              </div>
              <p className="text-gray-300 leading-relaxed pl-15">{selectedInjury.howItHappens}</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                  <Zap className="text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Tratamiento</h3>
              </div>
              <p className="text-gray-300 leading-relaxed pl-15">{selectedInjury.treatment}</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Prevención</h3>
              </div>
              <p className="text-gray-300 leading-relaxed pl-15">{selectedInjury.prevention}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowCoachChat(true)}
          className="fixed bottom-32 right-4 sm:right-8 z-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-2xl transition-all hover:scale-110 shadow-2xl active:scale-95 backdrop-blur-xl border border-red-400/30"
          title="Nursing Coach"
        >
          <MessageCircle size={24} />
        </button>

        {showCoachChat && (
          <CoachChat
            coachType="nursing"
            onClose={() => setShowCoachChat(false)}
            context={{
              mode: 'injuries',
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
