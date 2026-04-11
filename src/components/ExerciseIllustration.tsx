import type { IllustrationType } from '../constants/training';

// ─── Color palette matching the coach character ───────────────────────────────
const P   = '#7C3AED'; // purple  — shirt & shoes
const DP  = '#4C1D95'; // dark purple — shorts
const G   = '#9CA3AF'; // gray — skin
const LG  = '#D1D5DB'; // light gray — shins
const O   = '#F97316'; // orange — arrows / accents
const GF  = '#14532D'; // dark green — field
const GFL = '#166534'; // lighter green — field alt
const FW  = '#ffffff'; // white — field lines
const BLK = '#0f0f0f'; // card background

// ─── SVG helpers ─────────────────────────────────────────────────────────────
const lp = (c: string, w: number) => ({
  stroke: c,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  fill: 'none',
});

// Arrow between Frame A and Frame B
function Arr() {
  return (
    <g>
      <line x1="141" y1="70" x2="155" y2="70" stroke={O} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="151,65 161,70 151,75" fill={O} />
    </g>
  );
}

// Frame labels
function Lbl({ a = 'INICIO', b = 'EJECUCIÓN' }: { a?: string; b?: string }) {
  const t = { fill: '#4B5563', fontSize: 8, fontFamily: 'system-ui,sans-serif', textAnchor: 'middle' as const };
  return (
    <>
      <text x="70" y="13" {...t}>{a}</text>
      <text x="230" y="13" {...t}>{b}</text>
    </>
  );
}

// ─── FIGURE COMPONENTS ────────────────────────────────────────────────────────
// All figures use cx (center-x) and g (ground-y, default 128)

/** Standing upright — front view */
function FStand({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      {/* torso */}
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      {/* arms */}
      <line x1={x - 22} y1={g - 71} x2={x - 24} y2={g - 55} {...lp(P, 10)} />
      <line x1={x - 24} y1={g - 55} x2={x - 24} y2={g - 43} {...lp(G, 9)} />
      <line x1={x + 22} y1={g - 71} x2={x + 24} y2={g - 55} {...lp(P, 10)} />
      <line x1={x + 24} y1={g - 55} x2={x + 24} y2={g - 43} {...lp(G, 9)} />
      {/* shorts */}
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      {/* legs */}
      <line x1={x - 9} y1={g - 45} x2={x - 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 45} x2={x + 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 9} y1={g - 27} x2={x - 8} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x + 9} y1={g - 27} x2={x + 10} y2={g - 13} {...lp(LG, 10)} />
      {/* shoes */}
      <line x1={x - 17} y1={g - 6} x2={x - 2} y2={g - 6} {...lp(P, 7)} />
      <line x1={x + 2}  y1={g - 6} x2={x + 17} y2={g - 6} {...lp(P, 7)} />
    </g>
  );
}

/** Squat bottom — front view, wide stance */
function FSquat({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 65} rx={11} ry={10} fill={G} />
      <rect x={x - 16} y={g - 55} width={32} height={21} rx={5} fill={P} />
      <ellipse cx={x - 19} cy={g - 48} rx={7} ry={6} fill={P} />
      <ellipse cx={x + 19} cy={g - 48} rx={7} ry={6} fill={P} />
      {/* arms forward */}
      <line x1={x - 19} y1={g - 44} x2={x - 38} y2={g - 47} {...lp(P, 10)} />
      <line x1={x - 38} y1={g - 47} x2={x - 46} y2={g - 44} {...lp(G, 9)} />
      <line x1={x + 19} y1={g - 44} x2={x + 38} y2={g - 47} {...lp(P, 10)} />
      <line x1={x + 38} y1={g - 47} x2={x + 46} y2={g - 44} {...lp(G, 9)} />
      <rect x={x - 14} y={g - 34} width={28} height={12} rx={4} fill={DP} />
      {/* thighs wide */}
      <line x1={x - 9} y1={g - 34} x2={x - 29} y2={g - 16} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 34} x2={x + 29} y2={g - 16} {...lp(G, 11)} />
      {/* shins */}
      <line x1={x - 29} y1={g - 16} x2={x - 21} y2={g - 2} {...lp(LG, 10)} />
      <line x1={x + 29} y1={g - 16} x2={x + 21} y2={g - 2} {...lp(LG, 10)} />
      {/* shoes wide */}
      <line x1={x - 30} y1={g + 3} x2={x - 15} y2={g + 3} {...lp(P, 7)} />
      <line x1={x + 15} y1={g + 3} x2={x + 30} y2={g + 3} {...lp(P, 7)} />
    </g>
  );
}

/** Jump — arms overhead, feet off ground */
function FJump({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 110} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 100} width={34} height={22} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 94} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 94} rx={8} ry={6} fill={P} />
      {/* arms overhead */}
      <line x1={x - 21} y1={g - 94} x2={x - 16} y2={g - 116} {...lp(P, 10)} />
      <line x1={x - 16} y1={g - 116} x2={x - 12} y2={g - 128} {...lp(G, 9)} />
      <line x1={x + 21} y1={g - 94} x2={x + 16} y2={g - 116} {...lp(P, 10)} />
      <line x1={x + 16} y1={g - 116} x2={x + 12} y2={g - 128} {...lp(G, 9)} />
      <rect x={x - 15} y={g - 78} width={30} height={13} rx={4} fill={DP} />
      {/* legs slightly bent in air */}
      <line x1={x - 9} y1={g - 65} x2={x - 12} y2={g - 50} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 65} x2={x + 12} y2={g - 50} {...lp(G, 11)} />
      <line x1={x - 12} y1={g - 50} x2={x - 10} y2={g - 36} {...lp(LG, 10)} />
      <line x1={x + 12} y1={g - 50} x2={x + 10} y2={g - 36} {...lp(LG, 10)} />
      {/* feet */}
      <line x1={x - 17} y1={g - 29} x2={x - 3} y2={g - 29} {...lp(P, 7)} />
      <line x1={x + 3}  y1={g - 29} x2={x + 17} y2={g - 29} {...lp(P, 7)} />
    </g>
  );
}

/** Lunge step — front view */
function FLunge({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x - 5} cy={g - 88} rx={11} ry={10} fill={G} />
      <rect x={x - 22} y={g - 78} width={34} height={22} rx={5} fill={P} />
      <ellipse cx={x - 26} cy={g - 72} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 12} cy={g - 72} rx={8} ry={6} fill={P} />
      <line x1={x - 26} y1={g - 67} x2={x - 30} y2={g - 53} {...lp(P, 10)} />
      <line x1={x - 30} y1={g - 53} x2={x - 32} y2={g - 41} {...lp(G, 9)} />
      <line x1={x + 12} y1={g - 67} x2={x + 16} y2={g - 53} {...lp(P, 10)} />
      <line x1={x + 16} y1={g - 53} x2={x + 18} y2={g - 41} {...lp(G, 9)} />
      <rect x={x - 21} y={g - 56} width={30} height={13} rx={4} fill={DP} />
      {/* front leg — straight */}
      <line x1={x - 14} y1={g - 43} x2={x - 14} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 14} y1={g - 27} x2={x - 14} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 21} y1={g - 6} x2={x - 7} y2={g - 6} {...lp(P, 7)} />
      {/* back leg — deep step */}
      <line x1={x + 6} y1={g - 43} x2={x + 24} y2={g - 22} {...lp(G, 11)} />
      <line x1={x + 24} y1={g - 22} x2={x + 26} y2={g - 6} {...lp(LG, 10)} />
      <line x1={x + 18} y1={g - 1} x2={x + 33} y2={g - 1} {...lp(P, 7)} />
    </g>
  );
}

/** Shoulder press — arms up overhead */
function FShoulderPressUp({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      {/* arms straight up */}
      <line x1={x - 21} y1={g - 76} x2={x - 18} y2={g - 96} {...lp(P, 10)} />
      <line x1={x - 18} y1={g - 96} x2={x - 15} y2={g - 111} {...lp(G, 9)} />
      <line x1={x + 21} y1={g - 76} x2={x + 18} y2={g - 96} {...lp(P, 10)} />
      <line x1={x + 18} y1={g - 96} x2={x + 15} y2={g - 111} {...lp(G, 9)} />
      {/* bar */}
      <line x1={x - 22} y1={g - 114} x2={x + 22} y2={g - 114} {...lp('#888', 4)} />
      <ellipse cx={x - 22} cy={g - 114} rx={5} ry={5} fill="#555" />
      <ellipse cx={x + 22} cy={g - 114} rx={5} ry={5} fill="#555" />
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      <line x1={x - 9} y1={g - 45} x2={x - 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 45} x2={x + 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 9} y1={g - 27} x2={x - 8} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x + 9} y1={g - 27} x2={x + 10} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 17} y1={g - 6} x2={x - 2} y2={g - 6} {...lp(P, 7)} />
      <line x1={x + 2}  y1={g - 6} x2={x + 17} y2={g - 6} {...lp(P, 7)} />
    </g>
  );
}

