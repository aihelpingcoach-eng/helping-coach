import type { IllustrationType } from '../constants/training';

const O = '#F97316';
const BLK = '#0f0f0f';

// ─── Gradient / filter definitions (IDs are shared across all inline SVGs) ───
function Defs() {
  return (
    <defs>
      {/* shirt — purple top-to-bottom gradient */}
      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#b06bff" />
        <stop offset="55%"  stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      {/* shirt highlight — left edge lighter */}
      <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#e0c0ff" stopOpacity="0.35" />
        <stop offset="60%"  stopColor="#7C3AED" stopOpacity="0" />
      </linearGradient>
      {/* shorts */}
      <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#4C1D95" />
        <stop offset="100%" stopColor="#2e1065" />
      </linearGradient>
      {/* skin / head — radial highlight */}
      <radialGradient id="hg" cx="35%" cy="30%" r="65%">
        <stop offset="0%"   stopColor="#E5E7EB" />
        <stop offset="100%" stopColor="#9CA3AF" />
      </radialGradient>
      {/* limbs — skin with side shading */}
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#C4C9D0" />
        <stop offset="50%"  stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#7b8394" />
      </linearGradient>
      {/* shoes */}
      <linearGradient id="shog" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#4338ca" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      {/* bench / equipment */}
      <linearGradient id="eqg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#4B5563" />
        <stop offset="100%" stopColor="#1F2937" />
      </linearGradient>
      {/* field */}
      <linearGradient id="fldg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#1a6b38" />
        <stop offset="50%"  stopColor="#14532D" />
        <stop offset="100%" stopColor="#0a3b1e" />
      </linearGradient>
    </defs>
  );
}

// ─── Arrow between frames ─────────────────────────────────────────────────────
function Arr() {
  return (
    <g>
      <line x1="143" y1="70" x2="154" y2="70" stroke={O} strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="150,64 162,70 150,76" fill={O} />
    </g>
  );
}

// ─── Frame labels ─────────────────────────────────────────────────────────────
function Lbl({ a = 'INICIO', b = 'EJECUCIÓN' }: { a?: string; b?: string }) {
  const t = { fill: '#6B7280', fontSize: 7.5, fontFamily: 'system-ui,sans-serif', textAnchor: 'middle' as const };
  return (
    <>
      <text x="71" y="13" {...t}>{a}</text>
      <text x="229" y="13" {...t}>{b}</text>
      <line x1="148" y1="15" x2="148" y2="132" stroke="#1f1f1f" strokeWidth="1" />
    </>
  );
}

// ─── Reusable shape helpers ───────────────────────────────────────────────────

const S = (c: string, w: number) => ({ stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, fill: 'none' });

const GShadow = ({ x, g, rx = 18 }: { x: number; g: number; rx?: number }) => (
  <ellipse cx={x} cy={g} rx={rx} ry={3.5} fill="rgba(0,0,0,0.28)" />
);

const Head = ({ x, y, r = 11 }: { x: number; y: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r} fill="url(#hg)" />
);

// Muscular torso (front) with shoulder bulges
const Torso = ({ x, y, w = 38, h = 26 }: { x: number; y: number; w?: number; h?: number }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={6} fill="url(#sg)" />
    <rect x={x - w / 2} y={y} width={w} height={h} rx={6} fill="url(#sh)" />
    <ellipse cx={x - w / 2 - 4} cy={y + 7} rx={9} ry={8} fill="url(#sg)" />
    <ellipse cx={x + w / 2 + 4} cy={y + 7} rx={9} ry={8} fill="url(#sg)" />
  </g>
);

const Shorts = ({ x, y, w = 34, h = 16 }: { x: number; y: number; w?: number; h?: number }) => (
  <rect x={x - w / 2} y={y} width={w} height={h} rx={5} fill="url(#dg)" />
);

// Shoe facing right or left
const Shoe = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
  <ellipse cx={x + (flip ? -5 : 5)} cy={y} rx={14} ry={5} fill="url(#shog)" />
);

// ─── PHYSICAL FIGURE POSES ────────────────────────────────────────────────────

/** Standing upright — front view */
function FStand({ x, g = 126 }: { x: number; g?: number }) {
  return (
    <g>
      <GShadow x={x} g={g} />
      <Head x={x} y={g - 95} />
      <rect x={x - 5} y={g - 84} width={10} height={7} rx={3} fill="#9CA3AF" />
      <Torso x={x} y={g - 82} />
      {/* upper arms down */}
      <line x1={x - 27} y1={g - 74} x2={x - 28} y2={g - 57} {...S('#7C3AED', 13)} />
      <line x1={x + 27} y1={g - 74} x2={x + 28} y2={g - 57} {...S('#7C3AED', 13)} />
      {/* forearms */}
      <line x1={x - 28} y1={g - 57} x2={x - 28} y2={g - 43} {...S('#9CA3AF', 11)} />
      <line x1={x + 28} y1={g - 57} x2={x + 28} y2={g - 43} {...S('#9CA3AF', 11)} />
      <Shorts x={x} y={g - 56} />
      {/* thighs */}
      <line x1={x - 10} y1={g - 41} x2={x - 10} y2={g - 22} {...S('#9CA3AF', 14)} />
      <line x1={x + 10} y1={g - 41} x2={x + 10} y2={g - 22} {...S('#9CA3AF', 14)} />
      {/* shins */}
      <line x1={x - 10} y1={g - 22} x2={x - 10} y2={g - 7}  {...S('#C9D0D8', 12)} />
      <line x1={x + 10} y1={g - 22} x2={x + 10} y2={g - 7}  {...S('#C9D0D8', 12)} />
      <Shoe x={x - 10} y={g - 2} flip />
      <Shoe x={x + 10} y={g - 2} />
    </g>
  );
}

/** Squat bottom — wide stance */
function FSquat({ x, g = 126 }: { x: number; g?: number }) {
  return (
    <g>
      <GShadow x={x} g={g} rx={24} />
      <Head x={x} y={g - 68} />
      <rect x={x - 5} y={g - 58} width={10} height={6} rx={3} fill="#9CA3AF" />
      <Torso x={x} y={g - 57} w={36} h={22} />
      {/* arms forward */}
      <line x1={x - 23} y1={g - 47} x2={x - 45} y2={g - 50} {...S('#7C3AED', 12)} />
      <line x1={x - 45} y1={g - 50} x2={x - 53} y2={g - 47} {...S('#9CA3AF', 10)} />
      <line x1={x + 23} y1={g - 47} x2={x + 45} y2={g - 50} {...S('#7C3AED', 12)} />
      <line x1={x + 45} y1={g - 50} x2={x + 53} y2={g - 47} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 36} w={30} h={13} />
      {/* thighs diagonal */}
      <line x1={x - 10} y1={g - 36} x2={x - 31} y2={g - 19} {...S('#9CA3AF', 14)} />
      <line x1={x + 10} y1={g - 36} x2={x + 31} y2={g - 19} {...S('#9CA3AF', 14)} />
      {/* shins */}
      <line x1={x - 31} y1={g - 19} x2={x - 23} y2={g - 5} {...S('#C9D0D8', 12)} />
      <line x1={x + 31} y1={g - 19} x2={x + 23} y2={g - 5} {...S('#C9D0D8', 12)} />
      <Shoe x={x - 23} y={g} flip />
      <Shoe x={x + 23} y={g} />
    </g>
  );
}

/** Lunge — side view */
function FLunge({ x, g = 126, back = false }: { x: number; g?: number; back?: boolean }) {
  const d = back ? -1 : 1;
  return (
    <g>
      <GShadow x={x} g={g} rx={26} />
      <Head x={x - d * 4} y={g - 91} />
      <Torso x={x - d * 4} y={g - 83} w={34} h={24} />
      {/* arm forward */}
      <line x1={x - d * 18} y1={g - 71} x2={x + d * 2} y2={g - 60} {...S('#7C3AED', 12)} />
      <line x1={x + d * 2} y1={g - 60} x2={x + d * 8} y2={g - 50} {...S('#9CA3AF', 10)} />
      {/* arm back */}
      <line x1={x + d * 14} y1={g - 73} x2={x + d * 26} y2={g - 60} {...S('#7C3AED', 12)} />
      <line x1={x + d * 26} y1={g - 60} x2={x + d * 30} y2={g - 50} {...S('#9CA3AF', 10)} />
      <Shorts x={x - d * 4} y={g - 59} w={28} h={13} />
      {/* front leg bent */}
      <line x1={x - d * 8} y1={g - 46} x2={x - d * 18} y2={g - 27} {...S('#9CA3AF', 13)} />
      <line x1={x - d * 18} y1={g - 27} x2={x - d * 20} y2={g - 7} {...S('#C9D0D8', 11)} />
      <Shoe x={x - d * 20} y={g - 2} flip={d > 0} />
      {/* back leg extended */}
      <line x1={x + d * 4} y1={g - 46} x2={x + d * 24} y2={g - 20} {...S('#9CA3AF', 13)} />
      <line x1={x + d * 24} y1={g - 20} x2={x + d * 28} y2={g - 7} {...S('#C9D0D8', 11)} />
      <Shoe x={x + d * 28} y={g - 2} flip={d < 0} />
    </g>
  );
}

