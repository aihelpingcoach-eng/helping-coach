import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LEVELS, getTierForLevel, getLevelProgress, Level } from '../constants/levels';
import { GEM_IMAGES } from '../assets/gems';

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onClose: () => void;
}

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_CFG = {
  1: { glow: '#94a3b8', bg: 'rgba(71,85,105,0.30)',  label: 'Aluminio', labelIcon: '🪨', textCls: 'text-slate-300',   ringCls: 'border-slate-400/50',   haptics: [80] },
  2: { glow: '#f97316', bg: 'rgba(249,115,22,0.22)', label: 'Hierro',   labelIcon: '⚒️', textCls: 'text-orange-400', ringCls: 'border-orange-500/60',  haptics: [120, 80, 120] },
  3: { glow: '#fbbf24', bg: 'rgba(251,191,36,0.22)', label: 'Oro',      labelIcon: '🥇', textCls: 'text-yellow-300', ringCls: 'border-yellow-400/60',  haptics: [100, 60, 200] },
  4: { glow: '#bae6fd', bg: 'rgba(186,230,253,0.18)',label: 'Platino',  labelIcon: '💠', textCls: 'text-sky-200',    ringCls: 'border-sky-300/50',     haptics: [150, 80, 150, 80, 200] },
  5: { glow: '#e0f2fe', bg: 'rgba(224,242,254,0.22)',label: 'Diamante', labelIcon: '💎', textCls: 'text-cyan-200',   ringCls: 'border-cyan-300/60',    haptics: [200, 100, 200, 100, 400] },
  6: { glow: '#ef4444', bg: 'rgba(220,38,38,0.28)',  label: 'Rubí',     labelIcon: '♦️', textCls: 'text-red-300',   ringCls: 'border-red-500/60',     haptics: [200, 80, 300, 80, 200] },
  7: { glow: '#10b981', bg: 'rgba(16,185,129,0.22)', label: 'Esmeralda',labelIcon: '🟢', textCls: 'text-emerald-300',ringCls: 'border-emerald-400/60', haptics: [100, 60, 200, 60, 300] },
  8: { glow: '#60a5fa', bg: 'rgba(59,130,246,0.28)', label: 'Zafiro',   labelIcon: '💙', textCls: 'text-blue-300',  ringCls: 'border-blue-400/60',    haptics: [100, 50, 100, 50, 300, 100, 500] },
} as const;

// ─── Web Audio synthesis ───────────────────────────────────────────────────────
function playTierSound(tier: number) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);

    const profiles: Record<number, { notes: number[]; wave: OscillatorType; dur: number; stagger: number }> = {
      1: { notes: [523, 659],                     wave: 'sine',     dur: 0.55, stagger: 0.06 },
      2: { notes: [196, 220, 175],                wave: 'sawtooth', dur: 0.60, stagger: 0.04 },
      3: { notes: [523, 659, 784, 1047],          wave: 'sine',     dur: 1.00, stagger: 0.07 },
      4: { notes: [440, 554, 659, 880],           wave: 'sine',     dur: 1.20, stagger: 0.06 },
      5: { notes: [1047, 1319, 1568, 2093],       wave: 'sine',     dur: 0.80, stagger: 0.05 },
      6: { notes: [146, 220, 293],                wave: 'sine',     dur: 1.50, stagger: 0.09 },
      7: { notes: [392, 494, 587, 698, 880],      wave: 'sine',     dur: 1.80, stagger: 0.06 },
      8: { notes: [261, 329, 392, 494, 523, 659], wave: 'sine',     dur: 2.50, stagger: 0.07 },
    };

    const p = profiles[tier] ?? profiles[1];
    p.notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = p.wave;
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * p.stagger;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.18 / p.notes.length, t0 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + p.dur);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + p.dur + 0.05);
    });
  } catch { /* AudioContext unavailable */ }
}

// ─── Confetti canvas hook ──────────────────────────────────────────────────────
function useConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const fire = useCallback((opts: confetti.Options) => {
    const fn = ref.current ? confetti.create(ref.current, { resize: true }) : confetti;
    fn(opts);
  }, []);
  return { ref, fire };
}

