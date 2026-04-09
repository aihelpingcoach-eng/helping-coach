import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Users, Heart, Zap, CloudSnow, X } from 'lucide-react';
import { EventCard, CardType } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';

interface EventCardsProps {
  coachId: string;
  onCardResolved?: () => void;
}

export default function EventCards({ coachId, onCardResolved }: EventCardsProps) {
  const [cards, setCards] = useState<EventCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<EventCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, [coachId]);

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('event_cards')
        .select('*')
        .eq('coach_id', coachId)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('event_cards')
        .update({ is_resolved: true })
        .eq('id', cardId);

      if (error) throw error;
      setCards(cards.filter(card => card.id !== cardId));
      setSelectedCard(null);
      onCardResolved?.();
    } catch (error) {
      console.error('Error resolving card:', error);
    }
  };

  const getCardIcon = (type: CardType) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp size={24} />;
      case 'decline':
        return <TrendingDown size={24} />;
      case 'tactical_conflict':
        return <AlertCircle size={24} />;
      case 'chemistry':
        return <Users size={24} />;
      case 'medical_alert':
        return <Heart size={24} />;
      case 'streak':
        return <Zap size={24} />;
      case 'demotivated':
        return <CloudSnow size={24} />;
      default:
        return <AlertCircle size={24} />;
    }
  };

  const getCardColors = (type: CardType) => {
    switch (type) {
      case 'improvement':
        return 'from-green-600 to-emerald-700';
      case 'decline':
        return 'from-orange-600 to-red-700';
      case 'tactical_conflict':
        return 'from-yellow-600 to-orange-600';
      case 'chemistry':
        return 'from-blue-600 to-cyan-600';
      case 'medical_alert':
        return 'from-red-600 to-pink-600';
      case 'streak':
        return 'from-yellow-500 to-orange-500';
      case 'demotivated':
        return 'from-gray-600 to-slate-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getCardEmoji = (type: CardType) => {
    switch (type) {
      case 'improvement':
        return '📈';
      case 'decline':
        return '📉';
      case 'tactical_conflict':
        return '🧠';
      case 'chemistry':
        return '🤝';
      case 'medical_alert':
        return '🩺';
      case 'streak':
        return '🌟';
      case 'demotivated':
        return '❄️';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-center">Cargando eventos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.length === 0 ? (
          <div className="col-span-full bg-gray-900/50 border border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-400">No hay eventos activos</p>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`bg-gradient-to-br ${getCardColors(card.card_type)} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all shadow-xl relative overflow-hidden`}
            >
              <div className="absolute top-2 right-2 text-4xl opacity-20">
                {getCardEmoji(card.card_type)}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  {getCardIcon(card.card_type)}
                  <span className="text-xs font-bold uppercase tracking-wide opacity-80">
                    Evento
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{card.narrative}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-gradient-to-br ${getCardColors(selectedCard.card_type)} rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl`}>
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{getCardEmoji(selectedCard.card_type)}</div>
              <h2 className="text-3xl font-bold text-white">{selectedCard.title}</h2>
            </div>

            <div className="space-y-4 text-white">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide opacity-70 mb-2">
                  Situación
                </h3>
                <p className="text-lg leading-relaxed">{selectedCard.narrative}</p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-sm font-bold uppercase tracking-wide opacity-70 mb-2">
                  Efecto
                </h3>
                <p className="font-medium">{selectedCard.effect}</p>
              </div>

              {selectedCard.requires_decision ? (
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => resolveCard(selectedCard.id)}
                    className="bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="bg-black/40 text-white font-bold py-3 px-6 rounded-lg hover:bg-black/60 transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => resolveCard(selectedCard.id)}
                  className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors mt-6"
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
