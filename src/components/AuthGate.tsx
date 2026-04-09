import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from './AuthScreen';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-white text-2xl font-semibold animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}
