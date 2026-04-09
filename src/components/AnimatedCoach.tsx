import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnimatedCoachProps {
  type: 'tactical' | 'training' | 'medical';
  message?: string;
  mood?: 'happy' | 'neutral' | 'concerned' | 'excited';
}

const coachData = {
  tactical: {
    name: 'Helpin Coach',
    color: 'from-purple-600 to-pink-600',
    icon: '⚽',
    emoji: {
      happy: '😊',
      neutral: '🤔',
      concerned: '😐',
      excited: '🔥',
    },
  },
  training: {
    name: 'Training Coach',
    color: 'from-orange-600 to-red-600',
    icon: '💪',
    emoji: {
      happy: '💪',
      neutral: '🏃',
      concerned: '😓',
      excited: '⚡',
    },
  },
  medical: {
    name: 'Nursing Coach',
    color: 'from-red-600 to-pink-600',
    icon: '🏥',
    emoji: {
      happy: '✅',
      neutral: '🩺',
      concerned: '⚠️',
      excited: '❤️',
    },
  },
};

export default function AnimatedCoach({ type, message, mood = 'neutral' }: AnimatedCoachProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const coach = coachData[type];

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (message) {
      setIsTalking(true);
      const timer = setTimeout(() => setIsTalking(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="relative">
      <div
        className={`bg-gradient-to-br ${coach.color} rounded-2xl p-4 shadow-2xl border-2 border-white/20 animate-scale-in`}
      >
        <div className="flex items-start gap-3">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-3xl transition-transform ${
                isTalking ? 'animate-pulse scale-110' : ''
              }`}
            >
              <span className={isBlinking ? 'opacity-50' : 'opacity-100'}>
                {coach.emoji[mood]}
              </span>
            </div>

            {isTalking && (
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-bold text-sm">{coach.name}</h3>
              <MessageCircle size={14} className="text-white/70" />
            </div>

            {message && (
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white text-sm animate-slide-up">
                <p className="leading-relaxed">{message}</p>
              </div>
            )}

            {!message && (
              <p className="text-white/80 text-xs">Listo para ayudarte...</p>
            )}
          </div>
        </div>
      </div>

      {isTalking && (
        <>
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
        </>
      )}
    </div>
  );
}
