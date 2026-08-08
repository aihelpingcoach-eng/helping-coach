// ─── Sistema de diagramas tácticos ──────────────────────────────────────────
// Campo con líneas moradas (completo o medio campo), jugadores numerados por
// equipo, pases (balón + trayectoria) y movimientos (flecha). Cada ejercicio
// se define como una lista de "pasos": uno si el gesto es simple, varios si
// hay una secuencia de acciones que mostrar.

const LINE = '#8B5CF6';
const LINE_DIM = 'rgba(139, 92, 246, 0.35)';
const TEAM_A = '#A855F7';
const TEAM_A_STROKE = '#5B21B6';
const TEAM_B = '#F87171';
const TEAM_B_STROKE = '#7F1D1D';
const MOVE = '#FB923C';
const PASS = '#EDE9FE';
const CONE = '#FBBF24';

interface TPlayerDef { x: number; y: number; num: number; team?: 'a' | 'b'; }
interface TConeDef { x: number; y: number; }
interface TGoalDef { x: number; y: number; rot?: number; }
interface TPassDef { from: [number, number]; to: [number, number]; }
interface TMoveDef { from: [number, number]; to: [number, number]; curve?: [number, number]; }

export interface TacticalStep {
  pitch: 'full' | 'half';
  caption: string;
  players: TPlayerDef[];
  cones?: TConeDef[];
  miniGoals?: TGoalDef[];
  passes?: TPassDef[];
  moves?: TMoveDef[];
}

function PitchFull() {
  return (
    <g>
      <rect x="20" y="20" width="360" height="220" fill="none" stroke={LINE} strokeWidth="1.6" />
      <line x1="200" y1="20" x2="200" y2="240" stroke={LINE} strokeWidth="1.2" />
      <circle cx="200" cy="130" r="32" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="200" cy="130" r="1.6" fill={LINE} />
      <rect x="20" y="65" width="60" height="130" fill="none" stroke={LINE} strokeWidth="1.2" />
      <rect x="320" y="65" width="60" height="130" fill="none" stroke={LINE} strokeWidth="1.2" />
      <rect x="20" y="100" width="22" height="60" fill="none" stroke={LINE} strokeWidth="1.2" />
      <rect x="358" y="100" width="22" height="60" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="68" cy="130" r="1.6" fill={LINE} />
      <circle cx="332" cy="130" r="1.6" fill={LINE} />
      <path d="M 80 104 A 32 32 0 0 1 80 156" fill="none" stroke={LINE} strokeWidth="1.2" />
      <path d="M 320 104 A 32 32 0 0 0 320 156" fill="none" stroke={LINE} strokeWidth="1.2" />
      <path d="M 20 30 A 10 10 0 0 0 30 20" fill="none" stroke={LINE} strokeWidth="1" />
      <path d="M 370 20 A 10 10 0 0 0 380 30" fill="none" stroke={LINE} strokeWidth="1" />
      <path d="M 30 240 A 10 10 0 0 0 20 230" fill="none" stroke={LINE} strokeWidth="1" />
      <path d="M 380 230 A 10 10 0 0 0 370 240" fill="none" stroke={LINE} strokeWidth="1" />
      <rect x="12" y="118" width="8" height="24" fill="none" stroke={LINE} strokeWidth="1.4" />
      <rect x="380" y="118" width="8" height="24" fill="none" stroke={LINE} strokeWidth="1.4" />
    </g>
  );
}

function PitchHalf() {
  return (
    <g>
      <line x1="20" y1="20" x2="20" y2="240" stroke={LINE_DIM} strokeWidth="1.4" strokeDasharray="4,4" />
      <line x1="20" y1="20" x2="200" y2="20" stroke={LINE} strokeWidth="1.6" />
      <line x1="20" y1="240" x2="200" y2="240" stroke={LINE} strokeWidth="1.6" />
      <line x1="200" y1="20" x2="200" y2="240" stroke={LINE} strokeWidth="1.6" />
      <rect x="140" y="65" width="60" height="130" fill="none" stroke={LINE} strokeWidth="1.2" />
      <rect x="178" y="100" width="22" height="60" fill="none" stroke={LINE} strokeWidth="1.2" />
      <circle cx="172" cy="130" r="1.6" fill={LINE} />
      <path d="M 140 104 A 32 32 0 0 0 140 156" fill="none" stroke={LINE} strokeWidth="1.2" />
      <path d="M 190 20 A 10 10 0 0 0 200 30" fill="none" stroke={LINE} strokeWidth="1" />
      <path d="M 200 230 A 10 10 0 0 0 190 240" fill="none" stroke={LINE} strokeWidth="1" />
      <rect x="200" y="118" width="8" height="24" fill="none" stroke={LINE} strokeWidth="1.4" />
    </g>
  );
}

