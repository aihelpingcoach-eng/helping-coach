import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  element?: string;
  action?: 'click' | 'input' | 'none';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 0,
    title: '¡Bienvenido, Entrenador!',
    description: 'Helping Coach es tu centro de mando táctico. Aquí construyes tu plantilla, analizas sinergias con IA, gestionas el entrenamiento y llevas el control total de tu equipo. Vamos a recorrer cada función juntos.',
    action: 'none',
  },
  {
    id: 1,
    title: 'El Campo Táctico',
    description: 'La pantalla principal es tu campo de juego. Cada hexágono representa una posición en tu formación. Toca cualquier posición vacía para asignar un jugador. Los jugadores asignados muestran su nombre, nivel y PlayStyle al instante.',
    element: 'tutorial-field',
    action: 'click',
  },
  {
    id: 2,
    title: 'Elige tu Formación',
    description: 'Tienes más de 20 sistemas tácticos disponibles: 4-3-3, 4-2-3-1, 5-3-2, 3-4-3 y muchos más. Cambia de formación desde el selector superior y el campo se adapta automáticamente con las posiciones correctas.',
    element: 'tutorial-formation',
    action: 'none',
  },
  {
    id: 3,
    title: 'Añade Jugadores con IA',
    description: 'Describe a tu jugador y la inteligencia artificial le asignará un PlayStyle automáticamente. Puedes elegir entre más de 40 estilos de juego únicos: desde "Tiki Taka" hasta "Aerial Fortress". Cada jugador tiene nivel, posición y explicación táctica propia.',
    element: 'tutorial-player-input',
    action: 'input',
  },
  {
    id: 4,
    title: 'PlayStyles: La Identidad de Cada Jugador',
    description: 'Los PlayStyles son el corazón del sistema. Hay 6 categorías: Finalización, Pase, Control, Defensa, Físico y Portería. Un jugador "Trickster" desequilibra en el 1v1; un "Press Proven" domina la presión. El PlayStyle define cómo contribuye cada jugador al equipo.',
    action: 'none',
  },
  {
    id: 5,
    title: 'Sinergias del Equipo',
    description: 'Pulsa el botón de sinergias para analizar la química entre los jugadores más cercanos en el campo. La IA evalúa cada pareja y genera líneas de conexión: cuanto más brillante la línea, mejor la sinergia táctica. Es la clave para saber si tu once está bien construido.',
    element: 'tutorial-synergies',
    action: 'none',
  },
  {
    id: 6,
    title: 'Asesor de Formaciones',
    description: 'El botón de bombilla (arriba a la derecha en Tácticas) activa el Asesor de Formaciones. Describe el estilo de juego que buscas y la IA te recomendará la formación óptima explicando sus fortalezas, riesgos y el escenario ideal para usarla. Puedes aplicarla directamente al campo.',
    action: 'none',
  },
  {
    id: 7,
    title: 'Modo Entrenamiento',
    description: 'Accede a una biblioteca de 86 ejercicios organizados en 5 categorías: Fuerza, Táctico, Resistencia, Pliometría y Prevención. Cada ejercicio incluye ilustración, duración, beneficio y descripción técnica. Crea sesiones personalizadas seleccionando ejercicios y guárdalas en tu historial.',
    element: 'tutorial-modes',
    action: 'none',
  },
  {
    id: 8,
    title: 'Modo Lesiones',
    description: 'Base de datos completa de lesiones del fútbol organizada por zonas: tobillo, rodilla, muslo, hombro y más. Cada lesión incluye qué es, cómo ocurre, tratamiento recomendado y protocolo de prevención. Ideal para tener siempre a mano la información médica de tu plantilla.',
    action: 'none',
  },
  {
    id: 9,
    title: 'Modo Progresión',
    description: 'Aquí evalúas el rendimiento de cada jugador. Desliza hacia la derecha para subir su nivel, hacia la izquierda para bajarlo. Cada evaluación queda registrada en el historial de progresión. El sistema escala del nivel 1 al 99 y se refleja en las estadísticas del jugador.',
    action: 'none',
  },
  {
    id: 10,
    title: 'Calendario de Partidos',
    description: 'Registra todos tus partidos: rival, fecha, lugar y competición. Después del partido anota el resultado (goles a favor y en contra) para llevar el historial completo. El sistema calcula automáticamente tu estadística W-D-L y la diferencia de goles de la temporada.',
    action: 'none',
  },
  {
    id: 11,
    title: 'ADN del Equipo',
    description: 'En el Modo Avanzado encontrarás el análisis de ADN del equipo. El sistema evalúa los PlayStyles de tus jugadores y tu formación para identificar tu identidad táctica real entre 20 posibles perfiles: Tiki-Taka, Gegenpressing, Contragolpe Letal, Muro Defensivo y más. Sin IA — siempre consistente.',
    action: 'none',
  },
  {
    id: 12,
    title: 'Modo Avanzado: Centro de Mando',
    description: 'El modo Avanzado agrupa las herramientas de alto nivel: Alertas tácticas, Eventos del equipo, Carga de trabajo, Misiones del coach, Carrera profesional, ADN del equipo e Informe de partido generado con IA. Es donde tomas las grandes decisiones estratégicas.',
    action: 'none',
  },
  {
    id: 13,
    title: 'Tu Perfil de Entrenador',
    description: 'Cada acción en la app te da XP: añadir jugadores, consultar la IA, registrar partidos, completar sesiones de entrenamiento. Sube de rango desde Entrenador Amateur hasta Leyenda. Tu perfil muestra estadísticas completas de tu actividad como coach.',
    action: 'none',
  },
  {
    id: 14,
    title: 'Coach IA: Tu Asistente Personal',
    description: 'El chat con IA está disponible en todo momento. Pregúntale sobre tácticas, pídele que analice una formación específica, consulta cómo contrarrestar un sistema rival, o solicita un plan de entrenamiento. Está entrenado en fútbol moderno y responde como un analista táctico profesional.',
    element: 'tutorial-coach',
    action: 'click',
  },
  {
    id: 15,
    title: '¡Todo listo, Entrenador!',
    description: 'Ya conoces todas las herramientas de Helping Coach. Empieza añadiendo a tus jugadores reales, construye tu formación y deja que la IA te ayude a encontrar la mejor versión de tu equipo. ¡Tu plantilla está esperando órdenes!',
    action: 'none',
  },
];

