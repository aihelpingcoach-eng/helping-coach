import { useState } from 'react';
import { ChevronRight, Shield } from 'lucide-react';
import logoImg from '../assets/logo_new.png';
import { useXP } from '../hooks/useXP';

interface OnboardingData {
  team_name: string;
  coach_level: string;
  coaching_style: string;
  team_objective: string;
}

interface Props {
  coachName: string;
  onComplete: (data: Partial<OnboardingData>) => Promise<void>;
}

const LEVELS = ['Amateur', 'Semi-profesional', 'Profesional', 'Élite'];
const STYLES = ['Defensivo', 'Ofensivo', 'Posesión', 'Contraataque', 'Equilibrado'];
const OBJECTIVES = ['Desarrollo de jóvenes', 'Ganar partidos', 'Equilibrio'];

export default function OnboardingWizard({ coachName, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [coachLevel, setCoachLevel] = useState('Amateur');
  const [coachingStyle, setCoachingStyle] = useState('Equilibrado');
  const [teamObjective, setTeamObjective] = useState('Equilibrio');
  const [saving, setSaving] = useState(false);
  const { giveXP } = useXP();

  const handleFinish = async () => {
    setSaving(true);
    await onComplete({
      team_name: teamName.trim() || 'Mi Equipo',
      coach_level: coachLevel,
      coaching_style: coachingStyle,
      team_objective: teamObjective,
    });
    await giveXP('COMPLETE_PROFILE');
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-6">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <img src={logoImg} alt="Helpin Coach" className="w-16 h-16 object-contain mb-4" />

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-purple-500 w-10' : 'bg-gray-700 w-6'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="w-full space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white">¡Hola, {coachName}!</h2>
              <p className="text-gray-400 text-sm mt-1">Cuéntanos sobre tu equipo</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Nombre del equipo</label>
              <input
                type="text"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                placeholder="Ej: Sporting Club"
                autoFocus
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 placeholder-gray-600 text-base"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Tu nivel como entrenador</label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setCoachLevel(level)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      coachLevel === level
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Siguiente <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full space-y-5 animate-[fadeIn_0.3s_ease]">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white">Tu filosofía</h2>
              <p className="text-gray-400 text-sm mt-1">La IA se adaptará a tu estilo</p>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Estilo de juego</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setCoachingStyle(style)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      coachingStyle === style
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Objetivo principal</label>
              <div className="flex flex-col gap-2">
                {OBJECTIVES.map(obj => (
                  <button
                    key={obj}
                    onClick={() => setTeamObjective(obj)}
                    className={`py-2.5 px-4 rounded-xl border text-sm font-semibold text-left transition-all ${
                      teamObjective === obj
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:border-gray-500 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                <Shield size={16} />
                {saving ? 'Guardando...' : '¡Empezar!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
