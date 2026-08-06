import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface MusicContextType {
  enabled: boolean;
  volume: number;
  available: boolean;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const STORAGE_KEY_ENABLED = 'helpingcoach_music_enabled';
const STORAGE_KEY_VOLUME = 'helpingcoach_music_volume';

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabledRef = useRef(true);
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY_ENABLED) !== 'false');
  const [volume, setVolumeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_VOLUME);
    return stored ? Number(stored) : 0.4;
  });
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Intenta reproducir al montar; si el navegador bloquea el autoplay,
  // arranca en la primera interacción del usuario en cualquier parte de la app.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      if (enabledRef.current) audio.play().catch(() => {});
    };

    tryPlay();

    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });

    return () => {
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, []);

  // Reacciona al toggle explícito del usuario.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [enabled, available]);

  const toggle = () => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_ENABLED, String(next));
      return next;
    });
  };

  const setVolume = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    localStorage.setItem(STORAGE_KEY_VOLUME, String(clamped));
  };

  return (
    <MusicContext.Provider value={{ enabled, volume, available, toggle, setVolume }}>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/background.mp3"
        onError={() => setAvailable(false)}
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic debe usarse dentro de MusicProvider');
  return ctx;
}