export function useTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCurrentStep(data.current_step);
        setIsCompleted(data.is_completed);
        setIsSkipped(data.skipped);
        setIsOpen(!data.is_completed && !data.skipped);
      } else {
        // First time user
        setIsOpen(true);
        setCurrentStep(0);
        await createTutorialProgress();
      }
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTutorialProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('tutorial_progress')
        .insert({
          user_id: user.id,
          current_step: 0,
          is_completed: false,
          skipped: false,
        });
    } catch (error) {
      console.error('Error creating tutorial progress:', error);
    }
  };

  const updateProgress = useCallback(async (step: number, completed: boolean = false, skipped: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updateData: any = {
        current_step: step,
        is_completed: completed,
        skipped: skipped,
      };

      if (completed) {
        updateData.completed_at = new Date().toISOString();
      }

      await supabase
        .from('tutorial_progress')
        .update(updateData)
        .eq('user_id', user.id);

      if (completed) {
        await supabase
          .from('coach_profiles')
          .update({ tutorial_completed: true })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
    }
  }, []);

  const nextStep = useCallback(async () => {
    const next = currentStep + 1;
    if (next >= TUTORIAL_STEPS.length) {
      setIsCompleted(true);
      setIsOpen(false);
      await updateProgress(next, true, false);
    } else {
      setCurrentStep(next);
      await updateProgress(next, false, false);
    }
  }, [currentStep, updateProgress]);

  const skipTutorial = useCallback(async () => {
    setIsSkipped(true);
    setIsOpen(false);
    await updateProgress(currentStep, false, true);
  }, [currentStep, updateProgress]);

  const restartTutorial = useCallback(async () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setIsSkipped(false);
    setIsOpen(true);
    await updateProgress(0, false, false);
  }, [updateProgress]);

  const closeTutorial = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    currentStep,
    isOpen,
    isCompleted,
    isSkipped,
    isLoading,
    nextStep,
    skipTutorial,
    restartTutorial,
    closeTutorial,
    steps: TUTORIAL_STEPS,
  };
}
