import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthGate from './components/AuthGate';
import BottomNav, { AppMode } from './components/BottomNav';
import TacticsMode from './components/TacticsMode';
import InjuriesMode from './components/InjuriesMode';
import TrainingMode from './components/TrainingMode';
import ProgressMode from './components/ProgressMode';
import ProfileMode from './components/ProfileMode';
import AdvancedMode from './components/AdvancedMode';
import ParallaxBackground from './components/ParallaxBackground';
import Tutorial from './components/Tutorial';
import logoImg from './assets/logo_(1).png';

function AppContent() {
  const [activeMode, setActiveMode] = useState<AppMode>('tactics');

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParallaxBackground />

      <div className="relative z-10 h-screen flex flex-col">
        <header className="flex-shrink-0 bg-black/30 backdrop-blur-md border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-center items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={logoImg}
                alt="Helpin Coach"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 className="text-base sm:text-xl font-bold text-white">Helpin Coach</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeMode === 'tactics' && <TacticsMode />}
          {activeMode === 'injuries' && <InjuriesMode />}
          {activeMode === 'training' && <TrainingMode />}
          {activeMode === 'advanced' && <AdvancedMode />}
          {activeMode === 'progress' && <ProgressMode />}
          {activeMode === 'profile' && <ProfileMode />}
        </div>
      </div>

      <BottomNav activeMode={activeMode} onModeChange={setActiveMode} />
      <Tutorial />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppContent />
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