/** Shoulder press — arms at shoulder level (start) */
function FShoulderPressStart({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      {/* arms bent at shoulder level */}
      <line x1={x - 21} y1={g - 76} x2={x - 28} y2={g - 68} {...lp(P, 10)} />
      <line x1={x - 28} y1={g - 68} x2={x - 26} y2={g - 84} {...lp(G, 9)} />
      <line x1={x + 21} y1={g - 76} x2={x + 28} y2={g - 68} {...lp(P, 10)} />
      <line x1={x + 28} y1={g - 68} x2={x + 26} y2={g - 84} {...lp(G, 9)} />
      {/* bar at shoulder height */}
      <line x1={x - 32} y1={g - 86} x2={x + 32} y2={g - 86} {...lp('#888', 4)} />
      <ellipse cx={x - 32} cy={g - 86} rx={5} ry={5} fill="#555" />
      <ellipse cx={x + 32} cy={g - 86} rx={5} ry={5} fill="#555" />
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      <line x1={x - 9} y1={g - 45} x2={x - 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 45} x2={x + 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 9} y1={g - 27} x2={x - 8} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x + 9} y1={g - 27} x2={x + 10} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 17} y1={g - 6} x2={x - 2} y2={g - 6} {...lp(P, 7)} />
      <line x1={x + 2}  y1={g - 6} x2={x + 17} y2={g - 6} {...lp(P, 7)} />
    </g>
  );
}

/** Running stride — side profile facing right */
function FRun({ x, g = 128, flipped = false }: { x: number; g?: number; flipped?: boolean }) {
  const d = flipped ? -1 : 1;
  return (
    <g>
      {/* head */}
      <ellipse cx={x + d * 6} cy={g - 90} rx={10} ry={10} fill={G} />
      {/* torso slightly forward */}
      <line x1={x + d * 5} y1={g - 80} x2={x - d * 2} y2={g - 57} {...lp(P, 18)} />
      {/* shorts */}
      <line x1={x - d * 3} y1={g - 57} x2={x - d * 6} y2={g - 44} {...lp(DP, 18)} />
      {/* arms swing */}
      <line x1={x - d * 2} y1={g - 73} x2={x - d * 18} y2={g - 57} {...lp(P, 9)} />
      <line x1={x - d * 18} y1={g - 57} x2={x - d * 24} y2={g - 46} {...lp(G, 8)} />
      <line x1={x - d * 2} y1={g - 73} x2={x + d * 14} y2={g - 84} {...lp(P, 9)} />
      <line x1={x + d * 14} y1={g - 84} x2={x + d * 18} y2={g - 76} {...lp(G, 8)} />
      {/* front leg */}
      <line x1={x - d * 6} y1={g - 44} x2={x + d * 14} y2={g - 22} {...lp(G, 11)} />
      <line x1={x + d * 14} y1={g - 22} x2={x + d * 10} y2={g - 4} {...lp(LG, 10)} />
      <line x1={x + d * 3} y1={g + 1} x2={x + d * 17} y2={g + 1} {...lp(P, 7)} />
      {/* back leg lifted */}
      <line x1={x - d * 6} y1={g - 44} x2={x - d * 20} y2={g - 26} {...lp(G, 11)} />
      <line x1={x - d * 20} y1={g - 26} x2={x - d * 28} y2={g - 40} {...lp(LG, 10)} />
      <line x1={x - d * 35} y1={g - 37} x2={x - d * 22} y2={g - 37} {...lp(P, 7)} />
    </g>
  );
}

/** Sprint — explosive start, forward lean */
function FSprint({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x + 10} cy={g - 84} rx={10} ry={10} fill={G} />
      {/* torso very forward */}
      <line x1={x + 8} y1={g - 74} x2={x - 8} y2={g - 52} {...lp(P, 18)} />
      <line x1={x - 9} y1={g - 52} x2={x - 12} y2={g - 39} {...lp(DP, 18)} />
      {/* arms pumping */}
      <line x1={x - 2} y1={g - 67} x2={x - 20} y2={g - 52} {...lp(P, 9)} />
      <line x1={x - 20} y1={g - 52} x2={x - 28} y2={g - 43} {...lp(G, 8)} />
      <line x1={x - 2} y1={g - 67} x2={x + 18} y2={g - 75} {...lp(P, 9)} />
      <line x1={x + 18} y1={g - 75} x2={x + 22} y2={g - 66} {...lp(G, 8)} />
      {/* stride */}
      <line x1={x - 12} y1={g - 39} x2={x + 14} y2={g - 16} {...lp(G, 11)} />
      <line x1={x + 14} y1={g - 16} x2={x + 10} y2={g - 2} {...lp(LG, 10)} />
      <line x1={x + 2} y1={g + 3} x2={x + 18} y2={g + 3} {...lp(P, 7)} />
      <line x1={x - 12} y1={g - 39} x2={x - 28} y2={g - 22} {...lp(G, 11)} />
      <line x1={x - 28} y1={g - 22} x2={x - 34} y2={g - 35} {...lp(LG, 10)} />
      <line x1={x - 40} y1={g - 32} x2={x - 27} y2={g - 32} {...lp(P, 7)} />
    </g>
  );
}

/** Hip hinge — bent at hips 90°, side profile */
function FHipHinge({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* head profile */}
      <ellipse cx={x - 28} cy={g - 57} rx={10} ry={10} fill={G} />
      {/* torso horizontal */}
      <line x1={x - 22} y1={g - 55} x2={x + 18} y2={g - 55} {...lp(P, 16)} />
      {/* hip area */}
      <ellipse cx={x + 18} cy={g - 48} rx={9} ry={9} fill={DP} />
      {/* arms hanging */}
      <line x1={x - 8} y1={g - 50} x2={x - 8} y2={g - 30} {...lp(P, 9)} />
      <line x1={x - 8} y1={g - 30} x2={x - 8} y2={g - 16} {...lp(G, 8)} />
      {/* bar */}
      <line x1={x - 14} y1={g - 15} x2={x - 2} y2={g - 15} {...lp('#888', 4)} />
      {/* legs straight */}
      <line x1={x + 16} y1={g - 42} x2={x + 14} y2={g - 24} {...lp(G, 11)} />
      <line x1={x + 14} y1={g - 24} x2={x + 13} y2={g - 10} {...lp(LG, 10)} />
      <line x1={x + 6} y1={g - 4} x2={x + 21} y2={g - 4} {...lp(P, 7)} />
      {/* second leg slightly behind */}
      <line x1={x + 20} y1={g - 42} x2={x + 19} y2={g - 24} {...lp(G, 9)} />
      <line x1={x + 19} y1={g - 24} x2={x + 18} y2={g - 10} {...lp(LG, 9)} />
    </g>
  );
}

/** Row — bent over, arms pulled (profile) */
function FRowPull({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x - 26} cy={g - 62} rx={10} ry={10} fill={G} />
      {/* torso bent ~45° */}
      <line x1={x - 20} y1={g - 60} x2={x + 14} y2={g - 50} {...lp(P, 16)} />
      <ellipse cx={x + 14} cy={g - 43} rx={9} ry={9} fill={DP} />
      {/* arms pulled up to torso */}
      <line x1={x - 8} y1={g - 56} x2={x - 2} y2={g - 42} {...lp(P, 9)} />
      <line x1={x - 2} y1={g - 42} x2={x + 6} y2={g - 38} {...lp(G, 8)} />
      {/* bar near torso */}
      <line x1={x + 3} y1={g - 37} x2={x + 14} y2={g - 37} {...lp('#888', 4)} />
      {/* legs */}
      <line x1={x + 12} y1={g - 37} x2={x + 10} y2={g - 20} {...lp(G, 11)} />
      <line x1={x + 10} y1={g - 20} x2={x + 9} y2={g - 6} {...lp(LG, 10)} />
      <line x1={x + 2} y1={g - 1} x2={x + 17} y2={g - 1} {...lp(P, 7)} />
      <line x1={x + 16} y1={g - 37} x2={x + 15} y2={g - 20} {...lp(G, 9)} />
      <line x1={x + 15} y1={g - 20} x2={x + 14} y2={g - 6} {...lp(LG, 9)} />
    </g>
  );
}

/** Row — bent over, arms extended down */
function FRowExtend({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x - 26} cy={g - 62} rx={10} ry={10} fill={G} />
      <line x1={x - 20} y1={g - 60} x2={x + 14} y2={g - 50} {...lp(P, 16)} />
      <ellipse cx={x + 14} cy={g - 43} rx={9} ry={9} fill={DP} />
      {/* arms extended down */}
      <line x1={x - 8} y1={g - 56} x2={x - 10} y2={g - 36} {...lp(P, 9)} />
      <line x1={x - 10} y1={g - 36} x2={x - 8} y2={g - 20} {...lp(G, 8)} />
      <line x1={x - 11} y1={g - 19} x2={x + 2} y2={g - 19} {...lp('#888', 4)} />
      <line x1={x + 12} y1={g - 37} x2={x + 10} y2={g - 20} {...lp(G, 11)} />
      <line x1={x + 10} y1={g - 20} x2={x + 9} y2={g - 6} {...lp(LG, 10)} />
      <line x1={x + 2} y1={g - 1} x2={x + 17} y2={g - 1} {...lp(P, 7)} />
      <line x1={x + 16} y1={g - 37} x2={x + 15} y2={g - 20} {...lp(G, 9)} />
      <line x1={x + 15} y1={g - 20} x2={x + 14} y2={g - 6} {...lp(LG, 9)} />
    </g>
  );
}

