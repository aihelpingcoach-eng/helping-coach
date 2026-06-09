export interface Level {
  level: number;
  name: string;
  xpRequired: number;
  msg: string;
  color: string; // Tailwind gradient classes
  icon: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export const LEVEL_THRESHOLDS = [
  0, 200, 500, 900, 1400,
  2000, 2800, 3800, 5000, 6500,
  8500, 11000, 14000, 17500, 21500,
  26000, 31500, 38000, 46000, 55000,
];

export const LEVELS: Level[] = [
  { level: 1,  name: 'Aspirante',     xpRequired: 0,     msg: '',                                              color: 'from-gray-400 to-gray-600',                icon: '⚪', tier: 1 },
  // Tier 1 — Aluminio (plata mate)
  { level: 2,  name: 'Asistente',     xpRequired: 200,   msg: 'Tu viaje como entrenador comienza.',            color: 'from-slate-300 to-slate-500',              icon: '🪨', tier: 1 },
  { level: 3,  name: 'Preparador',    xpRequired: 500,   msg: 'Ya tienes las bases. Sigue adelante.',          color: 'from-slate-400 to-slate-600',              icon: '🪨', tier: 1 },
  // Tier 2 — Hierro (gris forja)
  { level: 4,  name: 'Táctico',       xpRequired: 900,   msg: 'Empiezas a ver el juego diferente.',            color: 'from-zinc-500 to-stone-600',               icon: '⚙️', tier: 2 },
  { level: 5,  name: 'Estratega',     xpRequired: 1400,  msg: 'El campo de juego es tu tablero.',              color: 'from-zinc-400 to-orange-700',              icon: '⚒️', tier: 2 },
  // Tier 3 — Oro
  { level: 6,  name: 'Mentor',        xpRequired: 2000,  msg: 'Tu equipo crece contigo.',                      color: 'from-yellow-400 to-amber-500',             icon: '🥇', tier: 3 },
  { level: 7,  name: 'Técnico',       xpRequired: 2800,  msg: 'La IA trabaja para ti. Tú mandas.',             color: 'from-amber-400 to-yellow-500',             icon: '✨', tier: 3 },
  { level: 8,  name: 'Analista',      xpRequired: 3800,  msg: 'Los datos no mienten. Tú los lees.',            color: 'from-yellow-300 to-amber-600',             icon: '👑', tier: 3 },
  // Tier 4 — Platino (plata fría)
  { level: 9,  name: 'Coach Pro',     xpRequired: 5000,  msg: 'Profesional de alto rendimiento.',              color: 'from-slate-200 to-sky-300',                icon: '💠', tier: 4 },
  { level: 10, name: 'Elite',         xpRequired: 6500,  msg: 'Bienvenido a la élite del coaching.',           color: 'from-sky-200 to-slate-400',                icon: '🔷', tier: 4 },
  { level: 11, name: 'Maestro',       xpRequired: 8500,  msg: 'Pocos llegan hasta aquí.',                      color: 'from-slate-300 to-cyan-300',               icon: '❄️', tier: 4 },
  // Tier 5 — Diamante (cristalino)
  { level: 12, name: 'Campeón',       xpRequired: 11000, msg: 'Tu dedicación es tu mejor táctica.',            color: 'from-cyan-300 to-white',                   icon: '💎', tier: 5 },
  { level: 13, name: 'Experto',       xpRequired: 14000, msg: 'La experiencia se nota en cada sesión.',        color: 'from-white to-sky-200',                    icon: '💎', tier: 5 },
  { level: 14, name: 'Veterano',      xpRequired: 17500, msg: 'Temporadas enteras de sabiduría.',              color: 'from-sky-100 to-cyan-400',                 icon: '💎', tier: 5 },
  // Tier 6 — Rubí (rojo profundo)
  { level: 15, name: 'Referente',     xpRequired: 21500, msg: 'Otros entrenadores aprenden de ti.',            color: 'from-red-600 to-rose-500',                 icon: '♦️', tier: 6 },
  { level: 16, name: 'Maestro Elite', xpRequired: 26000, msg: 'Un nivel que pocos alcanzan.',                  color: 'from-rose-700 to-red-500',                 icon: '🔴', tier: 6 },
  // Tier 7 — Esmeralda (verde gema)
  { level: 17, name: 'Leyenda',       xpRequired: 31500, msg: 'Tu nombre se graba en la historia.',            color: 'from-emerald-500 to-green-600',            icon: '🟢', tier: 7 },
  { level: 18, name: 'Icono',         xpRequired: 38000, msg: 'Eres el estándar de referencia.',               color: 'from-green-400 to-emerald-700',            icon: '🌿', tier: 7 },
  // Tier 8 — Zafiro (azul real)
  { level: 19, name: 'Gran Maestro',  xpRequired: 46000, msg: 'El fútbol fluye a través de ti.',               color: 'from-blue-600 to-indigo-700',              icon: '🔵', tier: 8 },
  { level: 20, name: 'Helping Coach', xpRequired: 55000, msg: 'Has alcanzado la cima. Eres la IA.',            color: 'from-blue-500 via-indigo-600 to-violet-700', icon: '💙', tier: 8 },
];

export function getTierForLevel(level: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  if (level <= 3)  return 1; // Aluminio
  if (level <= 5)  return 2; // Hierro
  if (level <= 8)  return 3; // Oro
  if (level <= 11) return 4; // Platino
  if (level <= 14) return 5; // Diamante
  if (level <= 16) return 6; // Rubí
  if (level <= 18) return 7; // Esmeralda
  return 8;                  // Zafiro
}

export function getLevelByXP(totalXP: number): Level {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

export function getNextLevel(currentLevelNum: number): Level | null {
  if (currentLevelNum >= 20) return null;
  return LEVELS[currentLevelNum] ?? null; // LEVELS is 0-indexed, level N is at index N-1, next is at index N
}

export function getLevelProgress(totalXP: number): {
  currentLevel: Level;
  nextLevel: Level | null;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  const currentLevel = getLevelByXP(totalXP);
  const nextLevel = getNextLevel(currentLevel.level);
  const xpIntoLevel = totalXP - currentLevel.xpRequired;
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0;
  const progressPercent = xpForNextLevel > 0 ? Math.min(100, (xpIntoLevel / xpForNextLevel) * 100) : 100;
  return { currentLevel, nextLevel, xpIntoLevel, xpForNextLevel, progressPercent };
}
