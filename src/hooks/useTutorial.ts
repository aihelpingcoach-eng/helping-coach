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
    title: '¡Bienvenido Coach!',
    description: 'Eres ahora el entrenador de un equipo de fútbol. Tu misión: mejorar a tus jugadores, analizar sinergias y tomar decisiones estratégicas con inteligencia artificial.',
    element: 'tutorial-welcome',
    action: 'none',
  },
  {
    id: 1,
    title: 'Tu Alineación Táctica',
    description: 'Aquí construyes tu equipo. Cada hexágono es una posición. Toca cualquiera para añadir un jugador y describe sus características.',
    element: 'tutorial-field',
    action: 'click',
  },
  {
    id: 2,
    title: 'Crea tu Primer Jugador',
    description: 'Cuéntale a la IA sobre tu jugador: nombre, posición, habilidades y estilo. La inteligencia artificial analizará automáticamente su rol en el equipo.',
    element: 'tutorial-player-input',
    action: 'input',
  },
  {
    id: 3,
    title: 'Química de Equipo',
    description: 'Observa las líneas que conectan jugadores. El color púrpura más intenso = mejor química. Las sinergias son clave para ganar.',
    element: 'tutorial-synergies',
    action: 'none',
  },
  {
    id: 4,
    title: 'Coach IA Inteligente',
    description: 'Tu asistente táctico está aquí. Consulta estrategias, pide análisis de formaciones, y recibe recomendaciones basadas en IA.',
    element: 'tutorial-coach',
    action: 'click',
  },
  {
    id: 5,
    title: 'Herramientas Disponibles',
    description: 'Entrenamiento • Lesiones • Progreso • Tácticas • Análisis. Cada modo te ayuda a mejorar tu equipo de diferentes maneras.',
    element: 'tutorial-modes',
    action: 'none',
  },
  {
    id: 6,
    title: '¡Adelante, Entrenador!',
    description: 'Ya tienes todas las herramientas. Ahora comienza a construir tu dinastía. ¡Tu equipo está esperando ordenes!',
    element: 'tutorial-final',
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