/** Plank — side view, high plank on hands */
function FPlank({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* head */}
      <ellipse cx={x - 38} cy={g - 52} rx={10} ry={10} fill={G} />
      {/* body horizontal */}
      <line x1={x - 30} y1={g - 46} x2={x + 30} y2={g - 46} {...lp(P, 16)} />
      {/* hips */}
      <rect x={x + 22} y={g - 53} width={16} height={14} rx={4} fill={DP} />
      {/* arms straight (hands on ground) */}
      <line x1={x - 22} y1={g - 46} x2={x - 22} y2={g - 28} {...lp(P, 10)} />
      <line x1={x - 22} y1={g - 28} x2={x - 22} y2={g - 16} {...lp(G, 9)} />
      {/* legs straight horizontal */}
      <line x1={x + 30} y1={g - 44} x2={x + 56} y2={g - 43} {...lp(G, 11)} />
      <line x1={x + 56} y1={g - 43} x2={x + 60} y2={g - 30} {...lp(LG, 10)} />
      {/* foot */}
      <line x1={x + 56} y1={g - 22} x2={x + 64} y2={g - 22} {...lp(P, 7)} />
      {/* ground */}
      <line x1={x - 30} y1={g - 12} x2={x + 70} y2={g - 12} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Pushup down — elbows bent */
function FPushupDown({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x - 38} cy={g - 34} rx={10} ry={10} fill={G} />
      <line x1={x - 30} y1={g - 30} x2={x + 30} y2={g - 30} {...lp(P, 16)} />
      <rect x={x + 22} y={g - 37} width={16} height={14} rx={4} fill={DP} />
      {/* arms bent — lower */}
      <line x1={x - 22} y1={g - 30} x2={x - 30} y2={g - 20} {...lp(P, 10)} />
      <line x1={x - 30} y1={g - 20} x2={x - 22} y2={g - 14} {...lp(G, 9)} />
      <line x1={x + 56} y1={g - 28} x2={x + 60} y2={g - 18} {...lp(LG, 10)} />
      <line x1={x + 56} y1={g - 28} x2={x + 56} y2={g - 28} {...lp(G, 11)} />
      <line x1={x + 30} y1={g - 28} x2={x + 56} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 56} y1={g - 27} x2={x + 60} y2={g - 14} {...lp(LG, 10)} />
      <line x1={x + 52} y1={g - 8} x2={x + 66} y2={g - 8} {...lp(P, 7)} />
      <line x1={x - 30} y1={g - 8} x2={x + 66} y2={g - 8} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Hip Thrust — lying on back, hips UP (side profile) */
function FHipThrustUp({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* bench */}
      <rect x={x - 58} y={g - 42} width={30} height={10} rx={3} fill="#333" />
      {/* head on bench */}
      <ellipse cx={x - 46} cy={g - 52} rx={10} ry={9} fill={G} />
      {/* torso diagonal up */}
      <line x1={x - 40} y1={g - 44} x2={x + 4} y2={g - 64} {...lp(P, 16)} />
      {/* hips high */}
      <rect x={x} y={g - 72} width={18} height={14} rx={4} fill={DP} />
      {/* bar */}
      <line x1={x - 8} y1={g - 67} x2={x + 24} y2={g - 67} {...lp('#888', 5)} />
      {/* thigh going down */}
      <line x1={x + 10} y1={g - 58} x2={x + 38} y2={g - 32} {...lp(G, 11)} />
      {/* shin vertical */}
      <line x1={x + 38} y1={g - 32} x2={x + 38} y2={g - 8} {...lp(LG, 10)} />
      {/* foot */}
      <line x1={x + 30} y1={g - 3} x2={x + 47} y2={g - 3} {...lp(P, 7)} />
      {/* ground */}
      <line x1={x - 65} y1={g - 2} x2={x + 55} y2={g - 2} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Hip Thrust — hips DOWN (start position) */
function FHipThrustDown({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <rect x={x - 58} y={g - 42} width={30} height={10} rx={3} fill="#333" />
      <ellipse cx={x - 46} cy={g - 52} rx={10} ry={9} fill={G} />
      {/* torso low, nearly flat */}
      <line x1={x - 40} y1={g - 44} x2={x + 4} y2={g - 35} {...lp(P, 16)} />
      <rect x={x} y={g - 42} width={18} height={14} rx={4} fill={DP} />
      <line x1={x - 8} y1={g - 36} x2={x + 24} y2={g - 36} {...lp('#888', 5)} />
      {/* thigh angled */}
      <line x1={x + 10} y1={g - 30} x2={x + 34} y2={g - 15} {...lp(G, 11)} />
      <line x1={x + 34} y1={g - 15} x2={x + 36} y2={g - 3} {...lp(LG, 10)} />
      <line x1={x + 28} y1={g + 2} x2={x + 45} y2={g + 2} {...lp(P, 7)} />
      <line x1={x - 65} y1={g + 2} x2={x + 55} y2={g + 2} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Bench Press — lying, arms extended */
function FBenchExtend({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* bench */}
      <rect x={x - 55} y={g - 32} width={110} height={10} rx={3} fill="#333" />
      {/* body lying */}
      <ellipse cx={x - 42} cy={g - 44} rx={10} ry={9} fill={G} />
      <line x1={x - 35} y1={g - 38} x2={x + 20} y2={g - 36} {...lp(P, 16)} />
      <rect x={x + 14} y={g - 42} width={20} height={14} rx={4} fill={DP} />
      {/* legs bent off bench */}
      <line x1={x + 28} y1={g - 34} x2={x + 44} y2={g - 18} {...lp(G, 11)} />
      <line x1={x + 44} y1={g - 18} x2={x + 44} y2={g - 4} {...lp(LG, 10)} />
      <line x1={x + 37} y1={g + 1} x2={x + 52} y2={g + 1} {...lp(P, 7)} />
      {/* arms pushing up */}
      <line x1={x - 10} y1={g - 38} x2={x - 10} y2={g - 62} {...lp(P, 10)} />
      <line x1={x - 10} y1={g - 62} x2={x - 10} y2={g - 76} {...lp(G, 9)} />
      {/* bar */}
      <line x1={x - 24} y1={g - 78} x2={x + 4} y2={g - 78} {...lp('#888', 4)} />
      <ellipse cx={x - 24} cy={g - 78} rx={5} ry={5} fill="#555" />
      <ellipse cx={x + 4} cy={g - 78} rx={5} ry={5} fill="#555" />
    </g>
  );
}

/** Bench Press — arms bent (chest) */
function FBenchBent({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <rect x={x - 55} y={g - 32} width={110} height={10} rx={3} fill="#333" />
      <ellipse cx={x - 42} cy={g - 44} rx={10} ry={9} fill={G} />
      <line x1={x - 35} y1={g - 38} x2={x + 20} y2={g - 36} {...lp(P, 16)} />
      <rect x={x + 14} y={g - 42} width={20} height={14} rx={4} fill={DP} />
      <line x1={x + 28} y1={g - 34} x2={x + 44} y2={g - 18} {...lp(G, 11)} />
      <line x1={x + 44} y1={g - 18} x2={x + 44} y2={g - 4} {...lp(LG, 10)} />
      <line x1={x + 37} y1={g + 1} x2={x + 52} y2={g + 1} {...lp(P, 7)} />
      {/* arms bent — bar at chest */}
      <line x1={x - 10} y1={g - 38} x2={x - 22} y2={g - 52} {...lp(P, 10)} />
      <line x1={x - 22} y1={g - 52} x2={x - 14} y2={g - 60} {...lp(G, 9)} />
      <line x1={x - 20} y1={g - 61} x2={x + 2} y2={g - 61} {...lp('#888', 4)} />
      <ellipse cx={x - 20} cy={g - 61} rx={5} ry={5} fill="#555" />
      <ellipse cx={x + 2} cy={g - 61} rx={5} ry={5} fill="#555" />
    </g>
  );
}

/** Mountain climber — plank + knee forward */
function FMtnClimber({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x - 38} cy={g - 52} rx={10} ry={10} fill={G} />
      <line x1={x - 30} y1={g - 46} x2={x + 25} y2={g - 44} {...lp(P, 16)} />
      <rect x={x + 18} y={g - 51} width={16} height={14} rx={4} fill={DP} />
      <line x1={x - 22} y1={g - 46} x2={x - 22} y2={g - 28} {...lp(P, 10)} />
      <line x1={x - 22} y1={g - 28} x2={x - 22} y2={g - 16} {...lp(G, 9)} />
      {/* front knee pulled to chest */}
      <line x1={x + 28} y1={g - 42} x2={x + 10} y2={g - 32} {...lp(G, 11)} />
      <line x1={x + 10} y1={g - 32} x2={x + 14} y2={g - 20} {...lp(LG, 10)} />
      {/* back leg extended */}
      <line x1={x + 28} y1={g - 42} x2={x + 56} y2={g - 40} {...lp(G, 11)} />
      <line x1={x + 56} y1={g - 40} x2={x + 62} y2={g - 26} {...lp(LG, 10)} />
      <line x1={x + 55} y1={g - 19} x2={x + 69} y2={g - 19} {...lp(P, 7)} />
      <line x1={x - 30} y1={g - 10} x2={x + 70} y2={g - 10} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Nordic curl — kneeling, falling forward */
function FNordicFall({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* kneeling, body at 45° forward */}
      <ellipse cx={x - 16} cy={g - 74} rx={10} ry={10} fill={G} />
      {/* torso angled forward */}
      <line x1={x - 10} y1={g - 65} x2={x + 22} y2={g - 44} {...lp(P, 16)} />
      <rect x={x + 16} y={g - 50} width={18} height={12} rx={4} fill={DP} />
      {/* arms reaching forward */}
      <line x1={x + 2} y1={g - 58} x2={x - 14} y2={g - 48} {...lp(P, 10)} />
      <line x1={x - 14} y1={g - 48} x2={x - 24} y2={g - 42} {...lp(G, 9)} />
      <line x1={x + 10} y1={g - 58} x2={x - 2} y2={g - 48} {...lp(P, 10)} />
      {/* thighs vertical (kneeling) */}
      <line x1={x + 22} y1={g - 40} x2={x + 20} y2={g - 18} {...lp(G, 11)} />
      <line x1={x + 28} y1={g - 40} x2={x + 26} y2={g - 18} {...lp(G, 10)} />
      {/* shins on floor */}
      <line x1={x + 10} y1={g - 16} x2={x + 38} y2={g - 16} {...lp(LG, 10)} />
      <line x1={x + 10} y1={g - 8} x2={x + 38} y2={g - 8} {...lp(P, 7)} />
    </g>
  );
}

/** Nordic — kneeling upright (start) */
function FNordicUpright({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 88} rx={10} ry={10} fill={G} />
      <line x1={x} y1={g - 78} x2={x} y2={g - 56} {...lp(P, 18)} />
      <rect x={x - 12} y={g - 56} width={24} height={12} rx={4} fill={DP} />
      {/* arms at sides */}
      <line x1={x - 14} y1={g - 74} x2={x - 18} y2={g - 56} {...lp(P, 10)} />
      <line x1={x - 18} y1={g - 56} x2={x - 18} y2={g - 44} {...lp(G, 9)} />
      <line x1={x + 14} y1={g - 74} x2={x + 18} y2={g - 56} {...lp(P, 10)} />
      <line x1={x + 18} y1={g - 56} x2={x + 18} y2={g - 44} {...lp(G, 9)} />
      {/* thighs vertical */}
      <line x1={x - 8} y1={g - 44} x2={x - 8} y2={g - 20} {...lp(G, 11)} />
      <line x1={x + 8} y1={g - 44} x2={x + 8} y2={g - 20} {...lp(G, 11)} />
      {/* shins on floor */}
      <line x1={x - 20} y1={g - 18} x2={x + 20} y2={g - 18} {...lp(LG, 10)} />
      <line x1={x - 20} y1={g - 8} x2={x + 20} y2={g - 8} {...lp(P, 7)} />
    </g>
  );
}

/** Cable extension — standing, leg back */
function FCableExtend({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      <ellipse cx={x + 4} cy={g - 91} rx={10} ry={10} fill={G} />
      <rect x={x - 13} y={g - 81} width={34} height={23} rx={5} fill={P} />
      <ellipse cx={x - 17} cy={g - 74} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 74} rx={8} ry={6} fill={P} />
      <line x1={x - 18} y1={g - 69} x2={x - 22} y2={g - 53} {...lp(P, 10)} />
      <line x1={x - 22} y1={g - 53} x2={x - 22} y2={g - 41} {...lp(G, 9)} />
      <line x1={x + 22} y1={g - 69} x2={x + 26} y2={g - 53} {...lp(P, 10)} />
      <line x1={x + 26} y1={g - 53} x2={x + 26} y2={g - 41} {...lp(G, 9)} />
      <rect x={x - 12} y={g - 58} width={30} height={13} rx={4} fill={DP} />
      {/* standing leg */}
      <line x1={x - 4} y1={g - 45} x2={x - 4} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 4} y1={g - 27} x2={x - 4} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 12} y1={g - 6} x2={x + 4} y2={g - 6} {...lp(P, 7)} />
      {/* extended leg behind */}
      <line x1={x + 12} y1={g - 45} x2={x + 28} y2={g - 58} {...lp(G, 11)} />
      <line x1={x + 28} y1={g - 58} x2={x + 38} y2={g - 56} {...lp(LG, 10)} />
      <line x1={x + 30} y1={g - 50} x2={x + 45} y2={g - 50} {...lp(P, 7)} />
      {/* cable */}
      <line x1={x + 35} y1={g - 50} x2={x + 52} y2={g - 50} stroke="#666" strokeWidth="2" />
      <rect x={x + 50} y={g - 60} width={8} height={20} rx={2} fill="#555" />
    </g>
  );
}

