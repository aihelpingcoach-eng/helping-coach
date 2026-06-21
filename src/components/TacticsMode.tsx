import { useState, useEffect, useRef } from 'react';
import { Plus, MessageCircle, Sparkles, Lightbulb, X } from 'lucide-react';
import { FORMATIONS, FormationType, FormationPlayer, Player } from '../constants/playstyles';
import { supabase } from '../lib/supabase';
import PlayerHexagon from './PlayerHexagon';
import AddPlayerModal from './AddPlayerModal';
import CoachChat from './CoachChat';
import TacticalRecommendations from './TacticalRecommendations';
import SynergyLines from './SynergyLines';
import PlayerProfile from './PlayerProfile';
import FormationAdvisor from './FormationAdvisor';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useXP } from '../hooks/useXP';
import { analyzeTeamSynergies } from '../utils/ai';
import AdGate from './AdGate';
import { useAdGate } from '../hooks/useAdGate';
import LevelUpModal from './LevelUpModal';

interface Synergy {
  player_a: string;
  player_b: string;
  color: 'red' | 'yellow' | 'orange' | 'green' | 'blue' | 'purple';
  reason: string;
}

export default function TacticsMode() {
  const [selectedFormation, setSelectedFormation] = useState<FormationType>('4-3-3');
  const [formationPlayers, setFormationPlayers] = useState<FormationPlayer[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [synergies, setSynergies] = useState<Synergy[]>([]);
  const [isAnalyzingSynergies, setIsAnalyzingSynergies] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showFormationAdvisor, setShowFormationAdvisor] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const synergiesCacheRef = useRef<{ key: string; synergies: Synergy[] } | null>(null);
  const { profile: coachProfile } = useCoachProfile();
  const { giveXP, showLevelUpModal, newLevel, closeLevelUpModal } = useXP();
  const { withAdGate, showAdGate, featureName, handleAdComplete, handleAdCancel } = useAdGate();

  useEffect(() => {
    loadFormationPlayers();
    loadAllPlayers();
  }, [selectedFormation]);

  const loadFormationPlayers = async () => {
    const { data, error } = await supabase
      .from('formation_players')
      .select('*, player:players(*), formation:formations(formation_type)')
      .order('position_index');

    if (!error && data) {
      const filtered = (data as any[]).filter(
        fp => fp.formation?.formation_type === selectedFormation
      );
      setFormationPlayers(filtered as FormationPlayer[]);
    }
  };

  const loadAllPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPlayers(data);
    }
  };

  const handleHexagonClick = (positionIndex: number) => {
    setSelectedPosition(positionIndex);
    setShowAddModal(true);
  };

  const handlePlayerAdded = async (player: Player) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: formationRows, error: fErr } = await supabase
      .from('formations')
      .select('*')
      .eq('formation_type', selectedFormation)
      .eq('user_id', user.id)
      .limit(1);

    const formation = formationRows?.[0] ?? null;

    if (!formation) {
      const { data: newFormation, error: nfErr } = await supabase
        .from('formations')
        .insert({
          name: selectedFormation,
          formation_type: selectedFormation,
          is_active: true,
          user_id: user.id,
        })
        .select()
        .single();

      if (newFormation && selectedPosition !== null) {
        const { error: fpErr } = await supabase
          .from('formation_players')
          .insert({
            formation_id: newFormation.id,
            player_id: player.id,
            position_index: selectedPosition,
            user_id: user.id,
          });
      }
    } else if (selectedPosition !== null) {
      const existing = formationPlayers.find(fp => fp.position_index === selectedPosition);

      if (existing) {
        await supabase
          .from('formation_players')
          .update({ player_id: player.id })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('formation_players')
          .insert({
            formation_id: formation.id,
            player_id: player.id,
            position_index: selectedPosition,
            user_id: user.id,
          });
      }
    }

    await loadFormationPlayers();
    await loadAllPlayers();

    await giveXP('ADD_PLAYER');

    setShowAddModal(false);
    setSelectedPosition(null);
  };

  const positions = FORMATIONS[selectedFormation];
  const playersInFormation = formationPlayers.map(fp => fp.player).filter(Boolean) as Player[];

  const analyzeSynergies = async () => {
    if (playersInFormation.length < 2) {
      return;
    }

    const playersWithPositions = formationPlayers
      .filter(fp => fp.player)
      .map(fp => {
        const pos = positions[fp.position_index] ?? { x: 50, y: 50 };
        return {
          name: (fp.player as Player).name,
          position: `Pos ${fp.position_index}`,
          playstyle: (fp.player as Player).playstyle || 'Sin PlayStyle',
          position_index: fp.position_index,
          x: pos.x,
          y: pos.y,
        };
      });

    // El mismo equipo+formación siempre debe dar la misma sinergia.
    // Si ya la calculamos antes, reusamos el resultado en vez de volver a llamar a la IA
    // (cuyo motor de inferencia no garantiza determinismo perfecto incluso con temperature 0).
    const cacheKey = `${selectedFormation}|${playersWithPositions
      .map(p => `${p.position_index}:${p.name}:${p.playstyle}`)
      .sort()
      .join(',')}`;

    if (synergiesCacheRef.current?.key === cacheKey) {
      setSynergies(synergiesCacheRef.current.synergies);
      return;
    }

    setIsAnalyzingSynergies(true);
    try {
      const result = await analyzeTeamSynergies(selectedFormation, playersWithPositions);
      const newSynergies = result.synergies || [];
      synergiesCacheRef.current = { key: cacheKey, synergies: newSynergies };
      setSynergies(newSynergies);

      await giveXP('CONSULT_AI');
    } catch (error) {
      console.error('Error analyzing synergies:', error);
    } finally {
      setIsAnalyzingSynergies(false);
    }
  };

  const playerPositions = new Map<string, { x: number; y: number }>();
  formationPlayers.forEach((fp) => {
    if (fp.player) {
      const pos = positions[fp.position_index];
      if (pos) {
        playerPositions.set((fp.player as Player).name, pos);
      }
    }
  });

  return (
    <div className="relative w-full h-full">
      <div className="h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4 flex-shrink-0">
          <TacticalRecommendations
            formation={selectedFormation}
            players={playersInFormation}
          />

          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value as FormationType)}
            className="bg-black/70 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-sm sm:text-lg touch-manipulation h-[44px] sm:h-[52px]"
          >
            {Object.keys(FORMATIONS).map((formation) => (
              <option key={formation} value={formation}>
                {formation}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 active:bg-purple-700 text-white p-2 sm:p-3 rounded-full transition-all active:scale-95 shadow-lg touch-manipulation h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] flex items-center justify-center"
            title="Añadir jugador"
          >
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => withAdGate(analyzeSynergies, 'análisis de sinergias')}
            disabled={isAnalyzingSynergies || playersInFormation.length < 2}
            className="bg-green-600 active:bg-green-700 text-white p-2 sm:p-3 rounded-full transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] flex items-center justify-center"
            title="Analizar sinergias con IA"
          >
            <Sparkles size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => setShowFormationAdvisor(prev => !prev)}
            className={`${showFormationAdvisor ? 'bg-blue-700' : 'bg-blue-600'} active:bg-blue-700 text-white p-2 sm:p-3 rounded-full transition-all active:scale-95 shadow-lg touch-manipulation h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] flex items-center justify-center`}
            title="Asesor de formaciones"
          >
            <Lightbulb size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {showFormationAdvisor && (
          <div className="mx-2 mb-2 sm:mb-4 relative">
            <button
              onClick={() => setShowFormationAdvisor(false)}
              className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <FormationAdvisor
              currentFormation={selectedFormation}
              players={playersInFormation}
              onFormationSelect={(formation) => {
                setSelectedFormation(formation as FormationType);
                setShowFormationAdvisor(false);
              }}
            />
          </div>
        )}

        <div className="flex justify-center items-center flex-1 min-h-0 px-2" data-tutorial="tutorial-field">
          <div ref={fieldRef} className="relative w-full max-w-2xl h-full">
            {fieldRef.current && synergies.length > 0 && (
              <SynergyLines
                synergies={synergies}
                playerPositions={playerPositions}
                containerWidth={fieldRef.current.offsetWidth}
                containerHeight={fieldRef.current.offsetHeight}
              />
            )}
            {positions.map((pos, index) => {
              const formationPlayer = formationPlayers.find(fp => fp.position_index === index);
              const player = formationPlayer?.player as Player | undefined;

              return (
                <PlayerHexagon
                  key={index}
                  position={pos}
                  player={player}
                  onClick={() => handleHexagonClick(index)}
                  onDoubleClick={() => player && setSelectedPlayer(player)}
                  allPlayers={playersInFormation}
                />
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowCoachChat(true)}
        className="fixed bottom-[4.5rem] sm:bottom-24 right-3 sm:right-6 z-20 bg-purple-600 active:bg-purple-700 text-white p-2.5 sm:p-4 rounded-full transition-all active:scale-95 shadow-2xl touch-manipulation"
        title="Helpin Coach"
        data-tutorial="tutorial-coach"
      >
        <MessageCircle size={24} className="sm:w-8 sm:h-8" />
      </button>

      {showAddModal && (
        <AddPlayerModal
          onClose={() => {
            setShowAddModal(false);
            setSelectedPosition(null);
          }}
          onPlayerAdded={handlePlayerAdded}
          existingPlayers={players}
        />
      )}

      {showCoachChat && (
        <CoachChat
          coachType="helpin"
          onClose={() => setShowCoachChat(false)}
          context={{
            formation: selectedFormation,
            players: playersInFormation,
            coachProfile,
          }}
          onXPEarned={() => giveXP('CONSULT_AI')}
        />
      )}

      {showLevelUpModal && (
        <LevelUpModal visible={showLevelUpModal} newLevel={newLevel} onClose={closeLevelUpModal} />
      )}

      {showAdGate && (
        <AdGate
          featureName={featureName}
          onComplete={handleAdComplete}
          onCancel={handleAdCancel}
        />
      )}

      {selectedPlayer && (
        <PlayerProfile
          player={selectedPlayer}
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          allPlayers={players}
        />
      )}
    </div>
  );
}