/** Hip hinge — forward lean at hips */
function FHipHinge({ x, g = 126, upright = false }: { x: number; g?: number; upright?: boolean }) {
  if (upright) return <FStand x={x} g={g} />;
  return (
    <g>
      <GShadow x={x} g={g} />
      {/* head leaning forward */}
      <Head x={x - 22} y={g - 72} />
      {/* torso horizontal */}
      <line x1={x - 18} y1={g - 68} x2={x + 14} y2={g - 56} {...S('#7C3AED', 22)} />
      <line x1={x - 18} y1={g - 68} x2={x + 14} y2={g - 56} {...S('url(#sh)', 22)} />
      {/* arms hang down */}
      <line x1={x - 8} y1={g - 59} x2={x - 6} y2={g - 40} {...S('#7C3AED', 11)} />
      <line x1={x - 6} y1={g - 40} x2={x - 4} y2={g - 27} {...S('#9CA3AF', 9)} />
      <line x1={x + 6} y1={g - 56} x2={x + 4} y2={g - 37} {...S('#7C3AED', 11)} />
      <line x1={x + 4} y1={g - 37} x2={x + 2} y2={g - 24} {...S('#9CA3AF', 9)} />
      <Shorts x={x + 14} y={g - 57} w={20} h={12} />
      {/* straight legs */}
      <line x1={x + 8} y1={g - 45} x2={x + 6} y2={g - 22} {...S('#9CA3AF', 14)} />
      <line x1={x + 20} y1={g - 45} x2={x + 18} y2={g - 22} {...S('#9CA3AF', 14)} />
      <line x1={x + 6} y1={g - 22} x2={x + 6} y2={g - 7} {...S('#C9D0D8', 12)} />
      <line x1={x + 18} y1={g - 22} x2={x + 18} y2={g - 7} {...S('#C9D0D8', 12)} />
      <Shoe x={x + 6} y={g - 2} flip />
      <Shoe x={x + 18} y={g - 2} />
    </g>
  );
}

/** Plank — horizontal on hands */
function FPlank({ x, g = 126 }: { x: number; g?: number }) {
  return (
    <g>
      <GShadow x={x} g={g} rx={30} />
      <Head x={x - 32} y={g - 28} />
      {/* body horizontal */}
      <line x1={x - 24} y1={g - 22} x2={x + 28} y2={g - 22} {...S('#7C3AED', 22)} />
      <line x1={x - 24} y1={g - 22} x2={x + 28} y2={g - 22} {...S('url(#sh)', 22)} />
      {/* arms straight down */}
      <line x1={x - 14} y1={g - 12} x2={x - 14} y2={g - 4} {...S('#7C3AED', 11)} />
      <line x1={x - 14} y1={g - 4} x2={x - 14} y2={g + 2}  {...S('#9CA3AF', 9)} />
      <line x1={x + 14} y1={g - 12} x2={x + 14} y2={g - 4} {...S('#7C3AED', 11)} />
      <line x1={x + 14} y1={g - 4} x2={x + 14} y2={g + 2}  {...S('#9CA3AF', 9)} />
      <Shorts x={x + 16} y={g - 30} w={22} h={12} />
      {/* legs straight back */}
      <line x1={x + 28} y1={g - 22} x2={x + 42} y2={g - 14} {...S('#9CA3AF', 13)} />
      <line x1={x + 36} y1={g - 18} x2={x + 50} y2={g - 10} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 44} y={g - 6} />
      <Shoe x={x + 50} y={g - 4} />
    </g>
  );
}

/** Pushup — down position */
function FPushup({ x, g = 126, down = true }: { x: number; g?: number; down?: boolean }) {
  const lift = down ? 0 : 16;
  return (
    <g>
      <GShadow x={x} g={g} rx={30} />
      <Head x={x - 34} y={g - 24 - lift} />
      <line x1={x - 26} y1={g - 18 - lift} x2={x + 28} y2={g - 18 - lift} {...S('#7C3AED', 22)} />
      <line x1={x - 26} y1={g - 18 - lift} x2={x + 28} y2={g - 18 - lift} {...S('url(#sh)', 22)} />
      {/* bent arms (down) or straight arms (up) */}
      {down ? (
        <>
          <line x1={x - 10} y1={g - 10} x2={x - 16} y2={g - 4} {...S('#7C3AED', 11)} />
          <line x1={x - 16} y1={g - 4} x2={x - 20} y2={g}      {...S('#9CA3AF', 9)} />
          <line x1={x + 10} y1={g - 10} x2={x + 16} y2={g - 4} {...S('#7C3AED', 11)} />
          <line x1={x + 16} y1={g - 4} x2={x + 20} y2={g}      {...S('#9CA3AF', 9)} />
        </>
      ) : (
        <>
          <line x1={x - 10} y1={g - 8 - lift} x2={x - 12} y2={g - 4} {...S('#7C3AED', 11)} />
          <line x1={x - 12} y1={g - 4} x2={x - 14} y2={g}            {...S('#9CA3AF', 9)} />
          <line x1={x + 10} y1={g - 8 - lift} x2={x + 12} y2={g - 4} {...S('#7C3AED', 11)} />
          <line x1={x + 12} y1={g - 4} x2={x + 14} y2={g}            {...S('#9CA3AF', 9)} />
        </>
      )}
      <Shorts x={x + 18} y={g - 26 - lift} w={20} h={12} />
      <line x1={x + 28} y1={g - 18 - lift} x2={x + 42} y2={g - 10} {...S('#9CA3AF', 13)} />
      <line x1={x + 36} y1={g - 14} x2={x + 50} y2={g - 6} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 44} y={g - 2} />
      <Shoe x={x + 50} y={g} />
    </g>
  );
}

/** Hip thrust — supine, shoulders on bench */
function FHipThrust({ x, g = 126, up = false }: { x: number; g?: number; up?: boolean }) {
  const hy = up ? g - 44 : g - 22;
  return (
    <g>
      <GShadow x={x} g={g} rx={32} />
      {/* bench */}
      <rect x={x - 50} y={g - 38} width={28} height={12} rx={4} fill="url(#eqg)" />
      {/* head on bench */}
      <Head x={x - 42} y={g - 46} />
      {/* torso at angle */}
      <line x1={x - 36} y1={g - 40} x2={x + 14} y2={hy} {...S('#7C3AED', 20)} />
      <Shorts x={x + 10} y={hy - 8} w={22} h={12} />
      {/* feet planted */}
      <line x1={x + 14} y1={hy} x2={x + 6}  y2={g - 8} {...S('#9CA3AF', 13)} />
      <line x1={x + 22} y1={hy} x2={x + 26} y2={g - 8} {...S('#9CA3AF', 13)} />
      <line x1={x + 6}  y1={g - 8} x2={x + 4}  y2={g - 2} {...S('#C9D0D8', 11)} />
      <line x1={x + 26} y1={g - 8} x2={x + 28} y2={g - 2} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 4}  y={g} flip />
      <Shoe x={x + 28} y={g} />
      {/* arms resting */}
      <line x1={x - 30} y1={g - 38} x2={x - 28} y2={g - 24} {...S('#7C3AED', 11)} />
      <line x1={x - 28} y1={g - 24} x2={x - 26} y2={g - 14} {...S('#9CA3AF', 9)} />
    </g>
  );
}

/** Row — cable / bent row */
function FRow({ x, g = 126, pulled = false }: { x: number; g?: number; pulled?: boolean }) {
  return (
    <g>
      <GShadow x={x} g={g} />
      <Head x={x - 18} y={g - 70} />
      {/* torso bent forward */}
      <line x1={x - 12} y1={g - 64} x2={x + 16} y2={g - 52} {...S('#7C3AED', 20)} />
      <Shorts x={x + 14} y={g - 55} w={20} h={12} />
      {/* pulling arm */}
      {pulled ? (
        <>
          <line x1={x - 4} y1={g - 58} x2={x - 22} y2={g - 56} {...S('#7C3AED', 11)} />
          <line x1={x - 22} y1={g - 56} x2={x - 30} y2={g - 52} {...S('#9CA3AF', 9)} />
        </>
      ) : (
        <>
          <line x1={x - 4} y1={g - 58} x2={x - 34} y2={g - 56} {...S('#7C3AED', 11)} />
          <line x1={x - 34} y1={g - 56} x2={x - 44} y2={g - 52} {...S('#9CA3AF', 9)} />
        </>
      )}
      {/* support arm */}
      <line x1={x + 8} y1={g - 52} x2={x + 28} y2={g - 44} {...S('#7C3AED', 11)} />
      <line x1={x + 28} y1={g - 44} x2={x + 36} y2={g - 38} {...S('#9CA3AF', 9)} />
      {/* legs */}
      <line x1={x + 8}  y1={g - 43} x2={x + 6}  y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x + 20} y1={g - 43} x2={x + 20} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x + 6}  y1={g - 22} x2={x + 4}  y2={g - 7}  {...S('#C9D0D8', 11)} />
      <line x1={x + 20} y1={g - 22} x2={x + 20} y2={g - 7}  {...S('#C9D0D8', 11)} />
      <Shoe x={x + 4}  y={g - 2} flip />
      <Shoe x={x + 20} y={g - 2} />
    </g>
  );
}

