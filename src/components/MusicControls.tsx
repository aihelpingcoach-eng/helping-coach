import { Music, VolumeX, Volume1, Volume2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

export default function MusicControls() {
  const { enabled, volume, available, toggle, setVolume } = useMusic();

  if (!available) return null;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-4 sm:p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music size={18} className="text-purple-400" />
          <h3 className="text-base font-bold text-white">Música de fondo</h3>
        </div>
        <button
          onClick={toggle}
          role="switch"
          aria-checked={enabled}
          className={`relative w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className={`flex items-center gap-3 transition-opacity ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <VolumeIcon size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={!enabled}
          className="flex-1 accent-purple-500"
        />
        <span className="text-gray-400 text-xs w-9 text-right">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}