/** Balance single leg */
function FBalance({ x, g = 128, oneLeg = false }: { x: number; g?: number; oneLeg?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <line x1={x - 22} y1={g - 71} x2={x - 28} y2={g - 55} {...lp(P, 10)} />
      <line x1={x - 28} y1={g - 55} x2={x - 26} y2={g - 43} {...lp(G, 9)} />
      <line x1={x + 22} y1={g - 71} x2={x + 28} y2={g - 55} {...lp(P, 10)} />
      <line x1={x + 28} y1={g - 55} x2={x + 26} y2={g - 43} {...lp(G, 9)} />
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      {/* standing leg */}
      <line x1={x - 4} y1={g - 45} x2={x - 4} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 4} y1={g - 27} x2={x - 4} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 12} y1={g - 6} x2={x + 4} y2={g - 6} {...lp(P, 7)} />
      {oneLeg ? (
        /* raised leg bent */
        <>
          <line x1={x + 10} y1={g - 45} x2={x + 24} y2={g - 30} {...lp(G, 11)} />
          <line x1={x + 24} y1={g - 30} x2={x + 16} y2={g - 18} {...lp(LG, 10)} />
        </>
      ) : (
        /* second leg down */
        <>
          <line x1={x + 10} y1={g - 45} x2={x + 10} y2={g - 27} {...lp(G, 11)} />
          <line x1={x + 10} y1={g - 27} x2={x + 10} y2={g - 13} {...lp(LG, 10)} />
          <line x1={x + 2} y1={g - 6} x2={x + 18} y2={g - 6} {...lp(P, 7)} />
        </>
      )}
    </g>
  );
}

/** Foam Roll — lying on side on roller */
function FFoamRoll({ x, g = 128, rolling = false }: { x: number; g?: number; rolling?: boolean }) {
  const offset = rolling ? 8 : 0;
  return (
    <g>
      {/* roller */}
      <ellipse cx={x} cy={g - 22} rx={30} ry={12} fill="#444" />
      {/* body on roller - lying sideways profile */}
      <ellipse cx={x - 34} cy={g - 38} rx={10} ry={10} fill={G} />
      {/* torso */}
      <line x1={x - 26} y1={g - 35} x2={x + 16} y2={g - 32} {...lp(P, 15)} />
      <rect x={x + 10} y={g - 39} width={18} height={12} rx={4} fill={DP} />
      {/* legs extended */}
      <line x1={x + 20} y1={g - 30} x2={x + 44 + offset} y2={g - 28} {...lp(G, 11)} />
      <line x1={x + 44 + offset} y1={g - 28} x2={x + 58 + offset} y2={g - 28} {...lp(LG, 10)} />
      <line x1={x + 50 + offset} y1={g - 22} x2={x + 64 + offset} y2={g - 22} {...lp(P, 7)} />
      {/* arm on floor */}
      <line x1={x - 20} y1={g - 35} x2={x - 26} y2={g - 18} {...lp(P, 9)} />
      <line x1={x - 26} y1={g - 18} x2={x - 24} y2={g - 8} {...lp(G, 8)} />
    </g>
  );
}

/** Hip mobility — 90/90 on floor */
function FHipMobility({ x, g = 128, rotated = false }: { x: number; g?: number; rotated?: boolean }) {
  return (
    <g>
      {/* sitting on floor */}
      <ellipse cx={x - 20} cy={g - 68} rx={10} ry={10} fill={G} />
      {/* torso upright */}
      <line x1={x - 18} y1={g - 58} x2={x - 10} y2={g - 38} {...lp(P, 16)} />
      <rect x={x - 20} y={g - 38} width={22} height={12} rx={4} fill={DP} />
      {/* front leg at 90° */}
      <line x1={x - 10} y1={g - 36} x2={x + 18} y2={g - 36} {...lp(G, 11)} />
      <line x1={x + 18} y1={g - 36} x2={x + 18} y2={g - 16} {...lp(LG, 10)} />
      {/* back leg at 90° */}
      <line x1={x - 10} y1={g - 36} x2={x - 10} y2={g - 16} {...lp(G, 11)} />
      <line x1={x - 22} y1={g - 16} x2={x + 2} y2={g - 16} {...lp(LG, 10)} />
      {/* floor */}
      <line x1={x - 40} y1={g - 12} x2={x + 40} y2={g - 12} stroke="#333" strokeWidth="1" />
      {/* arms resting or rotated */}
      {rotated ? (
        <line x1={x - 10} y1={g - 50} x2={x + 10} y2={g - 44} {...lp(G, 9)} />
      ) : (
        <line x1={x - 10} y1={g - 50} x2={x - 26} y2={g - 42} {...lp(G, 9)} />
      )}
    </g>
  );
}

/** Band walk — lateral step with band */
function FBandWalk({ x, g = 128, stepped = false }: { x: number; g?: number; stepped?: boolean }) {
  const spread = stepped ? 16 : 0;
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <line x1={x - 22} y1={g - 71} x2={x - 28} y2={g - 55} {...lp(P, 10)} />
      <line x1={x - 28} y1={g - 55} x2={x - 26} y2={g - 43} {...lp(G, 9)} />
      <line x1={x + 22} y1={g - 71} x2={x + 28} y2={g - 55} {...lp(P, 10)} />
      <line x1={x + 28} y1={g - 55} x2={x + 26} y2={g - 43} {...lp(G, 9)} />
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      <line x1={x - 9} y1={g - 45} x2={x - 9 - spread} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 45} x2={x + 9 + spread} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 9 - spread} y1={g - 27} x2={x - 8 - spread} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x + 9 + spread} y1={g - 27} x2={x + 10 + spread} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 17 - spread} y1={g - 6} x2={x - 2 - spread} y2={g - 6} {...lp(P, 7)} />
      <line x1={x + 2 + spread}  y1={g - 6} x2={x + 17 + spread} y2={g - 6} {...lp(P, 7)} />
      {/* band between ankles */}
      <path d={`M${x - 9 - spread} ${g - 18} Q${x} ${g - 10} ${x + 9 + spread} ${g - 18}`}
        stroke={O} strokeWidth="2" fill="none" strokeDasharray="4,2" />
    </g>
  );
}

