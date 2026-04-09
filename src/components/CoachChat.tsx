import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { chatWithCoach } from '../utils/ai';
import helpinImg from '../assets/erasebg-transformed_(3).png';
import nursingImg from '../assets/erasebg-transformed_(7).png';
import trainingImg from '../assets/erasebg-transformed_(6).png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachChatProps {
  coachType: 'helpin' | 'nursing' | 'training';
  onClose: () => void;
  context: any;
  onXPEarned?: () => void;
}

const coachNames = {
  helpin: 'Helpin Coach',
  nursing: 'Nursing Coach',
  training: 'Training Coach',
};

const coachImages = {
  helpin: helpinImg,
  nursing: nursingImg,
  training: trainingImg,
};

export default function CoachChat({ coachType, onClose, context, onXPEarned }: CoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy ${coachNames[coachType]}. ¿En qué puedo ayudarte hoy?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithCoach(coachType, input, context);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);

      if (onXPEarned) {
        onXPEarned();
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Lo siento, no estoy disponible ahora mismo. Inténtalo de nuevo.';
      const errorMessage: Message = {
        role: 'assistant',
        content: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-black border-2 border-purple-500/50 rounded-2xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={coachImages[coachType]}
                alt={coachNames[coachType]}
                className="w-16 h-16 rounded-full bg-purple-600/20 object-cover border-2 border-purple-500 shadow-lg animate-pulse-glow"
                style={{ color: '#9333EA' }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{coachNames[coachType]}</h2>
              <p className="text-sm text-purple-300 flex items-center gap-1">
                <Sparkles size={14} className="animate-pulse" />
                Tu asistente especializado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all hover:scale-110"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                    : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-purple-500/20'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-4 rounded-2xl flex items-center gap-2 border border-purple-500/20">
                <Sparkles className="animate-spin text-purple-400" size={20} />
                <span>Pensando</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-black/50 text-white border-2 border-purple-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
