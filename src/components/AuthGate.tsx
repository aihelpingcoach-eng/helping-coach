import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from './AuthScreen';
import LandingPage from './LandingPage';
import splashBall from '../assets/illustrations/splash-ball.png';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <img src={splashBall} alt="" className="w-24 h-24 object-contain animate-spin-slow" />
        <div className="text-white text-2xl font-semibold animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) {
    // La landing de marketing solo se muestra en "/" y sin sesión. Cualquier
    // otra ruta (p. ej. /acceder, o "/" con sesión activa en una PWA
    // instalada) va directo al login o a la app.
    if (window.location.pathname === '/') {
      return <LandingPage />;
    }
    return <AuthScreen />;
  }

  return <>{children}</>;
}