/** Shoulder press — seated */
function FShoulderPress({ x, g = 126, up = false }: { x: number; g?: number; up?: boolean }) {
  return (
    <g>
      {/* bench seat */}
      <rect x={x - 18} y={g - 40} width={36} height={8} rx={4} fill="url(#eqg)" />
      <rect x={x - 4}  y={g - 32} width={8} height={32} rx={3} fill="url(#eqg)" />
      <GShadow x={x} g={g} />
      <Head x={x} y={g - 90} />
      <rect x={x - 5} y={g - 80} width={10} height={6} rx={3} fill="#9CA3AF" />
      <Torso x={x} y={g - 79} />
      {/* arms up or at shoulder */}
      {up ? (
        <>
          <line x1={x - 27} y1={g - 72} x2={x - 32} y2={g - 92} {...S('#7C3AED', 12)} />
          <line x1={x - 32} y1={g - 92} x2={x - 32} y2={g - 106} {...S('#9CA3AF', 10)} />
          <line x1={x + 27} y1={g - 72} x2={x + 32} y2={g - 92} {...S('#7C3AED', 12)} />
          <line x1={x + 32} y1={g - 92} x2={x + 32} y2={g - 106} {...S('#9CA3AF', 10)} />
          {/* bar */}
          <line x1={x - 32} y1={g - 108} x2={x + 32} y2={g - 108} stroke="#888" strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={x - 27} y1={g - 72} x2={x - 36} y2={g - 60} {...S('#7C3AED', 12)} />
          <line x1={x - 36} y1={g - 60} x2={x - 40} y2={g - 56} {...S('#9CA3AF', 10)} />
          <line x1={x + 27} y1={g - 72} x2={x + 36} y2={g - 60} {...S('#7C3AED', 12)} />
          <line x1={x + 36} y1={g - 60} x2={x + 40} y2={g - 56} {...S('#9CA3AF', 10)} />
          {/* bar at shoulders */}
          <line x1={x - 40} y1={g - 56} x2={x + 40} y2={g - 56} stroke="#888" strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      <Shorts x={x} y={g - 54} />
      {/* seated legs */}
      <line x1={x - 10} y1={g - 39} x2={x - 10} y2={g - 16} {...S('#9CA3AF', 13)} />
      <line x1={x + 10} y1={g - 39} x2={x + 10} y2={g - 16} {...S('#9CA3AF', 13)} />
      <line x1={x - 10} y1={g - 16} x2={x - 10} y2={g - 4}  {...S('#C9D0D8', 11)} />
      <line x1={x + 10} y1={g - 16} x2={x + 10} y2={g - 4}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 10} y={g - 1} flip />
      <Shoe x={x + 10} y={g - 1} />
    </g>
  );
}

/** Bench press — lying */
function FBenchPress({ x, g = 126, down = true }: { x: number; g?: number; down?: boolean }) {
  const armH = down ? g - 46 : g - 60;
  return (
    <g>
      <GShadow x={x} g={g} rx={34} />
      {/* bench */}
      <rect x={x - 52} y={g - 34} width={104} height={10} rx={5} fill="url(#eqg)" />
      <rect x={x - 8}  y={g - 24} width={16}  height={24} rx={3} fill="url(#eqg)" />
      {/* lying body */}
      <Head x={x - 44} y={g - 44} />
      <line x1={x - 36} y1={g - 39} x2={x + 34} y2={g - 39} {...S('#7C3AED', 20)} />
      <Shorts x={x + 14} y={g - 47} w={24} h={12} />
      {/* legs hanging off */}
      <line x1={x + 28} y1={g - 39} x2={x + 36} y2={g - 20} {...S('#9CA3AF', 13)} />
      <line x1={x + 36} y1={g - 39} x2={x + 44} y2={g - 20} {...S('#9CA3AF', 13)} />
      <line x1={x + 36} y1={g - 20} x2={x + 34} y2={g - 5} {...S('#C9D0D8', 11)} />
      <line x1={x + 44} y1={g - 20} x2={x + 44} y2={g - 5} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 34} y={g - 1} flip />
      <Shoe x={x + 44} y={g - 1} />
      {/* arms pressing */}
      <line x1={x - 24} y1={g - 39} x2={x - 28} y2={armH} {...S('#7C3AED', 12)} />
      <line x1={x - 28} y1={armH} x2={x - 28} y2={armH - 6} {...S('#9CA3AF', 10)} />
      <line x1={x + 10}  y1={g - 39} x2={x + 14} y2={armH} {...S('#7C3AED', 12)} />
      <line x1={x + 14} y1={armH} x2={x + 14} y2={armH - 6} {...S('#9CA3AF', 10)} />
      {/* bar */}
      <line x1={x - 34} y1={armH - 5} x2={x + 20} y2={armH - 5} stroke="#888" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/** Nordic curl — kneeling, upright or falling */
function FNordic({ x, g = 126, falling = false }: { x: number; g?: number; falling?: boolean }) {
  if (!falling) {
    return (
      <g>
        <GShadow x={x} g={g} />
        <Head x={x} y={g - 88} />
        <Torso x={x} y={g - 80} />
        <line x1={x - 27} y1={g - 72} x2={x - 28} y2={g - 55} {...S('#7C3AED', 13)} />
        <line x1={x + 27} y1={g - 72} x2={x + 28} y2={g - 55} {...S('#7C3AED', 13)} />
        <line x1={x - 28} y1={g - 55} x2={x - 28} y2={g - 43} {...S('#9CA3AF', 11)} />
        <line x1={x + 28} y1={g - 55} x2={x + 28} y2={g - 43} {...S('#9CA3AF', 11)} />
        <Shorts x={x} y={g - 55} />
        {/* kneeling — thighs vertical */}
        <line x1={x - 10} y1={g - 41} x2={x - 10} y2={g - 20} {...S('#9CA3AF', 14)} />
        <line x1={x + 10} y1={g - 41} x2={x + 10} y2={g - 20} {...S('#9CA3AF', 14)} />
        {/* shins flat on ground */}
        <line x1={x - 10} y1={g - 20} x2={x - 26} y2={g - 4} {...S('#C9D0D8', 12)} />
        <line x1={x + 10} y1={g - 20} x2={x + 26} y2={g - 4} {...S('#C9D0D8', 12)} />
        <Shoe x={x - 26} y={g} flip />
        <Shoe x={x + 26} y={g} />
      </g>
    );
  }
  // falling forward
  return (
    <g>
      <GShadow x={x} g={g} rx={26} />
      <Head x={x - 22} y={g - 58} />
      <line x1={x - 16} y1={g - 52} x2={x + 14} y2={g - 40} {...S('#7C3AED', 20)} />
      {/* arms catch */}
      <line x1={x - 10} y1={g - 44} x2={x - 28} y2={g - 32} {...S('#7C3AED', 11)} />
      <line x1={x - 28} y1={g - 32} x2={x - 36} y2={g - 24} {...S('#9CA3AF', 9)} />
      <line x1={x + 4}  y1={g - 40} x2={x + 16} y2={g - 30} {...S('#7C3AED', 11)} />
      <line x1={x + 16} y1={g - 30} x2={x + 22} y2={g - 22} {...S('#9CA3AF', 9)} />
      <Shorts x={x + 12} y={g - 44} w={24} h={12} />
      {/* kneeling */}
      <line x1={x + 6}  y1={g - 32} x2={x - 2} y2={g - 14} {...S('#9CA3AF', 13)} />
      <line x1={x + 18} y1={g - 32} x2={x + 18} y2={g - 14} {...S('#9CA3AF', 13)} />
      <line x1={x - 2}  y1={g - 14} x2={x - 16} y2={g - 4} {...S('#C9D0D8', 11)} />
      <line x1={x + 18} y1={g - 14} x2={x + 26} y2={g - 4} {...S('#C9D0D8', 11)} />
      <Shoe x={x - 16} y={g} flip />
      <Shoe x={x + 26} y={g} />
    </g>
  );
}

/** Cable extension — arm extended */
function FCable({ x, g = 126, extended = true }: { x: number; g?: number; extended?: boolean }) {
  return (
    <g>
      {/* cable machine */}
      <rect x={x + 34} y={g - 80} width={14} height={80} rx={3} fill="url(#eqg)" />
      <circle cx={x + 41} cy={g - 70} r={5} fill="#888" />
      <line x1={x + 41} y1={g - 65} x2={extended ? x + 10 : x + 30} y2={g - 55} stroke="#aaa" strokeWidth="1.5" />
      <GShadow x={x} g={g} />
      <Head x={x} y={g - 91} />
      <Torso x={x} y={g - 83} w={34} h={24} />
      {/* working arm */}
      {extended ? (
        <>
          <line x1={x + 23} y1={g - 72} x2={x + 12} y2={g - 56} {...S('#7C3AED', 12)} />
          <line x1={x + 12} y1={g - 56} x2={x + 8}  y2={g - 46} {...S('#9CA3AF', 10)} />
        </>
      ) : (
        <>
          <line x1={x + 23} y1={g - 72} x2={x + 28} y2={g - 60} {...S('#7C3AED', 12)} />
          <line x1={x + 28} y1={g - 60} x2={x + 32} y2={g - 56} {...S('#9CA3AF', 10)} />
        </>
      )}
      {/* other arm down */}
      <line x1={x - 23} y1={g - 72} x2={x - 24} y2={g - 54} {...S('#7C3AED', 12)} />
      <line x1={x - 24} y1={g - 54} x2={x - 24} y2={g - 42} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 57} />
      <line x1={x - 10} y1={g - 41} x2={x - 10} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x + 10} y1={g - 41} x2={x + 10} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x - 10} y1={g - 22} x2={x - 10} y2={g - 7}  {...S('#C9D0D8', 11)} />
      <line x1={x + 10} y1={g - 22} x2={x + 10} y2={g - 7}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 10} y={g - 2} flip />
      <Shoe x={x + 10} y={g - 2} />
    </g>
  );
}

