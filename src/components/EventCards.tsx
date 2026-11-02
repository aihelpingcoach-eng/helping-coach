import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Users, Heart, Zap, CloudSnow, X } from 'lucide-react';
import { EventCard, CardType } from '../types/advancedSystems';
import { supabase } from '../lib/supabase';
import { useXP } from '../hooks/useXP';
import EmptyState from './EmptyState';
import Modal from './Modal';

const CARD_XP: Record<CardType, number> = {
  improvement:      40,
  streak:           60,
  decline:          30,
  tactical_conflict: 25,
  chemistry:        35,
  medical_alert:    20,
  demotivated:      25,
};

const CARD_ICONS: Record<CardType, typeof AlertCircle> = {
  improvement: TrendingUp,
  decline: TrendingDown,
  tactical_conflict: AlertCircle,
  chemistry: Users,
  medical_alert: Heart,
  streak: Zap,
  demotivated: CloudSnow,
};

// Un solo acento por tipo, sobre la misma tarjeta oscura que el resto de Avanzado
const CARD_ACCENTS: Record<CardType, string> = {
  improvement: 'bg-green-500/15 text-green-300',
  decline: 'bg-orange-500/15 text-orange-300',
  tactical_conflict: 'bg-yellow-500/15 text-yellow-300',
  chemistry: 'bg-cyan-500/15 text-cyan-300',
  medical_alert: 'bg-red-500/15 text-red-300',
  streak: 'bg-yellow-500/15 text-yellow-300',
  demotivated: 'bg-slate-500/20 text-slate-300',
};

/** Una tarjeta por tipo y título (la más reciente): evita mostrar avisos repetidos. */
function uniqueCards(cards: EventCard[]) {
  const seen = new Set<string>();
  return cards.filter(card => {
    const key = `${card.card_type}|${card.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

interface EventCardsProps {
  coachId: string;
  onCardResolved?: () => void;
}

export default function EventCards({ coachId, onCardResolved }: EventCardsProps) {
  const [cards, setCards] = useState<EventCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<EventCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const { giveCustomXP } = useXP();

  useEffect(() => {
    loadCards();
    // loadCards no está memoizada; solo debe recargar cuando cambia coachId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setCards(uniqueCards(data || []));
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveCard = async (card: EventCard, accept = true) => {
    try {
      // Resuelve también las copias repetidas que pudiera haber del mismo aviso
      const { error } = await supabase
        .from('event_cards')
        .update({ is_resolved: true })
        .eq('coach_id', coachId)
        .eq('card_type', card.card_type)
        .eq('title', card.title)
        .eq('is_resolved', false);

      if (error) throw error;

      if (accept) {
        // Antes se daba siempre el XP genérico de evaluar jugador (10) aunque
        // la tarjeta anunciaba otra cantidad: ahora se da lo anunciado.
        const xp = CARD_XP[card.card_type] ?? 20;
        await giveCustomXP(xp);
        setXpGained(xp);
        setTimeout(() => setXpGained(null), 2500);
      }

      setCards(cards.filter(c => c.id !== card.id));
      setSelectedCard(null);
      onCardResolved?.();
    } catch (error) {
      console.error('Error resolving card:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map(i => (
          <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const selectedXP = selectedCard ? CARD_XP[selectedCard.card_type] ?? 20 : 0;

  return (
    <>
      {xpGained !== null && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-full shadow-lg animate-bounce text-sm">
          +{xpGained} XP ⚡
        </div>
      )}

      {cards.length === 0 ? (
        <EmptyState variant="generic" title="No hay eventos pendientes" />
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {cards.map(card => {
            const Icon = CARD_ICONS[card.card_type] ?? AlertCircle;
            return (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCard(card)}
                  className="w-full text-left flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <span className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${CARD_ACCENTS[card.card_type]}`}>
                    <Icon size={20} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-white leading-snug">{card.title}</span>
                    <span className="block text-xs text-gray-400 mt-0.5 line-clamp-2">{card.narrative}</span>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-yellow-300">
                      <Zap size={11} />+{CARD_XP[card.card_type] ?? 20} XP
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedCard && (
        <Modal
          onClose={() => setSelectedCard(null)}
          aria-label={selectedCard.title}
          contentClassName="w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-6 relative"
        >
          <button
            type="button"
            onClick={() => setSelectedCard(null)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3 mb-4 pr-10">
            <span className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center ${CARD_ACCENTS[selectedCard.card_type]}`}>
              {(() => {
                const Icon = CARD_ICONS[selectedCard.card_type] ?? AlertCircle;
                return <Icon size={22} />;
              })()}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">{selectedCard.title}</h2>
          </div>

          <div className="space-y-3 text-white">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Situación</h3>
              <p className="text-sm leading-relaxed text-gray-200">{selectedCard.narrative}</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Efecto</h3>
              <p className="text-sm font-medium">{selectedCard.effect}</p>
            </div>

            <p className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-300">
              <Zap size={14} className="flex-shrink-0" />
              {selectedCard.requires_decision
                ? `Aceptar: +${selectedXP} XP · Rechazar: sin recompensa`
                : `+${selectedXP} XP al confirmar`}
            </p>

            {selectedCard.requires_decision ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => resolveCard(selectedCard, true)}
                  className="bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => resolveCard(selectedCard, false)}
                  className="bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/15 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => resolveCard(selectedCard, true)}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Entendido
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