// ─── Gem Centerpiece — shared across all tiers ────────────────────────────────
interface GemProps {
  level: Level;
  tier: number;
  animClass: string;
  size?: 'md' | 'lg' | 'xl';
  spin?: boolean;
  heartbeat?: boolean;
  flip3d?: boolean;
}
function GemCenterpiece({ level, tier, animClass, size = 'md', spin = false, heartbeat = false, flip3d = false }: GemProps) {
  const cfg = TIER_CFG[tier as keyof typeof TIER_CFG];
  const ringSize  = size === 'xl' ? 'w-44 h-44' : size === 'lg' ? 'w-36 h-36' : 'w-28 h-28';
  const imgSize   = size === 'xl' ? 'w-36 h-36' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';
  const glowSize  = size === 'xl' ? 220 : size === 'lg' ? 180 : 140;
  const gemSrc    = GEM_IMAGES[tier as keyof typeof GEM_IMAGES] ?? GEM_IMAGES['locked'];

  const gemMotion = heartbeat ? 'animate-heartbeat' : 'animate-gem-levitate';

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* Radial glow */}
      <div className="absolute pointer-events-none"
        style={{
          width: glowSize, height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cfg.glow}55 0%, ${cfg.glow}22 50%, transparent 75%)`,
          animation: 'glow-breathe 2s ease-in-out infinite',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />

      {/* Outer spinning ring */}
      <div className={`absolute rounded-full border ${cfg.ringCls} pointer-events-none animate-ring-spin`}
        style={{ width: glowSize * 0.82, height: glowSize * 0.82, top: '50%', left: '50%', marginLeft: -(glowSize * 0.82) / 2, marginTop: -(glowSize * 0.82) / 2 }} />

      {/* Inner counter-spinning ring (tier 3+) */}
      {tier >= 3 && (
        <div className={`absolute rounded-full border-2 ${cfg.ringCls} pointer-events-none animate-ring-spin-reverse opacity-60`}
          style={{ width: glowSize * 0.65, height: glowSize * 0.65, top: '50%', left: '50%', marginLeft: -(glowSize * 0.65) / 2, marginTop: -(glowSize * 0.65) / 2 }} />
      )}

      {/* Badge circle */}
      <div style={flip3d ? { perspective: '700px' } : {}}>
        <div className={`${ringSize} rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center shadow-2xl border-4 border-white/20 ${animClass} ${gemMotion}`}
          style={{ boxShadow: `0 0 40px ${cfg.glow}55, 0 8px 32px rgba(0,0,0,0.6)` }}>
          <img src={gemSrc} alt={level.name} className={`${imgSize} object-contain drop-shadow-2xl`} style={{ filter: `drop-shadow(0 0 12px ${cfg.glow}99)` }} />
        </div>
      </div>

      {/* Level name + message */}
      <div className="text-center" style={{ animation: 'msg-in 0.5s ease-out 0.8s both' }}>
        <p className="text-white font-black text-2xl tracking-wide">{level.name}</p>
        <p className="text-white/55 text-xs mt-1 max-w-[240px] leading-relaxed">{level.msg}</p>
      </div>
    </div>
  );
}

// ─── Shared text header ────────────────────────────────────────────────────────
function TierHeader({ tier, level }: { tier: number; level: Level }) {
  const cfg = TIER_CFG[tier as keyof typeof TIER_CFG];
  const shadow = '0 2px 12px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.7)';
  return (
    <div className="flex flex-col items-center gap-1" style={{ position: 'relative', zIndex: 20 }}>
      <p className={`${cfg.textCls} text-[10px] font-black tracking-[0.25em] uppercase`}
        style={{ animation: 'tier-label-in 0.45s ease-out both', textShadow: shadow }}>
        {cfg.labelIcon} {cfg.label}
      </p>
      <p className="text-white font-black tracking-widest"
        style={{ fontSize: '52px', lineHeight: 1, animation: 'level-num-in 0.55s ease-out 0.15s both', textShadow: shadow }}>
        {level.level}
      </p>
    </div>
  );
}

// ─── XP bar ───────────────────────────────────────────────────────────────────
function XPBar({ level, tier, delay = 800 }: { level: Level; tier: number; delay?: number }) {
  const { progressPercent } = getLevelProgress(0); // will be overridden by inline style
  const cfg = TIER_CFG[tier as keyof typeof TIER_CFG];
  const pct = Math.min(100, ((level.level - 1) / 19) * 100);
  return (
    <div className="w-64" style={{ animation: `msg-in 0.4s ease-out ${delay}ms both` }}>
      <div className="flex justify-between text-[10px] mb-1.5">
        <span className={`${cfg.textCls} font-bold`}>Progreso total</span>
        <span className="text-white/50">{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
        style={{ animation: `xp-bar-track-in 0.4s ease-out ${delay + 100}ms both`, transformOrigin: 'left' }}>
        <div className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${cfg.glow}99, ${cfg.glow})`,
            ['--xp-pct' as string]: pct + '%',
            animation: `xp-fill 1.2s ease-out ${delay + 300}ms both`,
            width: 0,
          } as React.CSSProperties} />
      </div>
    </div>
  );
}