/** Jump — arms overhead */
function FJump({ x, g = 126, prep = false }: { x: number; g?: number; prep?: boolean }) {
  if (prep) {
    // slight crouch ready to jump
    return (
      <g>
        <GShadow x={x} g={g} />
        <Head x={x} y={g - 76} />
        <Torso x={x} y={g - 68} w={36} h={22} />
        {/* arms cocked back */}
        <line x1={x - 25} y1={g - 60} x2={x - 36} y2={g - 50} {...S('#7C3AED', 12)} />
        <line x1={x - 36} y1={g - 50} x2={x - 40} y2={g - 42} {...S('#9CA3AF', 10)} />
        <line x1={x + 25} y1={g - 60} x2={x + 36} y2={g - 50} {...S('#7C3AED', 12)} />
        <line x1={x + 36} y1={g - 50} x2={x + 40} y2={g - 42} {...S('#9CA3AF', 10)} />
        <Shorts x={x} y={g - 48} w={30} h={14} />
        <line x1={x - 10} y1={g - 34} x2={x - 18} y2={g - 16} {...S('#9CA3AF', 13)} />
        <line x1={x + 10} y1={g - 34} x2={x + 18} y2={g - 16} {...S('#9CA3AF', 13)} />
        <line x1={x - 18} y1={g - 16} x2={x - 14} y2={g - 4} {...S('#C9D0D8', 11)} />
        <line x1={x + 18} y1={g - 16} x2={x + 14} y2={g - 4} {...S('#C9D0D8', 11)} />
        <Shoe x={x - 14} y={g} flip />
        <Shoe x={x + 14} y={g} />
      </g>
    );
  }
  // in air, arms up
  return (
    <g>
      <GShadow x={x} g={g} rx={14} />
      <Head x={x} y={g - 112} />
      <Torso x={x} y={g - 104} />
      {/* arms overhead */}
      <line x1={x - 27} y1={g - 94} x2={x - 28} y2={g - 108} {...S('#7C3AED', 12)} />
      <line x1={x - 28} y1={g - 108} x2={x - 26} y2={g - 118} {...S('#9CA3AF', 10)} />
      <line x1={x + 27} y1={g - 94} x2={x + 28} y2={g - 108} {...S('#7C3AED', 12)} />
      <line x1={x + 28} y1={g - 108} x2={x + 26} y2={g - 118} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 77} />
      {/* legs tucked slightly */}
      <line x1={x - 10} y1={g - 62} x2={x - 12} y2={g - 44} {...S('#9CA3AF', 13)} />
      <line x1={x + 10} y1={g - 62} x2={x + 12} y2={g - 44} {...S('#9CA3AF', 13)} />
      <line x1={x - 12} y1={g - 44} x2={x - 10} y2={g - 28} {...S('#C9D0D8', 11)} />
      <line x1={x + 12} y1={g - 44} x2={x + 10} y2={g - 28} {...S('#C9D0D8', 11)} />
      <Shoe x={x - 10} y={g - 22} flip />
      <Shoe x={x + 10} y={g - 22} />
    </g>
  );
}

/** Run stride */
function FRun({ x, g = 126, fast = false }: { x: number; g?: number; fast?: boolean }) {
  const lean = fast ? 14 : 8;
  return (
    <g>
      <GShadow x={x} g={g} />
      {/* slightly forward lean */}
      <Head x={x - lean / 2} y={g - 92} />
      <line x1={x - lean / 2 - 2} y1={g - 82} x2={x + 6} y2={g - 60} {...S('#7C3AED', 20)} />
      {/* arm forward */}
      <line x1={x - lean / 2 - 8} y1={g - 74} x2={x + 6}  y2={g - 64} {...S('#7C3AED', 12)} />
      <line x1={x + 6}  y1={g - 64} x2={x + 14} y2={g - 56} {...S('#9CA3AF', 10)} />
      {/* arm back */}
      <line x1={x - lean / 2 + 8} y1={g - 72} x2={x - 10} y2={g - 56} {...S('#7C3AED', 12)} />
      <line x1={x - 10} y1={g - 56} x2={x - 18} y2={g - 48} {...S('#9CA3AF', 10)} />
      <Shorts x={x + 4} y={g - 57} w={24} h={12} />
      {/* front leg */}
      <line x1={x + 2}  y1={g - 45} x2={x - 10} y2={g - 26} {...S('#9CA3AF', 13)} />
      <line x1={x - 10} y1={g - 26} x2={x - 14} y2={g - 8}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 14} y={g - 2} flip />
      {/* back leg */}
      <line x1={x + 12} y1={g - 45} x2={x + 28} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x + 28} y1={g - 22} x2={x + 22} y2={g - 10} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 22} y={g - 4} />
    </g>
  );
}

/** Balance — single leg */
function FBalance({ x, g = 126, arms = true }: { x: number; g?: number; arms?: boolean }) {
  return (
    <g>
      <GShadow x={x} g={g} rx={12} />
      <Head x={x} y={g - 94} />
      <Torso x={x} y={g - 86} />
      {arms ? (
        <>
          <line x1={x - 27} y1={g - 76} x2={x - 42} y2={g - 66} {...S('#7C3AED', 12)} />
          <line x1={x - 42} y1={g - 66} x2={x - 50} y2={g - 60} {...S('#9CA3AF', 10)} />
          <line x1={x + 27} y1={g - 76} x2={x + 42} y2={g - 66} {...S('#7C3AED', 12)} />
          <line x1={x + 42} y1={g - 66} x2={x + 50} y2={g - 60} {...S('#9CA3AF', 10)} />
        </>
      ) : (
        <>
          <line x1={x - 27} y1={g - 76} x2={x - 28} y2={g - 58} {...S('#7C3AED', 12)} />
          <line x1={x - 28} y1={g - 58} x2={x - 28} y2={g - 46} {...S('#9CA3AF', 10)} />
          <line x1={x + 27} y1={g - 76} x2={x + 28} y2={g - 58} {...S('#7C3AED', 12)} />
          <line x1={x + 28} y1={g - 58} x2={x + 28} y2={g - 46} {...S('#9CA3AF', 10)} />
        </>
      )}
      <Shorts x={x} y={g - 58} />
      {/* standing leg */}
      <line x1={x - 4} y1={g - 42} x2={x - 4} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x - 4} y1={g - 22} x2={x - 4} y2={g - 7}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 4} y={g - 2} flip />
      {/* raised leg bent back */}
      <line x1={x + 8} y1={g - 42} x2={x + 24} y2={g - 30} {...S('#9CA3AF', 13)} />
      <line x1={x + 24} y1={g - 30} x2={x + 28} y2={g - 44} {...S('#C9D0D8', 11)} />
    </g>
  );
}

/** Foam roll — lying on roller, back */
function FFoamRoll({ x, g = 126 }: { x: number; g?: number }) {
  return (
    <g>
      {/* roller */}
      <ellipse cx={x} cy={g - 12} rx={34} ry={8} fill="#444" />
      {/* body horizontal */}
      <Head x={x - 38} y={g - 28} />
      <line x1={x - 30} y1={g - 22} x2={x + 32} y2={g - 22} {...S('#7C3AED', 20)} />
      <Shorts x={x + 10} y={g - 30} w={22} h={12} />
      {/* arms supporting */}
      <line x1={x - 18} y1={g - 14} x2={x - 24} y2={g - 4} {...S('#7C3AED', 11)} />
      <line x1={x - 24} y1={g - 4} x2={x - 26} y2={g + 2}  {...S('#9CA3AF', 9)} />
      <line x1={x + 8}  y1={g - 14} x2={x + 16} y2={g - 4} {...S('#7C3AED', 11)} />
      <line x1={x + 16} y1={g - 4} x2={x + 18} y2={g + 2}  {...S('#9CA3AF', 9)} />
      {/* legs bent */}
      <line x1={x + 32} y1={g - 22} x2={x + 42} y2={g - 8} {...S('#9CA3AF', 13)} />
      <line x1={x + 38} y1={g - 20} x2={x + 48} y2={g - 6} {...S('#9CA3AF', 13)} />
      <line x1={x + 42} y1={g - 8} x2={x + 38} y2={g + 2} {...S('#C9D0D8', 11)} />
      <line x1={x + 48} y1={g - 6} x2={x + 46} y2={g + 2} {...S('#C9D0D8', 11)} />
      <Shoe x={x + 38} y={g + 4} flip />
      <Shoe x={x + 46} y={g + 4} />
    </g>
  );
}

/** Band walk — wide stance with resistance band */
function FBandWalk({ x, g = 126, stepped = false }: { x: number; g?: number; stepped?: boolean }) {
  const w = stepped ? 28 : 16;
  return (
    <g>
      <GShadow x={x} g={g} rx={w + 2} />
      {/* band */}
      <path d={`M ${x - w} ${g - 8} Q ${x} ${g - 2} ${x + w} ${g - 8}`} stroke="#F59E0B" strokeWidth="3" fill="none" />
      <Head x={x} y={g - 86} />
      <Torso x={x} y={g - 78} />
      <line x1={x - 27} y1={g - 70} x2={x - 22} y2={g - 54} {...S('#7C3AED', 12)} />
      <line x1={x - 22} y1={g - 54} x2={x - 20} y2={g - 44} {...S('#9CA3AF', 10)} />
      <line x1={x + 27} y1={g - 70} x2={x + 22} y2={g - 54} {...S('#7C3AED', 12)} />
      <line x1={x + 22} y1={g - 54} x2={x + 20} y2={g - 44} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 52} />
      {/* wide legs */}
      <line x1={x - 6}  y1={g - 36} x2={x - w} y2={g - 18} {...S('#9CA3AF', 13)} />
      <line x1={x + 6}  y1={g - 36} x2={x + w} y2={g - 18} {...S('#9CA3AF', 13)} />
      <line x1={x - w}  y1={g - 18} x2={x - w + 2} y2={g - 5} {...S('#C9D0D8', 11)} />
      <line x1={x + w}  y1={g - 18} x2={x + w - 2} y2={g - 5} {...S('#C9D0D8', 11)} />
      <Shoe x={x - w + 2} y={g} flip />
      <Shoe x={x + w - 2} y={g} />
    </g>
  );
}

