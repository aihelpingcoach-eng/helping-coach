import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import AuthGate from './components/AuthGate';
import BottomNav, { AppMode } from './components/BottomNav';
import TacticsMode from './components/TacticsMode';
import InjuriesMode from './components/InjuriesMode';
import TrainingMode from './components/TrainingMode';
import ProgressMode from './components/ProgressMode';
import ProfileMode from './components/ProfileMode';
import AdvancedMode from './components/AdvancedMode';
import MatchCalendarMode from './components/MatchCalendarMode';
import AdminPanel from './components/AdminPanel';
import MusicPlayer from './components/MusicPlayer';
import ParallaxBackground from './components/ParallaxBackground';
import Tutorial from './components/Tutorial';
import NotificationPanel from './components/NotificationPanel';
import OnboardingWizard from './components/OnboardingWizard';
import GlobalSearch from './components/GlobalSearch';
import ErrorBoundary from './components/ErrorBoundary';
import { useMatches } from './hooks/useMatches';
import { useSmartReminders } from './hooks/useNotifications';
import { useCoachProfile } from './hooks/useCoachProfile';
import { isAdmin } from './utils/isAdmin';
import logoImg from './assets/logo_new.png';

function AppContent() {
  const [activeMode, setActiveMode] = useState<AppMode>('tactics');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();
  const isAdminUser = isAdmin(user?.email);
  const { profile, loading: profileLoading, updateProfile } = useCoachProfile();
  const { matches } = useMatches(user?.id);
  const reminders = useSmartReminders(matches, 0);
  const showOnboarding = !profileLoading && profile !== null && !profile.team_name;
  const urgentCount = reminders.filter(r => r.urgency === 'high').length;
  const totalCount = reminders.length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParallaxBackground />

      <div className="relative z-10 h-screen flex flex-col">
        <header className="flex-shrink-0 bg-black/30 backdrop-blur-md border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center justify-center text-gray-400 active:text-white transition-colors touch-manipulation rounded-lg"
              style={{ minWidth: '44px', minHeight: '44px' }}
              title="Buscar"
            >
              <Search size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={logoImg}
                alt="Helpin Coach"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 className="text-base sm:text-xl font-bold text-white">Helpin Coach</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative flex items-center justify-center text-gray-400 active:text-white transition-colors touch-manipulation rounded-lg"
                style={{ minWidth: '44px', minHeight: '44px' }}
                title="Notificaciones"
              >
                <Bell size={20} className="sm:w-6 sm:h-6" />
                {totalCount > 0 && (
                  <span className={`absolute top-1 right-1 min-w-[16px] h-4 rounded-full text-[9px] font-bold flex items-center justify-center px-0.5 ${urgentCount > 0 ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
                    {totalCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel
                  reminders={reminders}
                  onClose={() => setShowNotifications(false)}
                  onNavigate={(mode) => { setActiveMode(mode); setShowNotifications(false); }}
                />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' }}>
          {activeMode === 'tactics' && <TacticsMode />}
          {activeMode === 'injuries' && <InjuriesMode />}
          {activeMode === 'training' && <TrainingMode />}
          {activeMode === 'advanced' && <AdvancedMode />}
          {activeMode === 'progress' && <ProgressMode />}
          {activeMode === 'calendar' && <MatchCalendarMode />}
          {activeMode === 'profile' && <ProfileMode />}
          {activeMode === 'admin' && isAdminUser && <AdminPanel />}
        </div>
      </div>

      <BottomNav activeMode={activeMode} onModeChange={setActiveMode} showAdmin={isAdminUser} />
      <MusicPlayer />
      <Tutorial />
      {showSearch && (
        <GlobalSearch
          onClose={() => setShowSearch(false)}
          onNavigate={(mode) => { setActiveMode(mode); setShowSearch(false); }}
        />
      )}
      {showOnboarding && (
        <OnboardingWizard
          coachName={profile.coach_name}
          onComplete={updateProfile}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate>
          <AppContent />
        </AuthGate>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