/** Foot activation — on tiptoes */
function FFootActivation({ x, g = 128, tiptoe = false }: { x: number; g?: number; tiptoe?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={g - 93} rx={11} ry={10} fill={G} />
      <rect x={x - 17} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 21} cy={g - 76} rx={8} ry={6} fill={P} />
      <line x1={x - 22} y1={g - 71} x2={x - 24} y2={g - 55} {...lp(P, 10)} />
      <line x1={x - 24} y1={g - 55} x2={x - 24} y2={g - 43} {...lp(G, 9)} />
      <line x1={x + 22} y1={g - 71} x2={x + 24} y2={g - 55} {...lp(P, 10)} />
      <line x1={x + 24} y1={g - 55} x2={x + 24} y2={g - 43} {...lp(G, 9)} />
      <rect x={x - 15} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      <line x1={x - 9} y1={g - 45} x2={x - 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 45} x2={x + 9} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 9} y1={g - 27} x2={x - 8} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x + 9} y1={g - 27} x2={x + 10} y2={g - 13} {...lp(LG, 10)} />
      {tiptoe ? (
        /* on tiptoes — feet point down */
        <>
          <line x1={x - 8} y1={g - 13} x2={x - 9} y2={g + 2} {...lp(P, 7)} />
          <line x1={x + 10} y1={g - 13} x2={x + 11} y2={g + 2} {...lp(P, 7)} />
        </>
      ) : (
        /* flat feet */
        <>
          <line x1={x - 17} y1={g - 6} x2={x - 2} y2={g - 6} {...lp(P, 7)} />
          <line x1={x + 2}  y1={g - 6} x2={x + 17} y2={g - 6} {...lp(P, 7)} />
        </>
      )}
    </g>
  );
}

/** Copenhagen — side lying, hip up */
function FCopenhagen({ x, g = 128, hipUp = false }: { x: number; g?: number; hipUp?: boolean }) {
  const hips = hipUp ? g - 44 : g - 26;
  return (
    <g>
      {/* head */}
      <ellipse cx={x - 44} cy={hipUp ? g - 60 : g - 42} rx={10} ry={9} fill={G} />
      {/* arm on floor */}
      <line x1={x - 38} y1={hipUp ? g - 54 : g - 36} x2={x - 48} y2={g - 22} {...lp(P, 10)} />
      <line x1={x - 48} y1={g - 22} x2={x - 48} y2={g - 8} {...lp(G, 9)} />
      {/* torso */}
      <line x1={x - 36} y1={hipUp ? g - 50 : g - 32} x2={x + 10} y2={hips} {...lp(P, 15)} />
      <rect x={x + 4} y={hips - 8} width={18} height={12} rx={4} fill={DP} />
      {/* legs — top leg on bench */}
      <rect x={x + 20} y={hips - 14} width={36} height={10} rx={3} fill="#333" />
      <line x1={x + 18} y1={hips} x2={x + 52} y2={hips - 10} {...lp(G, 10)} />
      <line x1={x + 52} y1={hips - 10} x2={x + 60} y2={hips - 10} {...lp(LG, 9)} />
      {/* bottom leg */}
      <line x1={x + 18} y1={hips} x2={x + 46} y2={g - 12} {...lp(G, 10)} />
      <line x1={x + 42} y1={g - 8} x2={x + 56} y2={g - 8} {...lp(P, 7)} />
      <line x1={x - 55} y1={g - 5} x2={x + 65} y2={g - 5} stroke="#333" strokeWidth="1" />
    </g>
  );
}

/** Ice bath — sitting in tub */
function FIceBath({ x, g = 128 }: { x: number; g?: number }) {
  return (
    <g>
      {/* tub */}
      <rect x={x - 52} y={g - 52} width={100} height={44} rx={8} fill="#1e3a5f" stroke="#2563EB" strokeWidth="2" />
      {/* water */}
      <rect x={x - 48} y={g - 38} width={92} height={26} rx={4} fill="#1d4ed8" opacity="0.5" />
      {/* ice cubes */}
      {[x - 34, x - 8, x + 18].map((ix, i) => (
        <rect key={i} x={ix} y={g - 36} width={10} height={10} rx={2} fill="#93c5fd" opacity="0.8" />
      ))}
      {/* figure sitting */}
      <ellipse cx={x} cy={g - 70} rx={11} ry={10} fill={G} />
      <line x1={x} y1={g - 60} x2={x} y2={g - 45} {...lp(P, 20)} />
      {/* arms on tub edge */}
      <line x1={x - 14} y1={g - 55} x2={x - 40} y2={g - 50} {...lp(P, 10)} />
      <line x1={x - 40} y1={g - 50} x2={x - 46} y2={g - 42} {...lp(G, 9)} />
      <line x1={x + 14} y1={g - 55} x2={x + 40} y2={g - 50} {...lp(P, 10)} />
      <line x1={x + 40} y1={g - 50} x2={x + 46} y2={g - 42} {...lp(G, 9)} />
    </g>
  );
}

/** Skipping — high knee */
function FSkipping({ x, g = 128, leftKnee = true }: { x: number; g?: number; leftKnee?: boolean }) {
  return (
    <g>
      <ellipse cx={x + 4} cy={g - 95} rx={10} ry={10} fill={G} />
      <line x1={x + 2} y1={g - 85} x2={x - 4} y2={g - 62} {...lp(P, 18)} />
      <line x1={x - 4} y1={g - 62} x2={x - 6} y2={g - 50} {...lp(DP, 16)} />
      {/* arm swing */}
      <line x1={x - 8} y1={g - 76} x2={x - 24} y2={g - 60} {...lp(P, 9)} />
      <line x1={x - 24} y1={g - 60} x2={x - 30} y2={g - 50} {...lp(G, 8)} />
      <line x1={x + 8} y1={g - 76} x2={x + 20} y2={g - 84} {...lp(P, 9)} />
      <line x1={x + 20} y1={g - 84} x2={x + 24} y2={g - 76} {...lp(G, 8)} />
      {leftKnee ? (
        <>
          {/* left knee raised high */}
          <line x1={x - 6} y1={g - 50} x2={x - 18} y2={g - 28} {...lp(G, 11)} />
          <line x1={x - 18} y1={g - 28} x2={x - 10} y2={g - 18} {...lp(LG, 10)} />
          {/* right leg down */}
          <line x1={x + 4} y1={g - 50} x2={x + 6} y2={g - 28} {...lp(G, 11)} />
          <line x1={x + 6} y1={g - 28} x2={x + 8} y2={g - 14} {...lp(LG, 10)} />
          <line x1={x + 1} y1={g - 7} x2={x + 15} y2={g - 7} {...lp(P, 7)} />
        </>
      ) : (
        <>
          {/* right knee raised high */}
          <line x1={x + 4} y1={g - 50} x2={x + 18} y2={g - 30} {...lp(G, 11)} />
          <line x1={x + 18} y1={g - 30} x2={x + 10} y2={g - 20} {...lp(LG, 10)} />
          {/* left leg down */}
          <line x1={x - 6} y1={g - 50} x2={x - 8} y2={g - 28} {...lp(G, 11)} />
          <line x1={x - 8} y1={g - 28} x2={x - 8} y2={g - 14} {...lp(LG, 10)} />
          <line x1={x - 15} y1={g - 7} x2={x - 1} y2={g - 7} {...lp(P, 7)} />
        </>
      )}
    </g>
  );
}

/** Bounds — long horizontal stride */
function FBounds({ x, g = 128, extended = false }: { x: number; g?: number; extended?: boolean }) {
  return (
    <g>
      <ellipse cx={x + 8} cy={g - (extended ? 98 : 90)} rx={10} ry={10} fill={G} />
      <line x1={x + 6} y1={g - (extended ? 88 : 80)} x2={x - 4} y2={g - (extended ? 64 : 57)} {...lp(P, 18)} />
      <line x1={x - 4} y1={g - (extended ? 64 : 57)} x2={x - 6} y2={g - (extended ? 50 : 43)} {...lp(DP, 16)} />
      {/* lead arm forward */}
      <line x1={x} y1={g - (extended ? 78 : 70)} x2={x + 20} y2={g - (extended ? 88 : 80)} {...lp(P, 9)} />
      <line x1={x + 20} y1={g - (extended ? 88 : 80)} x2={x + 28} y2={g - (extended ? 78 : 70)} {...lp(G, 8)} />
      {/* trail arm back */}
      <line x1={x} y1={g - (extended ? 78 : 70)} x2={x - 20} y2={g - (extended ? 68 : 60)} {...lp(P, 9)} />
      {/* lead leg forward */}
      <line x1={x - 6} y1={g - (extended ? 50 : 43)} x2={x + (extended ? 28 : 18)} y2={g - 22} {...lp(G, 11)} />
      <line x1={x + (extended ? 28 : 18)} y1={g - 22} x2={x + (extended ? 24 : 14)} y2={g - 4} {...lp(LG, 10)} />
      <line x1={x + (extended ? 16 : 6)} y1={g + 1} x2={x + (extended ? 32 : 22)} y2={g + 1} {...lp(P, 7)} />
      {/* trail leg back */}
      <line x1={x - 6} y1={g - (extended ? 50 : 43)} x2={x - (extended ? 36 : 26)} y2={g - 32} {...lp(G, 11)} />
      <line x1={x - (extended ? 36 : 26)} y1={g - 32} x2={x - (extended ? 42 : 32)} y2={g - 44} {...lp(LG, 10)} />
    </g>
  );
}