/** Hip mobility — standing hip circle / stretch */
function FHipMob({ x, g = 126, rotated = false }: { x: number; g?: number; rotated?: boolean }) {
  return (
    <g>
      <GShadow x={x} g={g} rx={14} />
      {/* rotation arrow around hips */}
      {rotated && (
        <path d={`M ${x - 22} ${g - 44} A 22 14 0 0 1 ${x + 22} ${g - 44}`}
          stroke="#F97316" strokeWidth="2.5" fill="none"
          markerEnd="url(#arrowhead)" strokeDasharray="4,2" />
      )}
      <Head x={x} y={g - 92} />
      <Torso x={x} y={g - 84} />
      <line x1={x - 27} y1={g - 76} x2={x - 28} y2={g - 58} {...S('#7C3AED', 12)} />
      <line x1={x - 28} y1={g - 58} x2={x - 28} y2={g - 46} {...S('#9CA3AF', 10)} />
      <line x1={x + 27} y1={g - 76} x2={x + 28} y2={g - 58} {...S('#7C3AED', 12)} />
      <line x1={x + 28} y1={g - 58} x2={x + 28} y2={g - 46} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 56} />
      {/* one leg raised to side */}
      <line x1={x + 6}  y1={g - 40} x2={x + (rotated ? 32 : 10)} y2={g - (rotated ? 30 : 22)} {...S('#9CA3AF', 13)} />
      {rotated
        ? <line x1={x + 32} y1={g - 30} x2={x + 28} y2={g - 14} {...S('#C9D0D8', 11)} />
        : <line x1={x + 10} y1={g - 22} x2={x + 10} y2={g - 7}  {...S('#C9D0D8', 11)} />
      }
      {/* planted leg */}
      <line x1={x - 8} y1={g - 40} x2={x - 8} y2={g - 20} {...S('#9CA3AF', 13)} />
      <line x1={x - 8} y1={g - 20} x2={x - 8} y2={g - 6}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 8} y={g - 2} flip />
      {!rotated && <Shoe x={x + 10} y={g - 2} />}
    </g>
  );
}

/** Foot/ankle activation — seated */
function FFootAct({ x, g = 126, flexed = false }: { x: number; g?: number; flexed?: boolean }) {
  return (
    <g>
      {/* chair */}
      <rect x={x - 20} y={g - 42} width={40} height={8} rx={3} fill="url(#eqg)" />
      <rect x={x - 4}  y={g - 34} width={8} height={34} rx={3} fill="url(#eqg)" />
      <GShadow x={x} g={g} />
      <Head x={x} y={g - 86} />
      <Torso x={x} y={g - 78} />
      <line x1={x - 27} y1={g - 68} x2={x - 22} y2={g - 52} {...S('#7C3AED', 12)} />
      <line x1={x - 22} y1={g - 52} x2={x - 20} y2={g - 44} {...S('#9CA3AF', 10)} />
      <line x1={x + 27} y1={g - 68} x2={x + 22} y2={g - 52} {...S('#7C3AED', 12)} />
      <line x1={x + 22} y1={g - 52} x2={x + 20} y2={g - 44} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 56} />
      {/* seated legs */}
      <line x1={x - 10} y1={g - 35} x2={x - 10} y2={g - 14} {...S('#9CA3AF', 13)} />
      <line x1={x + 10} y1={g - 35} x2={x + 10} y2={g - 14} {...S('#9CA3AF', 13)} />
      <line x1={x - 10} y1={g - 14} x2={x - 10} y2={g - 4}  {...S('#C9D0D8', 11)} />
      {/* ankle flex on one leg */}
      {flexed
        ? <line x1={x + 10} y1={g - 14} x2={x + 20} y2={g - 4} {...S('#C9D0D8', 11)} />
        : <line x1={x + 10} y1={g - 14} x2={x + 10} y2={g - 4} {...S('#C9D0D8', 11)} />
      }
      <Shoe x={x - 10} y={g - 1} flip />
      <Shoe x={flexed ? x + 20 : x + 10} y={g - 1} />
    </g>
  );
}

/** Copenhagen — side plank, top leg on bench */
function FCopenhagen({ x, g = 126, up = false }: { x: number; g?: number; up?: boolean }) {
  const hy = up ? g - 44 : g - 28;
  return (
    <g>
      {/* bench for top leg */}
      <rect x={x + 14} y={g - 48} width={50} height={8} rx={3} fill="url(#eqg)" />
      <Head x={x - 40} y={up ? g - 58 : g - 42} />
      {/* torso angled */}
      <line x1={x - 34} y1={up ? g - 52 : g - 36} x2={x + 12} y2={hy} {...S('#7C3AED', 18)} />
      {/* support arm */}
      <line x1={x - 28} y1={up ? g - 46 : g - 30} x2={x - 36} y2={g - 18} {...S('#7C3AED', 11)} />
      <line x1={x - 36} y1={g - 18} x2={x - 36} y2={g - 6}    {...S('#9CA3AF', 9)} />
      <Shorts x={x + 10} y={hy - 8} w={20} h={12} />
      {/* top leg on bench */}
      <line x1={x + 10} y1={hy} x2={x + 44} y2={g - 44} {...S('#9CA3AF', 12)} />
      <line x1={x + 44} y1={g - 44} x2={x + 56} y2={g - 44} {...S('#C9D0D8', 10)} />
      {/* bottom leg */}
      <line x1={x + 16} y1={hy} x2={x + 48} y2={g - 8}  {...S('#9CA3AF', 12)} />
      <line x1={x + 42} y1={g - 6} x2={x + 56} y2={g - 6} {...S('#C9D0D8', 10)} />
      {/* floor line */}
      <line x1={x - 50} y1={g - 2} x2={x + 66} y2={g - 2} stroke="#333" strokeWidth="1.5" />
    </g>
  );
}

/** Ice bath */
function FIceBath({ x, g = 126 }: { x: number; g?: number }) {
  return (
    <g>
      {/* tub */}
      <rect x={x - 52} y={g - 52} width={104} height={46} rx={10} fill="#1a2e4f" stroke="#2563EB" strokeWidth="2.5" />
      {/* water */}
      <rect x={x - 48} y={g - 38} width={96} height={30} rx={6} fill="#1d4ed8" opacity="0.55" />
      {/* ice */}
      {[-30, -10, 12, 32].map((dx, i) => (
        <rect key={i} x={x + dx} y={g - 36} width={11} height={11} rx={2} fill="#93c5fd" opacity="0.85" />
      ))}
      {/* sitting figure */}
      <Head x={x} y={g - 68} />
      <line x1={x} y1={g - 58} x2={x} y2={g - 42} {...S('#7C3AED', 20)} />
      {/* arms on rim */}
      <line x1={x - 14} y1={g - 54} x2={x - 40} y2={g - 50} {...S('#7C3AED', 11)} />
      <line x1={x - 40} y1={g - 50} x2={x - 46} y2={g - 43} {...S('#9CA3AF', 9)} />
      <line x1={x + 14} y1={g - 54} x2={x + 40} y2={g - 50} {...S('#7C3AED', 11)} />
      <line x1={x + 40} y1={g - 50} x2={x + 46} y2={g - 43} {...S('#9CA3AF', 9)} />
    </g>
  );
}

/** Skipping — high knee run */
function FSkipping({ x, g = 126, left = true }: { x: number; g?: number; left?: boolean }) {
  return (
    <g>
      <GShadow x={x} g={g} rx={14} />
      <Head x={x + 4} y={g - 93} />
      <line x1={x + 2} y1={g - 83} x2={x - 4} y2={g - 60} {...S('#7C3AED', 20)} />
      <Shorts x={x - 2} y={g - 57} w={22} h={12} />
      {/* arm swing */}
      <line x1={x - 8} y1={g - 74} x2={x - 22} y2={g - 58} {...S('#7C3AED', 11)} />
      <line x1={x - 22} y1={g - 58} x2={x - 28} y2={g - 50} {...S('#9CA3AF', 9)} />
      <line x1={x + 8}  y1={g - 74} x2={x + 20} y2={g - 82} {...S('#7C3AED', 11)} />
      <line x1={x + 20} y1={g - 82} x2={x + 24} y2={g - 74} {...S('#9CA3AF', 9)} />
      {left ? (
        <>
          <line x1={x - 6}  y1={g - 45} x2={x - 18} y2={g - 26} {...S('#9CA3AF', 13)} />
          <line x1={x - 18} y1={g - 26} x2={x - 10} y2={g - 14} {...S('#C9D0D8', 11)} />
          <Shoe x={x - 10} y={g - 10} flip />
          <line x1={x + 4}  y1={g - 45} x2={x + 6}  y2={g - 24} {...S('#9CA3AF', 13)} />
          <line x1={x + 6}  y1={g - 24} x2={x + 8}  y2={g - 8}  {...S('#C9D0D8', 11)} />
          <Shoe x={x + 8}  y={g - 4} />
        </>
      ) : (
        <>
          <line x1={x + 4}  y1={g - 45} x2={x + 18} y2={g - 26} {...S('#9CA3AF', 13)} />
          <line x1={x + 18} y1={g - 26} x2={x + 10} y2={g - 14} {...S('#C9D0D8', 11)} />
          <Shoe x={x + 10} y={g - 10} />
          <line x1={x - 6}  y1={g - 45} x2={x - 8}  y2={g - 24} {...S('#9CA3AF', 13)} />
          <line x1={x - 8}  y1={g - 24} x2={x - 8}  y2={g - 8}  {...S('#C9D0D8', 11)} />
          <Shoe x={x - 8}  y={g - 4} flip />
        </>
      )}
    </g>
  );
}

