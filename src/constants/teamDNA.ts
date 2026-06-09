export interface TeamDNAType {
  id: string;
  name: string;
  style: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  playstyleScores: Record<string, number>;
  formationBonus: string[];
}

export const TEAM_DNA_TYPES: TeamDNAType[] = [
  {
    id: 'tiki_taka',
    name: 'Tiki-Taka',
    style: 'Posesión',
    description: 'Control del balón con pases cortos y continuos en espacios reducidos',
    strengths: ['Control total del partido', 'Desgaste progresivo del rival', 'Circulación fluida entre líneas'],
    weaknesses: ['Vulnerable a presión alta organizada', 'Lento en la transición ofensiva', 'Requiere alta concentración colectiva'],
    recommendation: 'Mantén líneas de pase cortas y mueve el balón antes de que el rival presione. El movimiento sin balón es tan importante como el pase.',
    playstyleScores: { 'Tiki Taka': 5, 'Technical': 3, 'First Touch': 3, 'Incisive Pass': 2, 'Pinged Pass': 2, 'Press Proven': 2 },
    formationBonus: ['4-3-3', '4-3-3 Holding', '4-2-3-1', '3-2-4-1', '4-1-4-1'],
  },
  {
    id: 'gegenpressing',
    name: 'Gegenpressing',
    style: 'Presión alta',
    description: 'Presión intensa e inmediata tras perder el balón para recuperarlo en campo rival',
    strengths: ['Recuperaciones en campo contrario', 'Transiciones ofensivas cortas', 'Dominio psicológico del rival'],
    weaknesses: ['Muy alto gasto físico', 'Espacios peligrosos a la espalda', 'Requiere automatismos perfectos'],
    recommendation: 'Los primeros 5 segundos tras perder el balón son clave. Presiona en bloque — si no recuperas, repliégate ordenado.',
    playstyleScores: { 'Press Proven': 5, 'Relentless': 4, 'Quick Step': 3, 'Intercept': 3, 'Anticipate': 2 },
    formationBonus: ['4-3-3', '3-4-3', '4-2-3-1'],
  },
  {
    id: 'contragolpe',
    name: 'Contragolpe Letal',
    style: 'Transiciones',
    description: 'Defensa ordenada y ataque explosivo en transición para sorprender al rival adelantado',
    strengths: ['Máxima eficacia goleadora en espacios', 'Desestabiliza rivales dominantes', 'Difícil de preparar defensivamente'],
    weaknesses: ['Poca posesión y control del partido', 'Dependiente de la velocidad individual', 'Físicamente exigente en las carreras'],
    recommendation: 'Recupera rápido y lanza en profundidad antes de que el rival se reorganice. La velocidad de decisión es tu arma.',
    playstyleScores: { 'Rapid': 5, 'Quick Step': 4, 'Gamechanger': 3, 'Power Shot': 2, 'Flair': 2 },
    formationBonus: ['4-5-1', '4-4-2', '5-4-1', '5-3-2'],
  },
  {
    id: 'bloque_bajo',
    name: 'Bloque Bajo',
    style: 'Bloque bajo',
    description: 'Defensa profunda con líneas compactas, salidas rápidas y aprovechamiento de espacios',
    strengths: ['Solidez defensiva extrema', 'Muy difícil de penetrar', 'Efectivo para gestionar resultados'],
    weaknesses: ['Poca iniciativa ofensiva', 'Presión psicológica constante', 'Difícil de remontar'],
    recommendation: 'Mantén el bloque bajo los 40m y usa la transición para sorprender. La paciencia defensiva crea espacios en el contraataque.',
    playstyleScores: { 'Block': 5, 'Jockey': 4, 'Anticipate': 3, 'Intercept': 3, 'Slide Tackle': 2 },
    formationBonus: ['5-4-1', '5-3-2', '4-5-1'],
  },
  {
    id: 'alta_presion',
    name: 'Alta Presión',
    style: 'Presión alta',
    description: 'Pressing intenso en campo contrario para forzar errores y generar oportunidades altas',
    strengths: ['Recuperaciones en campo rival', 'Fuerza errores en la salida del rival', 'Dominio territorial'],
    weaknesses: ['Alto desgaste físico', 'Peligroso si el rival supera la presión', 'Necesita rotaciones frecuentes'],
    recommendation: 'Aplica la presión en bloque coordinado. Si no recuperas en 3 toques, repliégate rápido y reorganízate.',
    playstyleScores: { 'Press Proven': 4, 'Relentless': 3, 'Intercept': 3, 'Quick Step': 2, 'Anticipate': 2, 'Technical': 1 },
    formationBonus: ['4-3-3', '4-3-3 False 9', '3-4-3'],
  },
  {
    id: 'juego_directo',
    name: 'Juego Directo',
    style: 'Juego directo',
    description: 'Pelota larga, duelos físicos y segundos balones como vía principal de ataque',
    strengths: ['Simplicidad táctica efectiva', 'Muy potente en duelos aéreos', 'Presiona en profundidad constantemente'],
    weaknesses: ['Predecible para el rival', 'Baja posesión del balón', 'Dependiente del delantero referencia'],
    recommendation: 'Aprovecha los duelos aéreos y los segundos balones con energía. Tu delantero es el punto de partida de todo.',
    playstyleScores: { 'Long Ball Pass': 5, 'Aerial Fortress': 4, 'Precision Header': 3, 'Bruiser': 3, 'Long Throw': 2 },
    formationBonus: ['4-4-2', '5-3-2', '3-5-2', 'WM'],
  },
  {
    id: 'posesion_total',
    name: 'Posesión Total',
    style: 'Posesión',
    description: 'Dominio absoluto del balón con construcción paciente y circulación metódica',
    strengths: ['Desgaste progresivo del rival', 'Control total del tiempo y ritmo', 'Mínima presión defensiva propia'],
    weaknesses: ['Proceso lento para generar ocasiones', 'Riesgo si pierde el balón en campo propio', 'Necesita calidad técnica en todos los jugadores'],
    recommendation: 'No tengas prisa — el balón es tu mejor arma defensiva. Espera el momento exacto para la última línea de pase.',
    playstyleScores: { 'Pinged Pass': 4, 'Tiki Taka': 4, 'First Touch': 3, 'Technical': 3, 'Inventive': 2, 'Incisive Pass': 2 },
    formationBonus: ['4-3-3 Holding', '4-1-4-1', '3-2-4-1'],
  },
  {
    id: 'juego_bandas',
    name: 'Juego de Bandas',
    style: 'Transiciones',
    description: 'Extremos desbordantes y centros laterales como principal vía de desequilibrio',
    strengths: ['Amplitud y espacios en campo rival', 'Centros al área de alta peligrosidad', 'Desequilibra líneas defensivas'],
    weaknesses: ['Interior del campo descubierto', 'Dependiente de la calidad de los extremos', 'Vulnerable en el centro del campo'],
    recommendation: 'Usa la banda para desgastar y centra cuando el lateral rival se haya comprometido. La profundidad crea el espacio.',
    playstyleScores: { 'Rapid': 4, 'Flair': 3, 'Trickster': 3, 'Whipped Pass': 3, 'Gamechanger': 2 },
    formationBonus: ['4-3-3', '3-4-3', '4-2-3-1', '4-3-3 Asimétrica'],
  },
  {
    id: 'intensidad_fisica',
    name: 'Intensidad Física',
    style: 'Físico',
    description: 'Dominio por intensidad, duelos directos y recuperación física superior',
    strengths: ['Gana duelos individuales con consistencia', 'Intimida física y psicológicamente', 'Alta tasa de recuperación del balón'],
    weaknesses: ['Técnicamente limitado en espacios cortos', 'Sancionado con frecuencia', 'Baja creatividad ofensiva'],
    recommendation: 'Mantén el ritmo alto desde el primer minuto — el físico es tu ventaja. No dejes que el rival se establezca.',
    playstyleScores: { 'Bruiser': 5, 'Enforcer': 4, 'Relentless': 3, 'Long Throw': 2, 'Slide Tackle': 2 },
    formationBonus: ['4-4-2', '5-3-2', '3-5-2'],
  },
  {
    id: 'futbol_interior',
    name: 'Fútbol de Interior',
    style: 'Posesión',
    description: 'Creatividad por el centro del campo con combinaciones entre líneas y desmarques interiores',
    strengths: ['Superioridad numérica en el mediocampo', 'Difícil de presionar colectivamente', 'Desmarques entre líneas imprevisibles'],
    weaknesses: ['Vulnerable por las bandas', 'Necesita laterales con proyección ofensiva', 'Complejo de ejecutar bajo presión'],
    recommendation: 'Busca al mediapunta entre líneas — él es la llave para abrir defensas cerradas. Los desmarques en corto crean el espacio.',
    playstyleScores: { 'Incisive Pass': 5, 'Inventive': 4, 'Technical': 3, 'Tiki Taka': 2, 'First Touch': 2 },
    formationBonus: ['4-3-1-2', '4-2-3-1', '4-1-4-1'],
  },
  {
    id: 'pelota_parada',
    name: 'Especialistas en Pelota Parada',
    style: 'Juego directo',
    description: 'Los set pieces son el arma principal: córneres, faltas y saques de banda trabajados',
    strengths: ['Máximo peligro en cualquier falta o córner', 'Opciones variadas en pelota parada', 'Independiente del juego en movimiento'],
    weaknesses: ['Predecible en juego abierto', 'Poco efectivo si el rival defiende bien los set pieces', 'Dependiente de la precisión en el lanzamiento'],
    recommendation: 'Entrena variantes de córner, libre directo y saque de banda largo. Tus set pieces son oportunidades de gol reales.',
    playstyleScores: { 'Dead Ball': 5, 'Whipped Pass': 3, 'Aerial Fortress': 3, 'Precision Header': 3, 'Long Throw': 3 },
    formationBonus: ['4-4-2', '5-3-2', '3-5-2', '5-4-1'],
  },
  {
    id: 'futbol_posicion',
    name: 'Fútbol de Posición',
    style: 'Posesión',
    description: 'Estructura posicional rígida con control espacial y líneas de pase predefinidas',
    strengths: ['Orden táctico impecable', 'Control de los espacios del campo', 'Difícil de presionar con eficacia'],
    weaknesses: ['Poco desequilibrio individual', 'Necesita alta inteligencia posicional', 'Lento para reaccionar en transición'],
    recommendation: 'Ocupa los carriles correctamente — cada posición tiene una función táctica específica. El movimiento colectivo lo es todo.',
    playstyleScores: { 'Pinged Pass': 4, 'Long Ball Pass': 3, 'Incisive Pass': 3, 'Block': 2, 'Anticipate': 2 },
    formationBonus: ['4-3-3 Holding', '4-1-4-1', '4-2-3-1'],
  },
  {
    id: 'equipo_tecnico',
    name: 'Equipo Técnico',
    style: 'Posesión',
    description: 'Regate, control individual y creatividad en espacios reducidos como seña de identidad',
    strengths: ['Completamente imprevisible para el rival', 'Genera superioridades 1v1 constantes', 'Alta calidad técnica bajo presión'],
    weaknesses: ['Tendencia al individualismo excesivo', 'Pérdidas por exceso de regate', 'Inconsistente sin disciplina táctica'],
    recommendation: 'Da libertad creativa a tus mejores jugadores, pero establece responsabilidades defensivas claras. La técnica individual es colectiva.',
    playstyleScores: { 'Technical': 5, 'Trickster': 4, 'Flair': 4, 'First Touch': 3, 'Acrobatic': 2 },
    formationBonus: ['4-3-3', '3-4-3', '4-3-3 False 9'],
  },
  {
    id: 'velocidad_explosiva',
    name: 'Velocidad Explosiva',
    style: 'Transiciones',
    description: 'Sprint, profundidad y cambios de ritmo explosivos como principal arma ofensiva',
    strengths: ['Rompe líneas defensivas con facilidad', 'Difícil de defender en profundidad', 'Genera superioridades numéricas rápidas'],
    weaknesses: ['Se agota en la segunda mitad', 'Pierde efectividad en espacios pequeños', 'Muy dependiente de la forma física'],
    recommendation: 'Prepara tu equipo físicamente para 90 minutos — la velocidad sin fondo físico dura solo media hora.',
    playstyleScores: { 'Quick Step': 5, 'Rapid': 5, 'Relentless': 2, 'Gamechanger': 2 },
    formationBonus: ['4-3-3', '3-4-3', '4-2-4', '2-3-5'],
  },
  {
    id: 'muro_defensivo',
    name: 'Muro Defensivo',
    style: 'Bloque bajo',
    description: 'Compacidad máxima entre líneas, sin conceder espacios y salida ordenada del balón',
    strengths: ['Extremadamente difícil de superar', 'Sólido en momentos de presión', 'Efectivo para mantener ventajas en el marcador'],
    weaknesses: ['Poca iniciativa y creatividad ofensiva', 'Cansancio mental acumulativo', 'Muy difícil de remontar partidos'],
    recommendation: 'La solidez defensiva gana puntos. No concedas espacios entre líneas y mantén el bloque compacto en todo momento.',
    playstyleScores: { 'Block': 5, 'Intercept': 4, 'Jockey': 4, 'Anticipate': 3, 'Aerial Fortress': 2, 'Slide Tackle': 2 },
    formationBonus: ['5-4-1', '5-3-2', '4-5-1', '4-4-2'],
  },
  {
    id: 'presion_con_balon',
    name: 'Presión con Balón',
    style: 'Presión alta',
    description: 'Posesión activa para forzar al rival a defender, combinada con pressing intenso sin balón',
    strengths: ['Controla el partido en ambas fases', 'Obliga al rival a estar siempre en modo defensivo', 'Mezcla eficaz de posesión y presión'],
    weaknesses: ['Requiere muy alta condición física y técnica', 'Difícil de mantener los 90 minutos completos', 'Necesita coordinación y automatismos perfectos'],
    recommendation: 'Usa el balón para agotar al rival — y cuando lo pierdas, presiona en bloque de forma inmediata.',
    playstyleScores: { 'Press Proven': 4, 'Tiki Taka': 3, 'Relentless': 3, 'Technical': 2, 'Incisive Pass': 2 },
    formationBonus: ['4-3-3 Holding', '4-2-3-1', '4-3-3'],
  },
  {
    id: 'juego_aereo',
    name: 'Juego Aéreo',
    style: 'Juego directo',
    description: 'Dominio de los duelos por alto, cabezazos al área y segundos balones como arma principal',
    strengths: ['Muy efectivo en el área rival en set pieces', 'Saca partido de todos los centros laterales', 'Difícil de defender en el área propia'],
    weaknesses: ['Muy predecible para el rival', 'Ineficaz contra rivales bajos y veloces', 'Poca eficacia en espacios cortos'],
    recommendation: 'Busca la cabeza de tu rematador en cada centro. Él es el punto final de todas las jugadas preparadas.',
    playstyleScores: { 'Aerial Fortress': 5, 'Precision Header': 5, 'Long Ball Pass': 3, 'Bruiser': 2, 'Dead Ball': 2 },
    formationBonus: ['4-4-2', '5-3-2', '3-5-2', 'WM'],
  },
  {
    id: 'creatividad_vertical',
    name: 'Creatividad Vertical',
    style: 'Transiciones',
    description: 'Invención individual combinada con verticalidad y profundidad constante',
    strengths: ['Completamente imprevisible para cualquier rival', 'Genera ocasiones desde situaciones improvisadas', 'Adaptable tácticamente en cada partido'],
    weaknesses: ['Inconsistente — depende del nivel individual del día', 'Pierde balones por riesgo innecesario', 'Difícil de entrenar con automatismos'],
    recommendation: 'Da libertad creativa con responsabilidad defensiva. La verticalidad debe ser colectiva, no solo individual.',
    playstyleScores: { 'Inventive': 5, 'Gamechanger': 4, 'Flair': 3, 'Acrobatic': 2, 'Chip Shot': 2 },
    formationBonus: ['4-2-3-1', '4-3-1-2', '3-4-3', '4-3-3 False 9'],
  },
  {
    id: 'bloque_medio',
    name: 'Bloque Medio',
    style: 'Mixto',
    description: 'Defensa organizada a media altura con transiciones controladas y equilibrio entre fases',
    strengths: ['Buen equilibrio defensivo-ofensivo', 'Adaptable a cualquier rival', 'Difícil de superar con ataques directos'],
    weaknesses: ['Sin especialización táctica clara', 'Puede ser superado por extremos con calidad', 'Necesita un portero muy sólido'],
    recommendation: 'Mantén el bloque entre los 35-50m. No te comprometas ni muy arriba ni muy abajo — el equilibrio es tu fortaleza.',
    playstyleScores: { 'Jockey': 3, 'Block': 3, 'Press Proven': 2, 'Pinged Pass': 2, 'Anticipate': 2 },
    formationBonus: ['4-3-3 Holding', '4-1-4-1', '4-2-3-1', '3-5-2'],
  },
  {
    id: 'equilibrado',
    name: 'Equipo Equilibrado',
    style: 'Mixto',
    description: 'Sin perfil dominante, el equipo se adapta tácticamente según el rival y el contexto',
    strengths: ['Versátil tácticamente en cualquier situación', 'Difícil de analizar para el rival', 'Puede adaptarse a cualquier sistema'],
    weaknesses: ['Sin identidad táctica clara', 'Difícil de entrenar con un modelo de juego definido', 'Puede ser superado por equipos especializados'],
    recommendation: 'Tu fortaleza es la versatilidad. Adapta el plan de partido a cada rival y explota sus debilidades específicas.',
    playstyleScores: {},
    formationBonus: [],
  },
];

export function computeTeamDNA(
  formation: string,
  players: Array<{ playstyle?: string }>
): TeamDNAType {
  const scores = TEAM_DNA_TYPES.map(dna => {
    let score = 0;
    players.forEach(p => {
      if (p.playstyle && dna.playstyleScores[p.playstyle]) {
        score += dna.playstyleScores[p.playstyle];
      }
    });
    if (dna.formationBonus.includes(formation)) {
      score += 3;
    }
    return { dna, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const winner = scores[0].score > 0
    ? scores[0].dna
    : TEAM_DNA_TYPES.find(d => d.id === 'equilibrado')!;

  return winner;
}
