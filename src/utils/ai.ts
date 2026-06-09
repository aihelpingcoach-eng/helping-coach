import { supabase } from '../lib/supabase';

interface PlaystyleAnalysisResult {
  playstyle: string;
  category: string;
  explanation: string;
}

interface AIServiceResponse {
  response?: string;
  error?: string;
  message?: string;
  mockResponse?: string;
}

async function callAIService(
  coachType: 'helpin_coach' | 'nursing_coach' | 'training_coach' | 'player_analysis' | 'player_progression' | 'team_dna' | 'role_assignment' | 'coach_progression' | 'synergy_analysis' | 'team_synergy_analysis' | 'match_report' | 'formation_advisor',
  message: string,
  context: any
): Promise<string> {
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-service`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        coachType,
        message,
        context,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI service error response:', errorText);
      throw new Error(`Error del servicio de IA: ${response.status}`);
    }

    const data: AIServiceResponse = await response.json();

    if (data.error === 'mock') {
      return data.mockResponse || 'IA en modo prueba';
    }

    if (data.error === 'unavailable') {
      throw new Error(data.message || 'El coach no está disponible ahora mismo');
    }

    return data.response || '';
  } catch (error) {
    console.error('Error calling AI service:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('El coach no está disponible ahora mismo. Inténtalo de nuevo.');
  }
}

export async function analyzePlayerPlaystyle(
  description: string,
  playerName: string
): Promise<PlaystyleAnalysisResult> {
  try {
    const userPrompt = `Analiza este jugador:

Nombre: ${playerName}
Descripción: ${description}

Asigna el PlayStyle más adecuado y explica tu elección.`;

    const response = await callAIService(
      'player_analysis',
      userPrompt,
      { playerName, description }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);

    if (!result.playstyle || !result.category || !result.explanation) {
      throw new Error('Invalid response structure from AI');
    }

    return {
      playstyle: result.playstyle,
      category: result.category,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error('Error analyzing player:', error);
    if (error instanceof Error) {
      throw new Error(`No se pudo analizar el jugador: ${error.message}`);
    }
    throw new Error('No se pudo analizar el jugador. Inténtalo de nuevo.');
  }
}

export async function chatWithCoach(
  coachType: 'helpin' | 'nursing' | 'training',
  message: string,
  context: any
): Promise<string> {
  const coachTypeMap = {
    helpin: 'helpin_coach' as const,
    nursing: 'nursing_coach' as const,
    training: 'training_coach' as const,
  };

  try {
    const response = await callAIService(
      coachTypeMap[coachType],
      message,
      context
    );

    return response;
  } catch (error) {
    console.error('Error chatting with coach:', error);
    throw error;
  }
}

interface TeamDNAResult {
  team_dna: string;
  style: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export async function analyzeTeamDNA(
  formation: string,
  players: Array<{ name: string; position: string; playstyle: string }>
): Promise<TeamDNAResult> {
  try {
    const playersText = players
      .map(p => `- ${p.name} (${p.position}): ${p.playstyle}`)
      .join('\n');

    const userPrompt = `Información del equipo:
Formación: ${formation}
Jugadores y PlayStyles:
${playersText}`;

    const response = await callAIService('team_dna', userPrompt, { formation, players });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error analyzing team DNA:', error);
    throw new Error('No se pudo analizar el ADN del equipo');
  }
}

interface RoleAssignmentResult {
  player: string;
  position: string;
  role: string;
  description: string;
}

export async function assignPlayerRole(
  playerName: string,
  position: string,
  playstyle: string
): Promise<RoleAssignmentResult> {
  try {
    const userPrompt = `Jugador:
Nombre: ${playerName}
Posición: ${position}
PlayStyle: ${playstyle}`;

    const response = await callAIService('role_assignment', userPrompt, {
      playerName,
      position,
      playstyle,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw new Error('No se pudo asignar el rol');
  }
}

interface CoachProgressionResult {
  current_rank: string;
  progress_percent: number;
  strengths: string[];
  next_objectives: string[];
  next_rank: string;
}

export async function analyzeCoachProgression(
  matches: number,
  victories: number,
  playersDeveloped: number,
  injuriesManaged: number
): Promise<CoachProgressionResult> {
  try {
    const userPrompt = `Datos del entrenador:
Partidos dirigidos: ${matches}
Victorias: ${victories}
Jugadores desarrollados: ${playersDeveloped}
Lesiones gestionadas: ${injuriesManaged}`;

    const response = await callAIService('coach_progression', userPrompt, {
      matches,
      victories,
      playersDeveloped,
      injuriesManaged,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error analyzing coach progression:', error);
    throw new Error('No se pudo analizar la progresión');
  }
}

interface SynergyAnalysisResult {
  synergy_level: 'yellow' | 'orange' | 'green' | 'purple';
  explanation: string;
}

export async function analyzeSynergy(
  playerA: { position: string; playstyle: string; role: string },
  playerB: { position: string; playstyle: string; role: string }
): Promise<SynergyAnalysisResult> {
  try {
    const userPrompt = `Jugador A:
Posición: ${playerA.position}
PlayStyle: ${playerA.playstyle}
Rol: ${playerA.role}

Jugador B:
Posición: ${playerB.position}
PlayStyle: ${playerB.playstyle}
Rol: ${playerB.role}`;

    const response = await callAIService('synergy_analysis', userPrompt, {
      playerA,
      playerB,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error analyzing synergy:', error);
    throw new Error('No se pudo analizar la sinergia');
  }
}

interface MatchReportResult {
  summary: string;
  key_players: string[];
  issues: string[];
  recommendations: string[];
}

export async function generateMatchReport(
  result: string,
  possession: number,
  shots: number,
  teamPlaystyles: string[]
): Promise<MatchReportResult> {
  try {
    const playstyleText = teamPlaystyles.join(', ');

    const userPrompt = `Datos del partido:
Resultado: ${result}
Posesión: ${possession}%
Tiros: ${shots}
PlayStyles del equipo:
${playstyleText}`;

    const response = await callAIService('match_report', userPrompt, {
      result,
      possession,
      shots,
      teamPlaystyles,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result2 = JSON.parse(jsonMatch[0]);
    return result2;
  } catch (error) {
    console.error('Error generating match report:', error);
    throw new Error('No se pudo generar el informe');
  }
}

interface FormationRecommendationResult {
  recommended_formation: string;
  style: string;
  reason: string;
  strengths: string[];
  risks: string[];
  ideal_scenario: string;
}

export async function recommendFormation(
  currentFormation: string,
  tacticalObjective: string,
  physicalState: string,
  players: Array<{ name: string; position: string; playstyle: string }>
): Promise<FormationRecommendationResult> {
  try {
    const playersText = players
      .map(p => `- ${p.name} (${p.position}): ${p.playstyle}`)
      .join('\n');

    const userPrompt = `Información del equipo:
Formación actual: ${currentFormation}
Objetivo táctico del entrenador: ${tacticalObjective}
Estado físico del equipo: ${physicalState}

Jugadores disponibles y PlayStyles:
${playersText}`;

    const response = await callAIService('formation_advisor', userPrompt, {
      currentFormation,
      tacticalObjective,
      physicalState,
      players,
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error recommending formation:', error);
    throw new Error('No se pudo recomendar una formación');
  }
}

interface TeamSynergyResult {
  synergies: Array<{
    player_a: string;
    player_b: string;
    color: 'yellow' | 'orange' | 'green' | 'purple';
    reason: string;
  }>;
}

export async function analyzeTeamSynergies(
  formation: string,
  players: Array<{ name: string; position: string; playstyle: string; position_index: number; x: number; y: number }>
): Promise<TeamSynergyResult> {
  try {
    // Calcular todos los pares de jugadores cercanos en el campo (distancia < 40 unidades)
    const nearbyPairs: Array<[string, string]> = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const dx = players[i].x - players[j].x;
        const dy = players[i].y - players[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 40) {
          nearbyPairs.push([players[i].name, players[j].name]);
        }
      }
    }

    // Si no hay pares cercanos, usar todos los pares posibles
    const pairs = nearbyPairs.length > 0 ? nearbyPairs :
      players.flatMap((p, i) => players.slice(i + 1).map(q => [p.name, q.name] as [string, string]));

    const playersText = players
      .map(p => `- ${p.name} (Pos ${p.position_index}): PlayStyle "${p.playstyle}"`)
      .join('\n');

    const pairsText = pairs
      .map(([a, b]) => `${a} ↔ ${b}`)
      .join('\n');

    const userPrompt = `Formación: ${formation}

Jugadores:
${playersText}

Asigna color (yellow/orange/green/purple) a CADA par. Reason muy breve (max 5 palabras). NO omitas ninguno:
${pairsText}`;

    const response = await callAIService('team_synergy_analysis', userPrompt, {
      formation,
      players,
    });

    // Extraer JSON robusto: buscar el primer { y parsear con balance de llaves
    let jsonStr = '';
    const start = response.indexOf('{');
    if (start === -1) throw new Error('No JSON in response');
    let depth = 0;
    for (let i = start; i < response.length; i++) {
      if (response[i] === '{') depth++;
      else if (response[i] === '}') depth--;
      jsonStr += response[i];
      if (depth === 0) break;
    }

    const result = JSON.parse(jsonStr);
    return result;
  } catch (error) {
    console.error('Error analyzing team synergies:', error);
    throw new Error('No se pudo analizar las sinergias del equipo');
  }
}