/** Hurdle jump — over hurdle */
function FHurdle({ x, g = 128, overHurdle = false }: { x: number; g?: number; overHurdle?: boolean }) {
  return (
    <g>
      {/* hurdle */}
      <line x1={x + (overHurdle ? -14 : 18)} y1={g - 36} x2={x + (overHurdle ? 14 : 46)} y2={g - 36}
        stroke="#888" strokeWidth="4" strokeLinecap="round" />
      <line x1={x + (overHurdle ? -8 : 24)} y1={g - 36} x2={x + (overHurdle ? -8 : 24)} y2={g - 4}
        stroke="#888" strokeWidth="3" />
      <line x1={x + (overHurdle ? 8 : 40)} y1={g - 36} x2={x + (overHurdle ? 8 : 40)} y2={g - 4}
        stroke="#888" strokeWidth="3" />
      {overHurdle ? (
        /* over hurdle — body tucked high */
        <g>
          <ellipse cx={x} cy={g - 90} rx={10} ry={10} fill={G} />
          <line x1={x} y1={g - 80} x2={x - 4} y2={g - 58} {...lp(P, 18)} />
          <line x1={x - 4} y1={g - 58} x2={x - 4} y2={g - 46} {...lp(DP, 15)} />
          {/* legs tucked */}
          <line x1={x - 4} y1={g - 46} x2={x + 18} y2={g - 50} {...lp(G, 11)} />
          <line x1={x + 18} y1={g - 50} x2={x + 24} y2={g - 38} {...lp(LG, 10)} />
          <line x1={x - 4} y1={g - 46} x2={x - 20} y2={g - 48} {...lp(G, 11)} />
          <line x1={x - 20} y1={g - 48} x2={x - 26} y2={g - 36} {...lp(LG, 10)} />
        </g>
      ) : (
        /* approaching hurdle */
        <g>
          <ellipse cx={x} cy={g - 90} rx={10} ry={10} fill={G} />
          <line x1={x} y1={g - 80} x2={x - 2} y2={g - 56} {...lp(P, 18)} />
          <line x1={x - 2} y1={g - 56} x2={x - 2} y2={g - 43} {...lp(DP, 15)} />
          <line x1={x - 2} y1={g - 43} x2={x + 14} y2={g - 22} {...lp(G, 11)} />
          <line x1={x + 14} y1={g - 22} x2={x + 12} y2={g - 4} {...lp(LG, 10)} />
          <line x1={x + 5} y1={g + 1} x2={x + 20} y2={g + 1} {...lp(P, 7)} />
          <line x1={x - 2} y1={g - 43} x2={x - 16} y2={g - 26} {...lp(G, 11)} />
          <line x1={x - 16} y1={g - 26} x2={x - 18} y2={g - 52} {...lp(LG, 10)} />
        </g>
      )}
    </g>
  );
}

/** Agility ladder — feet in/out */
function FLadder({ x, g = 128, feetOut = false }: { x: number; g?: number; feetOut?: boolean }) {
  return (
    <g>
      {/* ladder on ground */}
      {[-28, -12, 4, 20].map((offset, i) => (
        <rect key={i} x={x + offset} y={g - 10} width={14} height={10} rx={1}
          fill="none" stroke="#555" strokeWidth="1.5" />
      ))}
      <line x1={x - 32} y1={g - 10} x2={x - 32} y2={g} stroke="#555" strokeWidth="2" />
      <line x1={x + 38} y1={g - 10} x2={x + 38} y2={g} stroke="#555" strokeWidth="2" />
      {/* figure above ladder */}
      <ellipse cx={x} cy={g - 90} rx={10} ry={10} fill={G} />
      <line x1={x} y1={g - 80} x2={x} y2={g - 56} {...lp(P, 18)} />
      <line x1={x} y1={g - 56} x2={x} y2={g - 44} {...lp(DP, 15)} />
      {/* arms out for balance */}
      <line x1={x - 12} y1={g - 72} x2={x - 28} y2={g - 64} {...lp(P, 9)} />
      <line x1={x + 12} y1={g - 72} x2={x + 28} y2={g - 64} {...lp(P, 9)} />
      {/* feet */}
      {feetOut ? (
        <>
          <line x1={x - 9} y1={g - 44} x2={x - 26} y2={g - 24} {...lp(G, 11)} />
          <line x1={x - 26} y1={g - 24} x2={x - 28} y2={g - 10} {...lp(LG, 10)} />
          <line x1={x - 36} y1={g - 5} x2={x - 22} y2={g - 5} {...lp(P, 7)} />
          <line x1={x + 9} y1={g - 44} x2={x + 26} y2={g - 24} {...lp(G, 11)} />
          <line x1={x + 26} y1={g - 24} x2={x + 28} y2={g - 10} {...lp(LG, 10)} />
          <line x1={x + 22} y1={g - 5} x2={x + 36} y2={g - 5} {...lp(P, 7)} />
        </>
      ) : (
        <>
          <line x1={x - 9} y1={g - 44} x2={x - 8} y2={g - 24} {...lp(G, 11)} />
          <line x1={x - 8} y1={g - 24} x2={x - 8} y2={g - 10} {...lp(LG, 10)} />
          <line x1={x - 15} y1={g - 4} x2={x - 1} y2={g - 4} {...lp(P, 7)} />
          <line x1={x + 9} y1={g - 44} x2={x + 8} y2={g - 24} {...lp(G, 11)} />
          <line x1={x + 8} y1={g - 24} x2={x + 8} y2={g - 10} {...lp(LG, 10)} />
          <line x1={x + 1} y1={g - 4} x2={x + 15} y2={g - 4} {...lp(P, 7)} />
        </>
      )}
    </g>
  );
}

/** Depth jump — on box / landing */
function FDepthJump({ x, g = 128, landing = false }: { x: number; g?: number; landing?: boolean }) {
  if (!landing) {
    // on box
    return (
      <g>
        {/* box */}
        <rect x={x - 22} y={g - 38} width={44} height={30} rx={4} fill="#333" />
        <rect x={x - 22} y={g - 38} width={44} height={8} rx={4} fill="#444" />
        <FStand x={x} g={g - 38} />
      </g>
    );
  }
  // landing — bent knees, arms forward
  return (
    <g>
      <ellipse cx={x} cy={g - 72} rx={11} ry={10} fill={G} />
      <rect x={x - 16} y={g - 62} width={32} height={20} rx={5} fill={P} />
      <ellipse cx={x - 19} cy={g - 55} rx={7} ry={6} fill={P} />
      <ellipse cx={x + 19} cy={g - 55} rx={7} ry={6} fill={P} />
      <line x1={x - 19} y1={g - 51} x2={x - 36} y2={g - 53} {...lp(P, 10)} />
      <line x1={x - 36} y1={g - 53} x2={x - 44} y2={g - 50} {...lp(G, 9)} />
      <line x1={x + 19} y1={g - 51} x2={x + 36} y2={g - 53} {...lp(P, 10)} />
      <line x1={x + 36} y1={g - 53} x2={x + 44} y2={g - 50} {...lp(G, 9)} />
      <rect x={x - 14} y={g - 42} width={28} height={12} rx={4} fill={DP} />
      <line x1={x - 9} y1={g - 42} x2={x - 20} y2={g - 26} {...lp(G, 11)} />
      <line x1={x + 9} y1={g - 42} x2={x + 20} y2={g - 26} {...lp(G, 11)} />
      <line x1={x - 20} y1={g - 26} x2={x - 14} y2={g - 10} {...lp(LG, 10)} />
      <line x1={x + 20} y1={g - 26} x2={x + 14} y2={g - 10} {...lp(LG, 10)} />
      <line x1={x - 22} y1={g - 4} x2={x - 8} y2={g - 4} {...lp(P, 7)} />
      <line x1={x + 8} y1={g - 4} x2={x + 22} y2={g - 4} {...lp(P, 7)} />
    </g>
  );
}

/** Lateral jump */
function FLateralJump({ x, g = 128, inAir = false }: { x: number; g?: number; inAir?: boolean }) {
  return (
    <g>
      {inAir ? (
        <>
          <ellipse cx={x + 16} cy={g - 84} rx={10} ry={10} fill={G} />
          <line x1={x + 14} y1={g - 74} x2={x + 8} y2={g - 52} {...lp(P, 18)} />
          <line x1={x + 8} y1={g - 52} x2={x + 6} y2={g - 40} {...lp(DP, 15)} />
          <line x1={x - 4} y1={g - 64} x2={x - 22} y2={g - 58} {...lp(P, 10)} />
          <line x1={x + 22} y1={g - 64} x2={x + 40} y2={g - 58} {...lp(P, 10)} />
          <line x1={x + 6} y1={g - 40} x2={x + 24} y2={g - 22} {...lp(G, 11)} />
          <line x1={x + 24} y1={g - 22} x2={x + 22} y2={g - 8} {...lp(LG, 10)} />
          <line x1={x + 14} y1={g - 3} x2={x + 30} y2={g - 3} {...lp(P, 7)} />
          <line x1={x + 6} y1={g - 40} x2={x - 10} y2={g - 28} {...lp(G, 11)} />
          <line x1={x - 10} y1={g - 28} x2={x - 14} y2={g - 42} {...lp(LG, 10)} />
        </>
      ) : (
        <FStand x={x} g={g} />
      )}
    </g>
  );
}