function TPlayerMarker({ x, y, num, team = 'a' }: TPlayerDef) {
  const fill = team === 'a' ? TEAM_A : TEAM_B;
  const stroke = team === 'a' ? TEAM_A_STROKE : TEAM_B_STROKE;
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central" fill="#fff" fontFamily="ui-monospace, monospace" fontSize="13" fontWeight="700">{num}</text>
    </g>
  );
}

function TConeMarker({ x, y }: TConeDef) {
  return <polygon points={`${x},${y - 8} ${x + 6},${y + 7} ${x - 6},${y + 7}`} fill={CONE} stroke="#92400E" strokeWidth="0.8" />;
}

function TMiniGoalMarker({ x, y }: TGoalDef) {
  return (
    <g>
      <rect x={x - 9} y={y - 6} width="18" height="12" fill="none" stroke={LINE} strokeWidth="1.4" />
      <line x1={x - 9} y1={y - 6} x2={x + 9} y2={y - 6} stroke={LINE} strokeWidth="1.4" />
    </g>
  );
}

function TPassAnnotation({ from, to }: TPassDef) {
  const [x1, y1] = from, [x2, y2] = to;
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  const ax = x2 - nx * 15, ay = y2 - ny * 15;
  const mx = x1 + dx * 0.55, my = y1 + dy * 0.55;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={PASS} strokeWidth="1.8" strokeDasharray="5,4" />
      <polygon points={`${x2},${y2} ${ax - ny * 5},${ay + nx * 5} ${ax + ny * 5},${ay - nx * 5}`} fill={PASS} />
      <circle cx={mx} cy={my} r="5.5" fill="#F5F2FF" stroke="#C4B5FD" strokeWidth="1" />
    </g>
  );
}