/** Bounding stride */
function FBounds({ x, g = 126, extended = false }: { x: number; g?: number; extended?: boolean }) {
  const lift = extended ? 14 : 0;
  return (
    <g>
      <GShadow x={x} g={g} rx={14} />
      <Head x={x + 8} y={g - 90 - lift} />
      <line x1={x + 6} y1={g - 80 - lift} x2={x - 4} y2={g - 58 - lift} {...S('#7C3AED', 20)} />
      <Shorts x={x} y={g - 55 - lift} w={22} h={12} />
      {/* lead arm forward */}
      <line x1={x - 4} y1={g - 70 - lift} x2={x + 16} y2={g - 78 - lift} {...S('#7C3AED', 11)} />
      <line x1={x + 16} y1={g - 78 - lift} x2={x + 24} y2={g - 72 - lift} {...S('#9CA3AF', 9)} />
      {/* trailing arm back */}
      <line x1={x + 6}  y1={g - 68 - lift} x2={x - 12} y2={g - 56 - lift} {...S('#7C3AED', 11)} />
      <line x1={x - 12} y1={g - 56 - lift} x2={x - 18} y2={g - 48 - lift} {...S('#9CA3AF', 9)} />
      {/* lead leg forward */}
      <line x1={x - 4}  y1={g - 43 - lift} x2={x - 16} y2={g - 24 - lift} {...S('#9CA3AF', 13)} />
      <line x1={x - 16} y1={g - 24 - lift} x2={x - 18} y2={g - 8}         {...S('#C9D0D8', 11)} />
      <Shoe x={x - 18} y={g - 2} flip />
      {/* trail leg back */}
      <line x1={x + 8}  y1={g - 43 - lift} x2={x + 26} y2={g - 24 - lift} {...S('#9CA3AF', 13)} />
      <line x1={x + 26} y1={g - 24 - lift} x2={x + 22} y2={g - 8}         {...S('#C9D0D8', 11)} />
      <Shoe x={x + 22} y={g - 2} />
    </g>
  );
}

/** Hurdle jump */
function FHurdle({ x, g = 126, over = false }: { x: number; g?: number; over?: boolean }) {
  return (
    <g>
      {/* hurdle */}
      <line x1={x + 26} y1={g - 32} x2={x + 46} y2={g - 32} stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      <line x1={x + 30} y1={g - 32} x2={x + 30} y2={g}       stroke="#ef4444" strokeWidth="3" />
      <line x1={x + 42} y1={g - 32} x2={x + 42} y2={g}       stroke="#ef4444" strokeWidth="3" />
      {over ? (
        <g>
          <GShadow x={x} g={g} rx={14} />
          <Head x={x + 10} y={g - 102} />
          <line x1={x + 8} y1={g - 92} x2={x + 2} y2={g - 70} {...S('#7C3AED', 20)} />
          <Shorts x={x + 4} y={g - 68} w={20} h={12} />
          <line x1={x - 8}  y1={g - 80} x2={x - 22} y2={g - 70} {...S('#7C3AED', 11)} />
          <line x1={x + 16} y1={g - 80} x2={x + 28} y2={g - 70} {...S('#7C3AED', 11)} />
          {/* lead leg */}
          <line x1={x + 4}  y1={g - 56} x2={x - 10} y2={g - 40} {...S('#9CA3AF', 13)} />
          <line x1={x - 10} y1={g - 40} x2={x - 6}  y2={g - 24} {...S('#C9D0D8', 11)} />
          <Shoe x={x - 6}  y={g - 18} flip />
          {/* trail leg */}
          <line x1={x + 10} y1={g - 56} x2={x + 24} y2={g - 42} {...S('#9CA3AF', 13)} />
          <line x1={x + 24} y1={g - 42} x2={x + 20} y2={g - 28} {...S('#C9D0D8', 11)} />
          <Shoe x={x + 20} y={g - 22} />
        </g>
      ) : (
        <FStand x={x - 14} g={g} />
      )}
    </g>
  );
}

/** Agility ladder */
function FLadder({ x, g = 126, out = false }: { x: number; g?: number; out?: boolean }) {
  return (
    <g>
      {/* ladder */}
      {[-28, -12, 4, 20].map((d, i) => (
        <rect key={i} x={x + d} y={g - 10} width={14} height={10} rx={1} fill="none" stroke="#555" strokeWidth="1.5" />
      ))}
      <line x1={x - 32} y1={g - 10} x2={x - 32} y2={g + 1} stroke="#555" strokeWidth="2" />
      <line x1={x + 38} y1={g - 10} x2={x + 38} y2={g + 1} stroke="#555" strokeWidth="2" />
      <Head x={x} y={g - 88} />
      <line x1={x} y1={g - 78} x2={x} y2={g - 54} {...S('#7C3AED', 20)} />
      <Shorts x={x} y={g - 52} w={20} h={12} />
      <line x1={x - 12} y1={g - 70} x2={x - 26} y2={g - 62} {...S('#7C3AED', 11)} />
      <line x1={x + 12} y1={g - 70} x2={x + 26} y2={g - 62} {...S('#7C3AED', 11)} />
      {out ? (
        <>
          <line x1={x - 8} y1={g - 40} x2={x - 24} y2={g - 22} {...S('#9CA3AF', 13)} />
          <line x1={x - 24} y1={g - 22} x2={x - 26} y2={g - 8} {...S('#C9D0D8', 11)} />
          <Shoe x={x - 26} y={g - 4} flip />
          <line x1={x + 8} y1={g - 40} x2={x + 24} y2={g - 22} {...S('#9CA3AF', 13)} />
          <line x1={x + 24} y1={g - 22} x2={x + 26} y2={g - 8} {...S('#C9D0D8', 11)} />
          <Shoe x={x + 26} y={g - 4} />
        </>
      ) : (
        <>
          <line x1={x - 8} y1={g - 40} x2={x - 8} y2={g - 22} {...S('#9CA3AF', 13)} />
          <line x1={x - 8} y1={g - 22} x2={x - 8} y2={g - 8} {...S('#C9D0D8', 11)} />
          <Shoe x={x - 8} y={g - 4} flip />
          <line x1={x + 8} y1={g - 40} x2={x + 8} y2={g - 22} {...S('#9CA3AF', 13)} />
          <line x1={x + 8} y1={g - 22} x2={x + 8} y2={g - 8} {...S('#C9D0D8', 11)} />
          <Shoe x={x + 8} y={g - 4} />
        </>
      )}
    </g>
  );
}

/** Depth jump — on box or landing */
function FDepthJump({ x, g = 126, landing = false }: { x: number; g?: number; landing?: boolean }) {
  if (!landing) {
    return (
      <g>
        <rect x={x - 24} y={g - 36} width={48} height={30} rx={5} fill="#2a2a2a" />
        <rect x={x - 24} y={g - 36} width={48} height={8}  rx={5} fill="#3a3a3a" />
        <FStand x={x} g={g - 36} />
      </g>
    );
  }
  return (
    <g>
      <GShadow x={x} g={g} rx={20} />
      <Head x={x} y={g - 72} />
      <Torso x={x} y={g - 64} w={36} h={22} />
      <line x1={x - 22} y1={g - 54} x2={x - 38} y2={g - 56} {...S('#7C3AED', 12)} />
      <line x1={x - 38} y1={g - 56} x2={x - 46} y2={g - 52} {...S('#9CA3AF', 10)} />
      <line x1={x + 22} y1={g - 54} x2={x + 38} y2={g - 56} {...S('#7C3AED', 12)} />
      <line x1={x + 38} y1={g - 56} x2={x + 46} y2={g - 52} {...S('#9CA3AF', 10)} />
      <Shorts x={x} y={g - 43} w={30} h={13} />
      <line x1={x - 8}  y1={g - 43} x2={x - 20} y2={g - 26} {...S('#9CA3AF', 13)} />
      <line x1={x + 8}  y1={g - 43} x2={x + 20} y2={g - 26} {...S('#9CA3AF', 13)} />
      <line x1={x - 20} y1={g - 26} x2={x - 14} y2={g - 8}  {...S('#C9D0D8', 11)} />
      <line x1={x + 20} y1={g - 26} x2={x + 14} y2={g - 8}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 14} y={g - 3} flip />
      <Shoe x={x + 14} y={g - 3} />
    </g>
  );
}