/** Stretch dynamic — leg swing */
function FStretchSwing({ x, g = 128, forward = false }: { x: number; g?: number; forward?: boolean }) {
  return (
    <g>
      {/* standing leg */}
      <ellipse cx={x - 8} cy={g - 93} rx={10} ry={10} fill={G} />
      <rect x={x - 25} y={g - 83} width={34} height={24} rx={5} fill={P} />
      <ellipse cx={x - 29} cy={g - 76} rx={8} ry={6} fill={P} />
      <ellipse cx={x + 9} cy={g - 76} rx={8} ry={6} fill={P} />
      <line x1={x - 29} y1={g - 71} x2={x - 34} y2={g - 55} {...lp(P, 10)} />
      <line x1={x - 34} y1={g - 55} x2={x - 34} y2={g - 43} {...lp(G, 9)} />
      <line x1={x + 9} y1={g - 71} x2={x + 14} y2={g - 55} {...lp(P, 10)} />
      <line x1={x + 14} y1={g - 55} x2={x + 14} y2={g - 43} {...lp(G, 9)} />
      <rect x={x - 23} y={g - 59} width={30} height={14} rx={4} fill={DP} />
      {/* planted leg */}
      <line x1={x - 14} y1={g - 45} x2={x - 14} y2={g - 27} {...lp(G, 11)} />
      <line x1={x - 14} y1={g - 27} x2={x - 14} y2={g - 13} {...lp(LG, 10)} />
      <line x1={x - 22} y1={g - 6} x2={x - 6} y2={g - 6} {...lp(P, 7)} />
      {/* swinging leg */}
      {forward ? (
        <>
          <line x1={x + 2} y1={g - 45} x2={x + 18} y2={g - 22} {...lp(G, 11)} />
          <line x1={x + 18} y1={g - 22} x2={x + 26} y2={g - 10} {...lp(LG, 10)} />
          <line x1={x + 19} y1={g - 5} x2={x + 33} y2={g - 5} {...lp(P, 7)} />
        </>
      ) : (
        <>
          <line x1={x + 2} y1={g - 45} x2={x - 14} y2={g - 58} {...lp(G, 11)} />
          <line x1={x - 14} y1={g - 58} x2={x - 20} y2={g - 46} {...lp(LG, 10)} />
        </>
      )}
    </g>
  );
}

// ─── TACTICAL FIELD HELPER ────────────────────────────────────────────────────

/** Mini football field top-down */
function Field({ x = 0, y = 18, w = 300, h = 120 }: { x?: number; y?: number; w?: number; h?: number }) {
  const pw = Math.round(w * 0.18); // penalty area width
  const ph = Math.round(h * 0.58); // penalty area height
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={GF} rx="4" />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill="none" stroke={FW} strokeWidth="1.2" />
      <line x1={cx} y1={y + 4} x2={cx} y2={y + h - 4} stroke={FW} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={Math.round(h * 0.15)} fill="none" stroke={FW} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={2} fill={FW} />
      <rect x={x + 4} y={cy - ph / 2} width={pw} height={ph} fill="none" stroke={FW} strokeWidth="1.2" />
      <rect x={x + w - 4 - pw} y={cy - ph / 2} width={pw} height={ph} fill="none" stroke={FW} strokeWidth="1.2" />
      <rect x={x + 4} y={cy - h * 0.14} width={Math.round(h * 0.09)} height={h * 0.28}
        fill="none" stroke={FW} strokeWidth="1.2" />
      <rect x={x + w - 4 - Math.round(h * 0.09)} y={cy - h * 0.14} width={Math.round(h * 0.09)} height={h * 0.28}
        fill="none" stroke={FW} strokeWidth="1.2" />
    </g>
  );
}

/** Player dot */
function Dot({ x, y, c, label }: { x: number; y: number; c: string; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={c} stroke="white" strokeWidth="1" />
      {label && <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">{label}</text>}
    </g>
  );
}

/** Arrow on field */
function FieldArrow({ x1, y1, x2, y2, c = FW }: { x1: number; y1: number; x2: number; y2: number; c?: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 8, ay = y2 - uy * 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={c} strokeWidth="1.5" strokeDasharray="4,2" />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={c}
      />
    </g>
  );
}

// ─── FIELD ILLUSTRATIONS ──────────────────────────────────────────────────────

function FieldRondo() {
  const cx = 150, cy = 78, r = 42;
  const positions = [0, 60, 120, 180, 240, 300].map(deg => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  }));
  return (
    <g>
      <Field />
      {/* possession circle */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={FW} strokeWidth="0.5" strokeDasharray="4,3" />
      {positions.map((p, i) => <Dot key={i} x={Math.round(p.x)} y={Math.round(p.y)} c="#F97316" />)}
      <Dot x={cx} y={cy} c="#DC2626" />
      <Dot x={cx - 12} y={cy + 14} c="#DC2626" />
    </g>
  );
}

function FieldPositions() {
  return (
    <g>
      <Field />
      {/* Grid position play */}
      {[[80,48],[150,48],[220,48],[80,90],[150,90],[220,90]].map(([x,y],i) => (
        <Dot key={i} x={x} y={y} c={i < 3 ? '#F97316' : '#3B82F6'} />
      ))}
      <FieldArrow x1={80} y1={48} x2={150} y2={48} c={O} />
      <FieldArrow x1={150} y1={48} x2={220} y2={90} c={O} />
      <FieldArrow x1={80} y1={90} x2={80} y2={48} c="#3B82F6" />
    </g>
  );
}

function Field2v1() {
  return (
    <g>
      <Field />
      <Dot x={100} y={78} c="#F97316" />
      <Dot x={140} y={58} c="#F97316" />
      <Dot x={140} y={98} c="#DC2626" />
      {/* goal area right */}
      <FieldArrow x1={100} y1={78} x2={190} y2={58} c={O} />
      <FieldArrow x1={190} y1={58} x2={240} y2={72} c={O} />
      <Dot x={190} y={58} c="#F97316" />
      {/* defender */}
      <Dot x={200} y={78} c="#DC2626" />
    </g>
  );
}

function FieldTransition() {
  return (
    <g>
      <Field />
      {/* Ball won in defense */}
      <circle cx={90} cy={95} r={5} fill="#fff" stroke="#888" strokeWidth="1" />
      {[70,90,110].map((x, i) => <Dot key={i} x={x} y={95} c="#3B82F6" />)}
      {[80,150,220].map((x, i) => <Dot key={i} x={x} y={48} c="#F97316" />)}
      <FieldArrow x1={90} y1={95} x2={150} y2={62} c={O} />
      <FieldArrow x1={150} y1={62} x2={220} y2={52} c={O} />
      <FieldArrow x1={80} y1={95} x2={80} y2={55} c="#3B82F6" />
    </g>
  );
}

function FieldPress() {
  return (
    <g>
      <Field />
      {/* Ball at back */}
      <circle cx={70} cy={78} r={5} fill="#fff" stroke="#888" strokeWidth="1" />
      <Dot x={70} y={78} c="#DC2626" label="GK" />
      <Dot x={110} y={65} c="#DC2626" />
      <Dot x={110} y={91} c="#DC2626" />
      {/* Pressing players with arrows */}
      {[{px:130,py:65},{px:130,py:91},{px:150,py:78}].map((p, i) => (
        <g key={i}>
          <Dot x={p.px + 40} y={p.py} c="#F97316" />
          <FieldArrow x1={p.px + 40} y1={p.py} x2={p.px} y2={p.py} c={O} />
        </g>
      ))}
      {/* trigger label */}
      <text x={230} y={50} fill={O} fontSize="8" fontFamily="system-ui">⚡ TRIGGER</text>
    </g>
  );
}

function FieldWide() {
  return (
    <g>
      <Field />
      <Dot x={70} y={78} c="#3B82F6" label="GK" />
      <Dot x={100} y={55} c="#F97316" />
      <Dot x={100} y={101} c="#F97316" />
      <Dot x={200} y={45} c="#F97316" />
      <Dot x={200} y={111} c="#F97316" />
      <Dot x={240} y={78} c="#F97316" />
      <FieldArrow x1={100} y1={55} x2={200} y2={45} c={O} />
      <FieldArrow x1={200} y1={45} x2={248} y2={62} c={O} />
      <FieldArrow x1={248} y1={62} x2={248} y2={94} c={O} />
      <Dot x={220} y={78} c="#F97316" />
    </g>
  );
}

function FieldCounter() {
  return (
    <g>
      <Field />
      <circle cx={90} cy={95} r={5} fill="#fff" stroke="#888" strokeWidth="1" />
      <Dot x={90} y={95} c="#DC2626" />
      {/* Long counter arrow */}
      <FieldArrow x1={90} y1={90} x2={240} y2={55} c="#22C55E" />
      <Dot x={180} y={70} c="#F97316" />
      <Dot x={220} y={55} c="#F97316" />
      <Dot x={100} y={60} c="#DC2626" />
      <Dot x={130} y={60} c="#DC2626" />
      <text x={155} y={90} fill="#22C55E" fontSize="9" fontFamily="system-ui" fontWeight="bold">CONTRA</text>
    </g>
  );
}

