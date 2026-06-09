export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildMatchReportText(opts: {
  result: string;
  possession: number;
  shots: number;
  summary: string;
  key_players: string[];
  issues: string[];
  recommendations: string[];
}): string {
  const date = new Date().toLocaleDateString('es-ES');
  const lines: string[] = [
    '====================================',
    '       INFORME DE PARTIDO',
    `       Helpin Coach — ${date}`,
    '====================================',
    '',
    `Resultado:   ${opts.result}`,
    `Posesión:    ${opts.possession}%`,
    `Tiros:       ${opts.shots}`,
    '',
    '--- RESUMEN ---',
    opts.summary,
    '',
    '--- JUGADORES DESTACADOS ---',
    ...opts.key_players.map((p, i) => `${i + 1}. ${p}`),
    '',
    '--- PROBLEMAS DETECTADOS ---',
    ...opts.issues.map(i => `• ${i}`),
    '',
    '--- RECOMENDACIONES ---',
    ...opts.recommendations.map(r => `• ${r}`),
    '',
    '====================================',
  ];
  return lines.join('\n');
}

export function buildTeamStatsText(opts: {
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winRate: number;
  totalPlayers: number;
  avgLevel: number;
  byPosition: Record<string, number>;
  totalSessions: number;
  completedSessions: number;
  trainingRate: number;
  totalEvals: number;
  improvements: number;
  regressions: number;
  progressRate: number;
}): string {
  const date = new Date().toLocaleDateString('es-ES');
  const goalDiff = opts.goalsFor - opts.goalsAgainst;
  const posLines = Object.entries(opts.byPosition).map(([pos, n]) => `  ${pos}: ${n}`);
  const lines: string[] = [
    '====================================',
    '      ESTADÍSTICAS DEL EQUIPO',
    `      Helpin Coach — ${date}`,
    '====================================',
    '',
    '--- RENDIMIENTO EN PARTIDOS ---',
    `Victorias:    ${opts.wins}`,
    `Empates:      ${opts.draws}`,
    `Derrotas:     ${opts.losses}`,
    `Goles a favor:   ${opts.goalsFor}`,
    `Goles en contra: ${opts.goalsAgainst}`,
    `Diferencia:      ${goalDiff >= 0 ? '+' : ''}${goalDiff}`,
    `Win rate:        ${opts.winRate}%`,
    '',
    '--- PLANTILLA ---',
    `Total jugadores: ${opts.totalPlayers}`,
    `Nivel promedio:  ${opts.avgLevel}`,
    'Distribución por posición:',
    ...posLines,
    '',
    '--- ENTRENAMIENTO ---',
    `Sesiones totales:     ${opts.totalSessions}`,
    `Completadas:          ${opts.completedSessions}`,
    `Tasa de finalización: ${opts.trainingRate}%`,
    '',
    '--- PROGRESIÓN DE JUGADORES ---',
    `Evaluaciones totales: ${opts.totalEvals}`,
    `Mejoras:              ${opts.improvements}`,
    `Retrocesos:           ${opts.regressions}`,
    `Tasa de mejora:       ${opts.progressRate}%`,
    '',
    '====================================',
  ];
  return lines.join('\n');
}