/** Lateral jump */
function FLateralJump({ x, g = 126, airborne = false }: { x: number; g?: number; airborne?: boolean }) {
  if (!airborne) return <FStand x={x} g={g} />;
  return (
    <g>
      <GShadow x={x + 14} g={g} rx={14} />
      <Head x={x + 16} y={g - 82} />
      <line x1={x + 14} y1={g - 72} x2={x + 8} y2={g - 52} {...S('#7C3AED', 20)} />
      <Shorts x={x + 10} y={g - 50} w={20} h={12} />
      <line x1={x - 4} y1={g - 62} x2={x - 20} y2={g - 56} {...S('#7C3AED', 11)} />
      <line x1={x + 24} y1={g - 62} x2={x + 40} y2={g - 56} {...S('#7C3AED', 11)} />
      <line x1={x + 8}  y1={g - 38} x2={x + 24} y2={g - 22} {...S('#9CA3AF', 13)} />
      <line x1={x + 24} y1={g - 22} x2={x + 22} y2={g - 8}  {...S('#C9D0D8', 11)} />
      <Shoe x={x + 22} y={g - 4} />
      <line x1={x + 8}  y1={g - 38} x2={x - 8}  y2={g - 28} {...S('#9CA3AF', 13)} />
      <line x1={x - 8}  y1={g - 28} x2={x - 12} y2={g - 42} {...S('#C9D0D8', 11)} />
    </g>
  );
}

/** Dynamic stretch — leg swing */
function FStretch({ x, g = 126, forward = false }: { x: number; g?: number; forward?: boolean }) {
  return (
    <g>
      <GShadow x={x - 6} g={g} rx={12} />
      <Head x={x - 6} y={g - 92} />
      <Torso x={x - 6} y={g - 84} w={32} h={24} />
      <line x1={x - 32} y1={g - 74} x2={x - 36} y2={g - 58} {...S('#7C3AED', 12)} />
      <line x1={x - 36} y1={g - 58} x2={x - 36} y2={g - 46} {...S('#9CA3AF', 10)} />
      <line x1={x + 20} y1={g - 74} x2={x + 24} y2={g - 58} {...S('#7C3AED', 12)} />
      <line x1={x + 24} y1={g - 58} x2={x + 24} y2={g - 46} {...S('#9CA3AF', 10)} />
      <Shorts x={x - 6} y={g - 59} w={28} h={13} />
      {/* planted leg */}
      <line x1={x - 12} y1={g - 46} x2={x - 12} y2={g - 26} {...S('#9CA3AF', 13)} />
      <line x1={x - 12} y1={g - 26} x2={x - 12} y2={g - 8}  {...S('#C9D0D8', 11)} />
      <Shoe x={x - 12} y={g - 3} flip />
      {/* swinging leg */}
      {forward ? (
        <>
          <line x1={x + 2} y1={g - 46} x2={x + 20} y2={g - 24} {...S('#9CA3AF', 13)} />
          <line x1={x + 20} y1={g - 24} x2={x + 28} y2={g - 12} {...S('#C9D0D8', 11)} />
          <Shoe x={x + 28} y={g - 7} />
        </>
      ) : (
        <>
          <line x1={x + 2} y1={g - 46} x2={x - 12} y2={g - 62} {...S('#9CA3AF', 13)} />
          <line x1={x - 12} y1={g - 62} x2={x - 16} y2={g - 50} {...S('#C9D0D8', 11)} />
        </>
      )}
    </g>
  );
}

/** Mountain climber — plank, knee drive */
function FMtnClimber({ x, g = 126, knee = false }: { x: number; g?: number; knee?: boolean }) {
  return (
    <g>
      <GShadow x={x + 10} g={g} rx={30} />
      <Head x={x - 30} y={g - 34} />
      <line x1={x - 22} y1={g - 28} x2={x + 28} y2={g - 20} {...S('#7C3AED', 20)} />
      <Shorts x={x + 20} y={g - 28} w={20} h={11} />
      {/* arms straight */}
      <line x1={x - 10} y1={g - 18} x2={x - 12} y2={g - 6} {...S('#7C3AED', 11)} />
      <line x1={x - 12} y1={g - 6} x2={x - 14} y2={g}       {...S('#9CA3AF', 9)} />
      <line x1={x + 10} y1={g - 12} x2={x + 10} y2={g}      {...S('#7C3AED', 11)} />
      {knee ? (
        <>
          {/* knee driven forward */}
          <line x1={x + 28} y1={g - 20} x2={x + 14} y2={g - 10} {...S('#9CA3AF', 12)} />
          <line x1={x + 14} y1={g - 10} x2={x + 8}  y2={g - 2}  {...S('#C9D0D8', 10)} />
          <Shoe x={x + 8}  y={g + 2} flip />
          {/* back leg straight */}
          <line x1={x + 32} y1={g - 18} x2={x + 46} y2={g - 8}  {...S('#9CA3AF', 12)} />
          <line x1={x + 46} y1={g - 8} x2={x + 50} y2={g}       {...S('#C9D0D8', 10)} />
          <Shoe x={x + 50} y={g + 2} />
        </>
      ) : (
        <>
          <line x1={x + 26} y1={g - 18} x2={x + 40} y2={g - 6}  {...S('#9CA3AF', 12)} />
          <line x1={x + 40} y1={g - 6} x2={x + 44} y2={g + 2}   {...S('#C9D0D8', 10)} />
          <Shoe x={x + 44} y={g + 4} />
          <line x1={x + 32} y1={g - 18} x2={x + 46} y2={g - 4}  {...S('#9CA3AF', 12)} />
          <line x1={x + 46} y1={g - 4} x2={x + 50} y2={g + 2}   {...S('#C9D0D8', 10)} />
          <Shoe x={x + 50} y={g + 4} />
        </>
      )}
    </g>
  );
}

// ─── TACTICAL FIELD COMPONENTS ────────────────────────────────────────────────

/** Full mini football pitch (top-down) */
function Field({ x = 0, y = 16, w = 296, h = 122 }: { x?: number; y?: number; w?: number; h?: number }) {
  const cx = x + w / 2, cy = y + h / 2;
  const pw = Math.round(w * 0.32), ph = Math.round(h * 0.52);
  const gw = Math.round(w * 0.12), gd = 4;
  return (
    <g>
      {/* pitch */}
      <rect x={x} y={y} width={w} height={h} fill="url(#fldg)" rx="3" />
      {/* stripes */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={x + i * w/5} y={y} width={w/5} height={h}
          fill={i%2===0 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.04)'} />
      ))}
      {/* outline */}
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      {/* center line */}
      <line x1={cx} y1={y + 4} x2={cx} y2={y + h - 4} stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      {/* center circle */}
      <circle cx={cx} cy={cy} r={Math.round(h * 0.18)} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={2.5} fill="white" />
      {/* penalty areas */}
      <rect x={x + 4} y={cy - ph/2} width={pw} height={ph} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <rect x={x + w - 4 - pw} y={cy - ph/2} width={pw} height={ph} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      {/* goal boxes */}
      <rect x={x + 4} y={cy - gw/2} width={gd * 3} height={gw} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <rect x={x + w - 4 - gd*3} y={cy - gw/2} width={gd*3} height={gw} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      {/* goals */}
      <rect x={x + 1} y={cy - gw/2} width={4} height={gw} fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
      <rect x={x + w - 5} y={cy - gw/2} width={4} height={gw} fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" />
    </g>
  );
}

const Dot = ({ x, y, c = '#F97316', r = 6 }: { x: number; y: number; c?: string; r?: number }) => (
  <>
    <circle cx={x} cy={y} r={r + 1} fill="rgba(0,0,0,0.3)" />
    <circle cx={x} cy={y} r={r} fill={c} />
    <circle cx={x} cy={y} r={r - 2} fill="rgba(255,255,255,0.25)" />
  </>
);

