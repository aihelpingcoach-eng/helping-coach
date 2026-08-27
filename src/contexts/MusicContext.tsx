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
  const volumeRef = useRef(0.4);
  const gainRef = useRef<GainNode | null>(null);
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
    volumeRef.current = volume;
    // El oído humano percibe el volumen de forma logarítmica, no lineal:
    // moviendo el slider del 40% al 100% con audio.volume directo apenas
    // se nota. Se eleva al cuadrado para que el cambio percibido sea
    // proporcional a la posición del slider.
    const level = volume ** 2;
    if (gainRef.current) {
      gainRef.current.gain.value = level;
    } else if (audioRef.current) {
      // Fallback antes de que exista el grafo de Web Audio (ver abajo).
      audioRef.current.volume = level;
    }
  }, [volume]);

  // Intenta reproducir al montar; si el navegador bloquea el autoplay,
  // arranca en la primera interacción del usuario en cualquier parte de la app.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // iOS Safari ignora por completo `audio.volume` (siempre sale al 100%
    // real pase lo que pase el slider) — es una limitación conocida de
    // WebKit, no un bug nuestro. Se evita enrutando el audio a través de la
    // Web Audio API (GainNode), que sí respeta el volumen en todas las
    // plataformas. Debe crearse tras un gesto del usuario por las políticas
    // de autoplay.
    const setupAudioGraph = () => {
      if (gainRef.current) return;
      try {
        const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextCtor();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = volumeRef.current ** 2;
        source.connect(gain).connect(ctx.destination);
        gainRef.current = gain;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      } catch {
        // Si falla (navegador sin soporte, CORS, etc.) se sigue usando
        // audio.volume como fallback silencioso.
      }
    };

    const tryPlay = () => {
      setupAudioGraph();
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