// ─── Backdrop (blur + tinted radial gradient) ──────────────────────────────────
function Backdrop({ tier }: { tier: number }) {
  const cfg = TIER_CFG[tier as keyof typeof TIER_CFG];
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 150,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: `radial-gradient(ellipse at 50% 45%, ${cfg.bg} 0%, rgba(0,0,0,0.93) 70%)`,
      animation: 'backdrop-enter 0.35s ease-out both',
    }} />
  );
}

// ─── Video Tier — componente genérico para todos los tiers con video ──────────
const TIER_VIDEO = {
  1: { src: '/videos/tier1_aluminium.mp4', label: '✦ Aluminio ✦',  labelColor: '#94a3b8', numGlow: '#94a3b899', nameColor: '#cbd5e1', msgColor: 'rgba(203,213,225,0.75)', haptics: [80] },
  2: { src: '/videos/tier2_iron.mp4',      label: '✦ Hierro ✦',    labelColor: '#fb923c', numGlow: '#f9731699', nameColor: '#fed7aa', msgColor: 'rgba(253,186,116,0.75)',  haptics: [120, 80, 120] },
  3: { src: '/videos/tier3_gold.mp4',      label: '✦ Oro ✦',       labelColor: '#fbbf24', numGlow: '#fbbf2499', nameColor: '#fef3c7', msgColor: 'rgba(253,230,138,0.75)',  haptics: [100, 60, 200] },
  4: { src: '/videos/tier4_platinum.mp4',  label: '✦ Platino ✦',   labelColor: '#bae6fd', numGlow: '#bae6fd99', nameColor: '#e0f2fe', msgColor: 'rgba(186,230,253,0.75)',  haptics: [150, 80, 150, 80, 200] },
  5: { src: '/videos/tier5_diamond.mp4',   label: '✦ Diamante ✦',  labelColor: '#a5f3fc', numGlow: '#ffffff99', nameColor: '#cffafe', msgColor: 'rgba(207,250,254,0.75)',  haptics: [200, 100, 200, 100, 400] },
  6: { src: '/videos/tier6_ruby.mp4',      label: '✦ Rubí ✦',      labelColor: '#f87171', numGlow: '#ef444499', nameColor: '#fecaca', msgColor: 'rgba(252,165,165,0.75)',  haptics: [200, 80, 300, 80, 200] },
  7: { src: '/videos/tier7_emerald.mp4',   label: '✦ Esmeralda ✦', labelColor: '#34d399', numGlow: '#10b98199', nameColor: '#a7f3d0', msgColor: 'rgba(167,243,208,0.75)',  haptics: [100, 60, 200, 60, 300] },
} as const;

function VideoTier({ tierNum, level }: { tierNum: 1|2|3|4|5|6|7; level: Level }) {
  const cfg = TIER_VIDEO[tierNum];
  const shadow = '0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8)';

  useEffect(() => {
    navigator.vibrate?.(cfg.haptics as number[]);
    playTierSound(tierNum);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <video autoPlay muted playsInline loop
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: 1 }}>
        <source src={cfg.src} type="video/mp4" />
      </video>

      <div className="relative flex flex-col items-center gap-4" style={{ zIndex: 2 }}>
        <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: cfg.labelColor, textShadow: shadow, animation: 'tier-label-in 0.5s ease-out both' }}>
          {cfg.label}
        </p>
        <p style={{ fontSize: '80px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em',
          color: '#ffffff', textShadow: `0 0 60px ${cfg.numGlow}, 0 4px 24px rgba(0,0,0,0.9)`,
          animation: 'level-num-in 0.6s ease-out 0.2s both' }}>
          {level.level}
        </p>
        <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '0.08em',
          color: cfg.nameColor, textShadow: shadow, animation: 'msg-in 0.5s ease-out 0.5s both' }}>
          {level.name.toUpperCase()}
        </p>
        <p style={{ fontSize: '13px', fontWeight: 500, color: cfg.msgColor,
          textShadow: '0 2px 8px rgba(0,0,0,0.9)', maxWidth: '260px',
          textAlign: 'center', lineHeight: 1.5, animation: 'msg-in 0.5s ease-out 0.8s both' }}>
          {level.msg}
        </p>
        <XPBar level={level} tier={tierNum} delay={1200} />
      </div>
    </div>
  );
}