function FieldCorner() {
  return (
    <g>
      <Field />
      {/* corner flag area */}
      <circle cx={296} cy={22} r={4} fill="none" stroke={FW} strokeWidth="1.5" />
      <line x1={296} y1={22} x2={260} y2={60} stroke={O} strokeWidth="2" strokeDasharray="4,2" />
      {/* movements */}
      <Dot x={248} y={65} c="#F97316" />
      <Dot x={230} y={80} c="#F97316" />
      <Dot x={245} y={95} c="#F97316" />
      <FieldArrow x1={248} y1={65} x2={265} y2={78} c={O} />
      <FieldArrow x1={230} y1={80} x2={250} y2={78} c={O} />
      <Dot x={215} y={70} c="#DC2626" />
      <Dot x={220} y={90} c="#DC2626" />
    </g>
  );
}

function FieldDefensive() {
  return (
    <g>
      <Field />
      {/* defensive block low */}
      {[80,110,140,170,200].map((x, i) => (
        <Dot key={i} x={x} y={i % 2 === 0 ? 95 : 110} c="#3B82F6" />
      ))}
      {[100,150,200].map((x, i) => <Dot key={i} x={x} y={75} c="#3B82F6" />)}
      {/* attackers */}
      {[110,150,190].map((x, i) => (
        <g key={i}>
          <Dot x={x} y={55} c="#DC2626" />
          <FieldArrow x1={x} y1={55} x2={x} y2={70} c="#DC2626" />
        </g>
      ))}
      <text x={150} y={130} fill="#3B82F6" fontSize="8" textAnchor="middle" fontFamily="system-ui">BLOQUE BAJO</text>
    </g>
  );
}

function FieldBuildup() {
  return (
    <g>
      <Field />
      <Dot x={70} y={78} c="#3B82F6" label="GK" />
      <Dot x={100} y={55} c="#3B82F6" />
      <Dot x={100} y={78} c="#3B82F6" />
      <Dot x={100} y={101} c="#3B82F6" />
      {/* 2 pressing opponents */}
      <Dot x={148} y={65} c="#DC2626" />
      <Dot x={148} y={91} c="#DC2626" />
      <FieldArrow x1={70} y1={78} x2={100} y2={55} c={O} />
      <FieldArrow x1={100} y1={55} x2={140} y2={55} c={O} />
      <FieldArrow x1={100} y1={78} x2={140} y2={91} c={O} />
      <text x={200} y={78} fill={O} fontSize="8" fontFamily="system-ui">GK+3 vs 2</text>
    </g>
  );
}

function FieldSSG() {
  return (
    <g>
      {/* small field */}
      <rect x={10} y={22} width={280} height={110} fill={GFL} rx="4" />
      <rect x={14} y={26} width={272} height={102} fill="none" stroke={FW} strokeWidth="1.2" />
      <line x1={150} y1={26} x2={150} y2={128} stroke={FW} strokeWidth="1.2" />
      {/* small goals */}
      <rect x={10} y={62} width={10} height={30} fill="none" stroke={FW} strokeWidth="2" />
      <rect x={280} y={62} width={10} height={30} fill="none" stroke={FW} strokeWidth="2" />
      {/* players */}
      {[[65,55],[90,78],[65,101]].map(([px,py],i) => <Dot key={i} x={px} y={py} c="#F97316" />)}
      {[[235,55],[210,78],[235,101]].map(([px,py],i) => <Dot key={i} x={px} y={py} c="#3B82F6" />)}
      {/* neutral GK at both ends */}
      <Dot x={150} y={55} c="#22C55E" />
      <Dot x={150} y={101} c="#22C55E" />
      <text x={150} y={138} fill={FW} fontSize="7" textAnchor="middle" fontFamily="system-ui">SSG 3v3</text>
    </g>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface Props {
  type: IllustrationType;
}

export default function ExerciseIllustration({ type }: Props) {
  const svgProps = {
    viewBox: '0 0 300 140',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { width: '100%', height: '100%' } as React.CSSProperties,
  };

  // Tactical illustrations (full SVG, no two-frame layout)
  const tacticalMap: Record<string, JSX.Element> = {
    field_rondo:      <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldRondo/></svg>,
    field_positions:  <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldPositions/></svg>,
    field_2v1:        <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><Field2v1/></svg>,
    field_transition: <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldTransition/></svg>,
    field_press:      <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldPress/></svg>,
    field_wide:       <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldWide/></svg>,
    field_counter:    <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldCounter/></svg>,
    field_corner:     <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldCorner/></svg>,
    field_defensive:  <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldDefensive/></svg>,
    field_buildup:    <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldBuildup/></svg>,
    field_ssg:        <svg {...svgProps}><rect width="300" height="140" fill={BLK}/><FieldSSG/></svg>,
  };

  if (type in tacticalMap) return tacticalMap[type];

  // Physical illustrations — two frames + arrow
  type FramePair = [JSX.Element, JSX.Element, string?, string?];

  const frames: Partial<Record<IllustrationType, FramePair>> = {
    squat:            [<FStand x={70} />,                    <FSquat x={230} />,          'DE PIE',    'CUCLILLAS'],
    hip_thrust:       [<FHipThrustDown x={70} />,            <FHipThrustUp x={230} />,    'ABAJO',     'CADERA ARRIBA'],
    hip_hinge:        [<FStand x={70} />,                    <FHipHinge x={230} />,       'DE PIE',    'BISAGRA'],
    plank:            [<FPlank x={70} />,                    <FMtnClimber x={230} />,     'PLANCHA',   'VARIANTE'],
    bench_press:      [<FBenchExtend x={70} />,              <FBenchBent x={230} />,      'ARRIBA',    'PECHO'],
    shoulder_press:   [<FShoulderPressStart x={70} />,       <FShoulderPressUp x={230} />, 'INICIO',   'ARRIBA'],
    row:              [<FRowExtend x={70} />,                <FRowPull x={230} />,        'EXTENDIDO', 'JALADO'],
    lunge:            [<FStand x={70} />,                    <FLunge x={230} />,          'DE PIE',    'ESTOCADA'],
    pushup:           [<FPlank x={70} />,                    <FPushupDown x={230} />,     'ARRIBA',    'ABAJO'],
    mountain_climber: [<FPlank x={70} />,                    <FMtnClimber x={230} />,     'PLANCHA',   'RODILLA AL PECHO'],
    nordic_curl:      [<FNordicUpright x={70} />,            <FNordicFall x={230} />,     'ERGUIDO',   'CAÍDA'],
    cable_extension:  [<FStand x={70} />,                    <FCableExtend x={230} />,    'NEUTRO',    'EXTENSIÓN'],
    squat_jump:       [<FSquat x={70} />,                    <FJump x={230} />,           'CUCLILLAS', 'SALTO'],
    run:              [<FRun x={70} />,                      <FRun x={230} flipped />,    'ZANCADA A', 'ZANCADA B'],
    sprint:           [<FSprint x={70} />,                   <FRun x={230} />,            'INICIO',    'ACELERACIÓN'],
    jump_vertical:    [<FSquat x={70} />,                    <FJump x={230} />,           'IMPULSO',   'PICO'],
    depth_jump:       [<FDepthJump x={70} landing={false} />, <FDepthJump x={230} landing />, 'EN CAJÓN', 'ATERRIZAJE'],
    jump_lateral:     [<FStand x={70} />,                    <FLateralJump x={230} inAir />, 'INICIO',  'SALTO LATERAL'],
    bounds:           [<FBounds x={70} />,                   <FBounds x={230} extended />, 'IMPULSO',  'VUELO'],
    skipping:         [<FSkipping x={70} leftKnee />,        <FSkipping x={230} leftKnee={false} />, 'RODILLA IZQ', 'RODILLA DER'],
    hurdle_jump:      [<FHurdle x={70} />,                   <FHurdle x={230} overHurdle />, 'APROX.',  'SOBRE VALLA'],
    agility_ladder:   [<FLadder x={70} />,                   <FLadder x={230} feetOut />, 'DENTRO',   'FUERA'],
    triple_jump:      [<FRun x={70} />,                      <FJump x={230} />,           'HOP',       'SALTO'],
    balance_single:   [<FBalance x={70} />,                  <FBalance x={230} oneLeg />, '2 PIES',   '1 PIE'],
    stretch_dynamic:  [<FStretchSwing x={70} />,             <FStretchSwing x={230} forward />, 'ATRÁS', 'ADELANTE'],
    foam_roll:        [<FFoamRoll x={70} />,                 <FFoamRoll x={230} rolling />, 'INICIO',  'RODANDO'],
    band_walk:        [<FBandWalk x={70} />,                 <FBandWalk x={230} stepped />, 'NEUTRO',  'PASO LATERAL'],
    hip_mobility:     [<FHipMobility x={70} />,              <FHipMobility x={230} rotated />, '90/90', 'ROTACIÓN'],
    foot_activation:  [<FFootActivation x={70} />,           <FFootActivation x={230} tiptoe />, 'PLANTA', 'PUNTILLAS'],
    warmup_run:       [<FRun x={70} />,                      <FSprint x={230} />,         'TROTE',    'SPRINT'],
    ice_bath:         [<FIceBath x={70} />,                  <FIceBath x={230} />,        'ANTES',    'INMERSIÓN'],
    copenhagen:       [<FCopenhagen x={70} />,               <FCopenhagen x={230} hipUp />, 'INICIO',  'CADERA ARRIBA'],
  };

  const pair = frames[type];
  if (!pair) return null;

  const [frameA, frameB, labelA, labelB] = pair;

  return (
    <svg {...svgProps}>
      <rect width="300" height="140" fill={BLK} />
      <Lbl a={labelA} b={labelB} />
      {/* divider */}
      <line x1="150" y1="18" x2="150" y2="135" stroke="#1a1a1a" strokeWidth="1" />
      {frameA}
      <Arr />
      {frameB}
    </svg>
  );
}