function TMoveAnnotation({ from, to, curve }: TMoveDef) {
  const [x1, y1] = from, [x2, y2] = to;
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  const ax = x2 - nx * 8, ay = y2 - ny * 8;
  const path = curve
    ? `M ${x1},${y1} Q ${curve[0]},${curve[1]} ${ax},${ay}`
    : `M ${x1},${y1} L ${ax},${ay}`;
  return (
    <g>
      <path d={path} fill="none" stroke={MOVE} strokeWidth="2.2" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${ax - ny * 5},${ay + nx * 5} ${ax + ny * 5},${ay - nx * 5}`} fill={MOVE} />
    </g>
  );
}

function TacticalFrame({ step }: { step: TacticalStep }) {
  const viewBox = step.pitch === 'full' ? '0 0 400 260' : '0 0 220 260';
  return (
    <div className="flex-shrink-0 h-full flex flex-col items-center justify-center">
      <svg viewBox={viewBox} className="h-full w-auto" style={{ maxHeight: '100%' }}>
        <rect width="100%" height="100%" fill="#0F0A18" />
        {step.pitch === 'full' ? <PitchFull /> : <PitchHalf />}
        {step.cones?.map((c, i) => <TConeMarker key={i} {...c} />)}
        {step.miniGoals?.map((g, i) => <TMiniGoalMarker key={i} {...g} />)}
        {step.passes?.map((p, i) => <TPassAnnotation key={i} {...p} />)}
        {step.moves?.map((m, i) => <TMoveAnnotation key={i} {...m} />)}
        {step.players.map((p, i) => <TPlayerMarker key={i} {...p} />)}
      </svg>
      <div className="text-[8px] tracking-wide uppercase text-gray-500 font-mono mt-1 text-center px-1 whitespace-nowrap">
        {step.caption}
      </div>
    </div>
  );
}

function StepConnector() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" className="flex-shrink-0 self-center">
      <line x1="1" y1="8" x2="14" y2="8" stroke={MOVE} strokeWidth="2" strokeLinecap="round" />
      <polygon points="19,8 12,4 12,12" fill={MOVE} />
    </svg>
  );
}

export function TacticalDiagram({ steps }: { steps: TacticalStep[] }) {
  return (
    <div className="w-full h-full flex items-center gap-2 overflow-x-auto px-2 bg-[#0F0A18]">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 h-[88%]">
          {i > 0 && <StepConnector />}
          <TacticalFrame step={step} />
        </div>
      ))}
    </div>
  );
}

// ─── Definiciones de los 5 ejercicios tácticos actuales ────────────────────

export const TACTICAL_STEPS: Record<string, TacticalStep[]> = {
  field_positions: [
    {
      pitch: 'half',
      caption: 'Posesión — pases prohibidos al centro',
      players: [
        { x: 60, y: 60, num: 1, team: 'a' },
        { x: 180, y: 60, num: 2, team: 'a' },
        { x: 180, y: 200, num: 3, team: 'a' },
        { x: 60, y: 200, num: 4, team: 'a' },
        { x: 120, y: 130, num: 1, team: 'b' },
      ],
      passes: [{ from: [60, 60], to: [180, 60] }],
    },
  ],
  field_2v1: [
    {
      pitch: 'half',
      caption: 'Paso 1 · situación inicial',
      players: [
        { x: 45, y: 170, num: 1, team: 'a' },
        { x: 45, y: 70, num: 2, team: 'a' },
        { x: 115, y: 120, num: 1, team: 'b' },
      ],
    },
    {
      pitch: 'half',
      caption: 'Paso 2 · pase y apoyo',
      players: [
        { x: 45, y: 170, num: 1, team: 'a' },
        { x: 45, y: 70, num: 2, team: 'a' },
        { x: 115, y: 120, num: 1, team: 'b' },
      ],
      passes: [{ from: [45, 170], to: [45, 70] }],
      moves: [{ from: [45, 170], to: [150, 60], curve: [60, 90] }],
    },
  ],
  field_defensive: [
    {
      pitch: 'half',
      caption: 'Paso 1 · balón en banda derecha',
      players: [
        { x: 140, y: 50, num: 1, team: 'a' },
        { x: 140, y: 97, num: 2, team: 'a' },
        { x: 140, y: 153, num: 3, team: 'a' },
        { x: 140, y: 200, num: 4, team: 'a' },
        { x: 55, y: 50, num: 1, team: 'b' },
      ],
    },
    {
      pitch: 'half',
      caption: 'Paso 2 · el balón cambia de lado, la línea bascula',
      players: [
        { x: 155, y: 75, num: 1, team: 'a' },
        { x: 155, y: 115, num: 2, team: 'a' },
        { x: 155, y: 160, num: 3, team: 'a' },
        { x: 155, y: 205, num: 4, team: 'a' },
        { x: 55, y: 205, num: 1, team: 'b' },
      ],
      passes: [{ from: [55, 50], to: [55, 205] }],
      moves: [
        { from: [140, 50], to: [155, 75] },
        { from: [140, 200], to: [155, 205] },
      ],
    },
  ],
  field_transition: [
    {
      pitch: 'half',
      caption: 'Paso 1 · recuperación del balón',
      players: [
        { x: 50, y: 150, num: 1, team: 'a' },
        { x: 90, y: 195, num: 2, team: 'a' },
        { x: 90, y: 105, num: 3, team: 'a' },
        { x: 75, y: 65, num: 1, team: 'b' },
        { x: 135, y: 80, num: 2, team: 'b' },
      ],
    },
    {
      pitch: 'half',
      caption: 'Paso 2 · salida rápida a la contra',
      players: [
        { x: 50, y: 150, num: 1, team: 'a' },
        { x: 90, y: 195, num: 2, team: 'a' },
        { x: 90, y: 105, num: 3, team: 'a' },
        { x: 75, y: 65, num: 1, team: 'b' },
        { x: 135, y: 80, num: 2, team: 'b' },
      ],
      passes: [{ from: [50, 150], to: [90, 105] }],
      moves: [{ from: [90, 195], to: [175, 85], curve: [130, 205] }],
    },
  ],
  field_ssg: [
    {
      pitch: 'half',
      caption: '3v3 con porterías neutras',
      cones: [{ x: 50, y: 60 }, { x: 190, y: 60 }, { x: 50, y: 200 }, { x: 190, y: 200 }],
      miniGoals: [{ x: 40, y: 130 }, { x: 200, y: 130 }],
      players: [
        { x: 85, y: 90, num: 1, team: 'a' },
        { x: 85, y: 130, num: 2, team: 'a' },
        { x: 85, y: 170, num: 3, team: 'a' },
        { x: 155, y: 90, num: 1, team: 'b' },
        { x: 155, y: 130, num: 2, team: 'b' },
        { x: 155, y: 170, num: 3, team: 'b' },
      ],
    },
  ],
};