function Tier1({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={1} level={level} />; }
function Tier2({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={2} level={level} />; }
function Tier3({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={3} level={level} />; }
function Tier4({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={4} level={level} />; }
function Tier5({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={5} level={level} />; }
function Tier6({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={6} level={level} />; }
function Tier7({ level }: { level: Level; onClose: () => void }) { return <VideoTier tierNum={7} level={level} />; }

// ─── TIER 8 — Zafiro (19-20 · video) ────────────────────────────────────────────
function Tier8({ level, onClose }: { level: Level; onClose: () => void }) {
  useEffect(() => {
    navigator.vibrate?.([100, 50, 100, 50, 300, 100, 500]);
    playTierSound(8);
  }, []);

  const shadow = '0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8)';

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Video background — true full screen */}
      <video
        autoPlay muted playsInline loop
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          objectFit: 'cover', zIndex: 1,
        }}
      >
        <source src="/videos/tier8_sapphire.mp4" type="video/mp4" />
      </video>

      {/* Text overlay */}
      <div className="relative flex flex-col items-center gap-4" style={{ zIndex: 2 }}>

        {/* Tier label */}
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#93c5fd',
          textShadow: shadow,
          animation: 'tier-label-in 0.5s ease-out both',
        }}>
          ✦ Zafiro ✦
        </p>

        {/* Level number */}
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '80px',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          textShadow: '0 0 60px #60a5fa99, 0 4px 24px rgba(0,0,0,0.9)',
          animation: 'level-num-in 0.6s ease-out 0.2s both',
        }}>
          {level.level}
        </p>

        {/* Level name */}
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: '#e0f2fe',
          textShadow: shadow,
          animation: 'msg-in 0.5s ease-out 0.5s both',
        }}>
          {level.name.toUpperCase()}
        </p>

        {/* Message */}
        <p style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(186,230,253,0.75)',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          maxWidth: '260px',
          textAlign: 'center',
          lineHeight: 1.5,
          animation: 'msg-in 0.5s ease-out 0.8s both',
        }}>
          {level.msg}
        </p>

        <XPBar level={level} tier={8} delay={2800} />
      </div>
    </div>
  );
}

// ─── Root modal ───────────────────────────────────────────────────────────────
export default function LevelUpModal({ visible, newLevel, onClose }: LevelUpModalProps) {
  if (!visible || newLevel < 2 || newLevel > 20) return null;

  const level      = LEVELS[newLevel - 1];
  const tier       = getTierForLevel(newLevel);
  const isBlocking = tier >= 7;

  // Portal to document.body bypasses any overflow:hidden/auto ancestor
  return createPortal(
    <>
      {/* Fondo negro — el video de cada tier lo cubre */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000', zIndex: 150 }} />
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Close button — always visible, top-right */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 999,
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', border: '1.5px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.85)', fontSize: '18px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            lineHeight: 1,
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div
          style={{ position: 'relative', width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          {tier === 1 && <Tier1 level={level} onClose={onClose} />}
          {tier === 2 && <Tier2 level={level} onClose={onClose} />}
          {tier === 3 && <Tier3 level={level} onClose={onClose} />}
          {tier === 4 && <Tier4 level={level} onClose={onClose} />}
          {tier === 5 && <Tier5 level={level} onClose={onClose} />}
          {tier === 6 && <Tier6 level={level} onClose={onClose} />}
          {tier === 7 && <Tier7 level={level} onClose={onClose} />}
          {tier === 8 && <Tier8 level={level} onClose={onClose} />}
        </div>
      </div>
    </>,
    document.body
  );
}
