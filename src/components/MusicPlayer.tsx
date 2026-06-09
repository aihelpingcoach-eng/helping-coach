import { useRef, useState, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intentar autoplay; si el navegador lo bloquea, arrancar al primer toque del usuario
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay bloqueado — arranca en el primer click del usuario
        const startOnInteraction = () => {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
          document.removeEventListener('click', startOnInteraction);
          document.removeEventListener('touchstart', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
      });
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src="/music/background.mp3" />
      <button
        onClick={toggle}
        title={isPlaying ? 'Pausar música' : 'Reproducir música'}
        className={`fixed bottom-20 left-4 z-40 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border ${
          isPlaying
            ? 'bg-orange-600 border-orange-400/50 text-white'
            : 'bg-gray-800/90 border-white/10 text-gray-300 hover:text-white'
        }`}
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} />}
      </button>
    </>
  );
}
