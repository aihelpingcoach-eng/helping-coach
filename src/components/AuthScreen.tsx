import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo_(1).png';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [coachName, setCoachName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un email válido');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    if (isLogin) {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (!coachName.trim()) {
        setError('Por favor, ingresa tu nombre de entrenador');
        setLoading(false);
        return;
      }

      const { error: signUpError } = await signUp(email, password, coachName);
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email ya está registrado');
        } else {
          setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
        }
      }
    }

    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un email válido');
      setLoading(false);
      return;
    }

    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError('Error al enviar el correo de recuperación');
    } else {
      setResetMessage('Te hemos enviado un correo para restablecer tu contraseña');
      setTimeout(() => {
        setShowReset(false);
        setResetMessage('');
      }, 3000);
    }

    setLoading(false);
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg')] bg-cover bg-center opacity-20 blur-sm"></div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-8">
            <div className="flex justify-center mb-6">
              <img
                src={logoImg}
                alt="Helpin Coach Logo"
                className="w-56 h-56 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Ingresa tu email para recibir instrucciones
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {resetMessage && (
                <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                  {resetMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Enviando...' : 'Enviar Instrucciones'}
              </button>

              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="w-full text-gray-400 hover:text-white transition-colors text-sm"
              >
                Volver al inicio de sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg')] bg-cover bg-center opacity-20 blur-sm"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-8">
          <div className="flex justify-center mb-6">
            <img
              src={logoImg}
              alt="Helpin Coach Logo"
              className="w-56 h-56 object-contain"
            />
          </div>

          <h1 className="text-4xl font-bold text-center text-white mb-2">
            Helpin Coach
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Tu asistente táctico inteligente
          </p>

          <div className="flex gap-2 mb-8 bg-black/50 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Entrenador
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Pep Guardiola"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                    required={!isLogin}
                    minLength={8}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isLogin
                  ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

            {isLogin && (
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="w-full text-gray-400 hover:text-white transition-colors text-sm"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