const FA = ({ x1, y1, x2, y2, c = O, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; c?: string; dashed?: boolean;
}) => {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  const ax = x2 - nx * 8, ay = y2 - ny * 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={c} strokeWidth="2"
        strokeLinecap="round" strokeDasharray={dashed ? '4,3' : undefined} />
      <polygon points={`${x2},${y2} ${ax - ny * 4},${ay + nx * 4} ${ax + ny * 4},${ay - nx * 4}`} fill={c} />
    </g>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ExerciseIllustration({ type }: { type: IllustrationType }) {
  const sv = { viewBox: '0 0 300 140', width: '100%', height: '100%' as const };

  const W = (a: React.ReactNode, b: React.ReactNode, la?: string, lb?: string) => (
    <svg {...sv}>
      <Defs />
      <rect width="300" height="140" fill={BLK} />
      <Lbl a={la} b={lb} />
      {a}
      <Arr />
      {b}
    </svg>
  );

  switch (type) {
    // ── Fuerza ──────────────────────────────────────────────────────────────
    case 'squat':
      return W(<FStand x={70} />, <FSquat x={230} />);
    case 'hip_thrust':
      return W(<FHipThrust x={70} up={false} />, <FHipThrust x={230} up />);
    case 'hip_hinge':
      return W(<FStand x={70} />, <FHipHinge x={230} />);
    case 'plank':
      return W(<FMtnClimber x={-20} />, <FPlank x={-20} />, 'POSICIÓN', 'PLANCHA');
    case 'bench_press':
      return W(<FBenchPress x={70} down />, <FBenchPress x={230} down={false} />);
    case 'shoulder_press':
      return W(<FShoulderPress x={70} up={false} />, <FShoulderPress x={230} up />);
    case 'row':
      return W(<FRow x={70} pulled={false} />, <FRow x={230} pulled />);
    case 'lunge':
      return W(<FStand x={70} />, <FLunge x={230} />);
    case 'pushup':
      return W(<FPushup x={-22} down />, <FPushup x={-22} down={false} />);
    case 'mountain_climber':
      return W(<FMtnClimber x={-20} />, <FMtnClimber x={-20} knee />, 'PLANCHA', 'RODILLA');
    case 'nordic_curl':
      return W(<FNordic x={70} />, <FNordic x={230} falling />);
    case 'cable_extension':
      return W(<FCable x={70} extended={false} />, <FCable x={70} extended />);
    case 'squat_jump':
      return W(<FJump x={70} prep />, <FJump x={230} />);

    // ── Resistencia / cardio ─────────────────────────────────────────────────
    case 'run':
      return W(<FStand x={70} />, <FRun x={230} />);
    case 'sprint':
      return W(<FRun x={70} />, <FRun x={230} fast />);
    case 'warmup_run':
      return W(<FStand x={70} />, <FRun x={230} />, 'PASO', 'TROTE');

    // ── Pliometría ────────────────────────────────────────────────────────────
    case 'jump_vertical':
      return W(<FJump x={70} prep />, <FJump x={230} />);
    case 'depth_jump':
      return W(<FDepthJump x={70} landing={false} />, <FDepthJump x={230} landing />);
    case 'jump_lateral':
      return W(<FStand x={70} />, <FLateralJump x={70} airborne />, 'INICIO', 'SALTO');
    case 'bounds':
      return W(<FBounds x={70} />, <FBounds x={230} extended />);
    case 'skipping':
      return W(<FSkipping x={70} left />, <FSkipping x={230} left={false} />);
    case 'hurdle_jump':
      return W(<FHurdle x={-4} over={false} />, <FHurdle x={-4} over />, 'INICIO', 'SALTO');
    case 'agility_ladder':
      return W(<FLadder x={70} out={false} />, <FLadder x={230} out />);
    case 'triple_jump':
      return W(<FBounds x={70} />, <FJump x={230} />);

    // ── Prevención ────────────────────────────────────────────────────────────
    case 'balance_single':
      return W(<FStand x={70} />, <FBalance x={230} />);
    case 'stretch_dynamic':
      return W(<FStretch x={70} forward={false} />, <FStretch x={230} forward />);
    case 'foam_roll':
      return W(<FStand x={70} />, <FFoamRoll x={70} />, 'INICIO', 'RODAR');
    case 'band_walk':
      return W(<FBandWalk x={70} stepped={false} />, <FBandWalk x={230} stepped />);
    case 'hip_mobility':
      return W(<FHipMob x={70} rotated={false} />, <FHipMob x={230} rotated />);
    case 'foot_activation':
      return W(<FFootAct x={70} flexed={false} />, <FFootAct x={230} flexed />);
    case 'copenhagen':
      return W(<FCopenhagen x={-30} up={false} />, <FCopenhagen x={-30} up />, 'CADERA ABAJO', 'CADERA ARRIBA');
    case 'ice_bath':
      return W(<FStand x={70} />, <FIceBath x={230} />, 'ANTES', 'CRIOTERAPIA');

    // ── Táctico ───────────────────────────────────────────────────────────────
    case 'field_rondo': {
      const cx = 150, cy = 76;
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">RONDO — POSESIÓN</text>
          {/* circle of orange players */}
          {[0,60,120,180,240,300].map((deg, i) => {
            const r = 28, rad = deg * Math.PI / 180;
            return <Dot key={i} x={cx + r * Math.cos(rad)} y={cy + r * Math.sin(rad)} c={O} />;
          })}
          {/* 2 blue defenders inside */}
          <Dot x={cx - 8} y={cy} c="#3B82F6" />
          <Dot x={cx + 8} y={cy} c="#3B82F6" />
          {/* passes */}
          <FA x1={cx - 28} y1={cy} x2={cx + 14} y2={cy - 24} dashed />
        </svg>
      );
    }
    case 'field_positions': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">POSICIONES — 4-3-3</text>
          {/* GK */}
          <Dot x={22} y={77} c="#22C55E" r={5} />
          {/* defence */}
          {[50,65,90].map((y, i) => <Dot key={i} x={60} y={y} c={O} r={5} />)}
          {/* midfield */}
          {[55,77,99].map((y, i) => <Dot key={i} x={100} y={y} c={O} r={5} />)}
          {/* attack */}
          {[48,77,106].map((y, i) => <Dot key={i} x={148} y={y} c={O} r={5} />)}
          {/* opponent */}
          {[48,77,106].map((y, i) => <Dot key={i} x={230} y={y} c="#3B82F6" r={5} />)}
        </svg>
      );
    }
    case 'field_2v1': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">2v1 — SUPERIORIDAD</text>
          <Dot x={80} y={60} c={O} />
          <Dot x={80} y={95} c={O} />
          <Dot x={150} y={77} c="#3B82F6" />
          <FA x1={88} y1={63} x2={148} y2={74} />
          <FA x1={88} y1={92} x2={145} y2={80} dashed />
          <FA x1={152} y1={76} x2={210} y2={66} c="#fff" />
        </svg>
      );
    }
    case 'field_transition': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">TRANSICIÓN ATAQUE</text>
          {[55,77,99].map((y, i) => <Dot key={i} x={80} y={y} c={O} />)}
          {[55,77,99].map((y, i) => <Dot key={i} x={180} y={y} c="#3B82F6" />)}
          <FA x1={88} y1={74} x2={178} y2={60} />
          <FA x1={88} y1={77} x2={178} y2={77} />
          <FA x1={88} y1={80} x2={178} y2={93} />
        </svg>
      );
    }
    case 'field_press': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">PRESSING ALTO</text>
          {[55,77,99].map((y, i) => <Dot key={i} x={200} y={y} c={O} />)}
          {[55,77,99].map((y, i) => <Dot key={i} x={240} y={y} c="#3B82F6" />)}
          <FA x1={192} y1={60} x2={234} y2={58} />
          <FA x1={192} y1={77} x2={234} y2={77} />
          <FA x1={192} y1={94} x2={234} y2={96} />
        </svg>
      );
    }
    case 'field_wide': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">JUEGO AMPLIO — BANDA</text>
          <Dot x={80} y={77} c={O} />
          <Dot x={80} y={28} c={O} />
          <Dot x={80} y={126} c={O} />
          <Dot x={140} y={77} c={O} />
          <FA x1={88} y1={77} x2={138} y2={77} />
          <FA x1={138} y1={74} x2={82} y2={31} dashed />
          <FA x1={138} y1={80} x2={82} y2={123} dashed />
        </svg>
      );
    }
    case 'field_counter': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">CONTRAATAQUE</text>
          <Dot x={80} y={77} c={O} />
          <Dot x={140} y={55} c={O} />
          <Dot x={140} y={99} c={O} />
          <Dot x={200} y={77} c={O} />
          <FA x1={88} y1={75} x2={138} y2={58} />
          <FA x1={146} y1={57} x2={198} y2={74} />
          <FA x1={88} y1={79} x2={138} y2={96} dashed />
        </svg>
      );
    }
    case 'field_corner': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">CÓRNER OFENSIVO</text>
          <Dot x={291} y={20} c={O} />
          {[55,77,99].map((y, i) => <Dot key={i} x={220} y={y} c={O} />)}
          {[55,99].map((y, i) => <Dot key={i} x={245} y={y} c="#3B82F6" />)}
          <FA x1={286} y1={24} x2={240} y2={58} dashed />
          <FA x1={222} y1={58} x2={222} y2={72} />
        </svg>
      );
    }
    case 'field_defensive': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">BLOQUE DEFENSIVO</text>
          {[30,55,77,99,124].map((y, i) => <Dot key={i} x={70} y={y} c={O} />)}
          {[40,77,114].map((y, i) => <Dot key={i} x={110} y={y} c={O} />)}
          {[55,77,99].map((y, i) => <Dot key={i} x={170} y={y} c="#3B82F6" />)}
          <FA x1={162} y1={60} x2={114} y2={42} />
          <FA x1={162} y1={77} x2={114} y2={77} />
        </svg>
      );
    }
    case 'field_buildup': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">CONSTRUCCIÓN DESDE ATRÁS</text>
          <Dot x={22} y={77} c="#22C55E" r={5} />
          <Dot x={55} y={55} c={O} />
          <Dot x={55} y={99} c={O} />
          <Dot x={100} y={77} c={O} />
          <Dot x={150} y={55} c={O} />
          <Dot x={150} y={99} c={O} />
          <FA x1={27} y1={74} x2={52} y2={58} />
          <FA x1={57} y1={57} x2={98} y2={74} />
          <FA x1={102} y1={75} x2={148} y2={58} />
        </svg>
      );
    }
    case 'field_ssg': {
      return (
        <svg {...sv}><Defs />
          <rect width="300" height="140" fill={BLK} />
          <Field />
          <text x="150" y="13" fill="#F97316" fontSize="8" fontFamily="system-ui" textAnchor="middle">PEQUEÑO ESPACIO — SSG 4v4</text>
          {[50,77,104].map((y, i) => <Dot key={i} x={100} y={y} c={O} />)}
          <Dot x={80} y={77} c={O} />
          {[50,77,104].map((y, i) => <Dot key={i} x={200} y={y} c="#3B82F6" />)}
          <Dot x={220} y={77} c="#3B82F6" />
          <FA x1={108} y1={74} x2={198} y2={60} />
          <FA x1={85} y1={77} x2={198} y2={77} dashed />
        </svg>
      );
    }

    default:
      return W(<FStand x={70} />, <FStand x={230} />);
  }
}
