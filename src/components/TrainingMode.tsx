import { useState } from 'react';
import { MessageCircle, Zap, Brain, Heart } from 'lucide-react';
import CoachChat from './CoachChat';
import { useCoachProfile } from '../hooks/useCoachProfile';
import { useXP } from '../hooks/useXP';
import RankUpModal from './RankUpModal';

type TrainingCategory = 'fuerza' | 'tactico' | 'resistencia';

interface Exercise {
  name: string;
  description: string;
  duration: string;
  benefit: string;
}

const EXERCISES: Record<TrainingCategory, Exercise[]> = {
  fuerza: [
    {
      name: 'Sentadillas con peso',
      description: 'Fortalece cuádriceps, glúteos e isquiotibiales. Fundamental para potencia de salto y sprint.',
      duration: '3 series de 10-12 reps',
      benefit: 'Aumenta fuerza de piernas y potencia explosiva',
    },
    {
      name: 'Core con balón medicinal',
      description: 'Rotaciones, lanzamientos y ejercicios de estabilidad con balón medicinal.',
      duration: '4 series de 15 reps',
      benefit: 'Fortalece el core para mejor equilibrio y protección de espalda',
    },
    {
      name: 'Ejercicios pliométricos',
      description: 'Saltos en cajón, saltos laterales, drop jumps para potencia explosiva.',
      duration: '3 series de 8-10 saltos',
      benefit: 'Mejora aceleración y salto vertical',
    },
    {
      name: 'Trabajo de aductores',
      description: 'Fortalecimiento específico de aductores con máquina o bandas elásticas.',
      duration: '3 series de 12 reps',
      benefit: 'Previene pubalgias y mejora cambios de dirección',
    },
    {
      name: 'Peso muerto rumano',
      description: 'Fortalecimiento de cadena posterior: isquiotibiales, glúteos y espalda baja.',
      duration: '4 series de 8-10 reps',
      benefit: 'Aumenta potencia de sprint y previene lesiones isquiotibiales',
    },
    {
      name: 'Estocadas con salto',
      description: 'Estocadas explosivas alternando piernas con impulso hacia arriba.',
      duration: '3 series de 12 reps por pierna',
      benefit: 'Desarrolla potencia unilateral y equilibrio dinámico',
    },
    {
      name: 'Plancha isométrica con variantes',
      description: 'Planchas frontales, laterales y con elevación de extremidades.',
      duration: '4 series de 45-60 segundos',
      benefit: 'Estabilidad del core y resistencia muscular',
    },
    {
      name: 'Press de banca',
      description: 'Fortalecimiento del tren superior: pecho, hombros y tríceps.',
      duration: '3 series de 10 reps',
      benefit: 'Mejora fuerza en disputas y protección del balón',
    },
    {
      name: 'Trabajo con TRX',
      description: 'Ejercicios de suspensión para fuerza funcional y estabilidad.',
      duration: '3 series de 12-15 reps',
      benefit: 'Fortalece músculos estabilizadores y mejora propiocepción',
    },
    {
      name: 'Escaladores con velocidad',
      description: 'Mountain climbers a alta velocidad manteniendo técnica correcta.',
      duration: '4 series de 30 segundos',
      benefit: 'Combina fuerza de core con acondicionamiento',
    },
  ],
  tactico: [
    {
      name: 'Rondo de posesión',
      description: 'Círculo de jugadores manteniendo posesión contra defensores en el centro.',
      duration: '15-20 minutos',
      benefit: 'Mejora toma de decisiones bajo presión y trabajo en equipo',
    },
    {
      name: 'Juego de posición',
      description: 'Ejercicio de posesión en espacios reducidos con superioridad numérica.',
      duration: '20 minutos',
      benefit: 'Desarrolla automatismos de juego y movimientos colectivos',
    },
    {
      name: 'Situaciones de 2v1 y 3v2',
      description: 'Superioridades numéricas en espacios reducidos para finalización.',
      duration: '15 minutos',
      benefit: 'Mejora asociación ofensiva y definición',
    },
    {
      name: 'Transiciones defensa-ataque',
      description: 'Recuperación de balón y ataque rápido en diferentes zonas del campo.',
      duration: '20 minutos',
      benefit: 'Desarrolla rapidez mental y cambio de chip',
    },
    {
      name: 'Salida de presión desde atrás',
      description: 'Práctica de construcción de juego contra pressing rival organizado.',
      duration: '25 minutos',
      benefit: 'Mejora circulación bajo presión y toma de decisiones',
    },
    {
      name: 'Defensas de línea y fuera de juego',
      description: 'Sincronización de línea defensiva con activación de fuera de juego.',
      duration: '20 minutos',
      benefit: 'Coordinación defensiva y comunicación entre líneas',
    },
    {
      name: 'Juego de bandas y centros',
      description: 'Progresión por banda, desmarques y remate de centros al área.',
      duration: '25 minutos',
      benefit: 'Perfecciona juego exterior y movimientos en área',
    },
    {
      name: 'Finalización tras robo',
      description: 'Presión alta, recuperación y remate inmediato con superioridad.',
      duration: '20 minutos',
      benefit: 'Desarrolla mentalidad de contragolpe rápido',
    },
    {
      name: 'Balones divididos y segundas jugadas',
      description: 'Disputas aéreas y llegada a rechaces en zona de finalización.',
      duration: '15 minutos',
      benefit: 'Mejora agresividad ofensiva y anticipación',
    },
    {
      name: 'Organización en defensa de córneres',
      description: 'Marcaje zonal y mixto en jugadas de estrategia defensiva.',
      duration: '15 minutos',
      benefit: 'Reduce goles en contra por jugadas a balón parado',
    },
    {
      name: 'Circulación y cambio de orientación',
      description: 'Ejercicio de posesión con cambios de banda para desestabilizar.',
      duration: '20 minutos',
      benefit: 'Amplía visión de juego y genera espacios',
    },
    {
      name: 'Repliegue intensivo organizado',
      description: 'Retroceso ordenado tras pérdida con basculación y coberturas.',
      duration: '20 minutos',
      benefit: 'Organización defensiva y prevención de contragolpes',
    },
  ],
  resistencia: [
    {
      name: 'Intervalos de alta intensidad',
      description: 'Sprints de 30 segundos alternados con 30 segundos de trote.',
      duration: '10-12 repeticiones',
      benefit: 'Mejora capacidad aeróbica y recuperación entre esfuerzos',
    },
    {
      name: 'Fartlek con balón',
      description: 'Cambios de ritmo conduciendo el balón en diferentes intensidades.',
      duration: '20-25 minutos',
      benefit: 'Combina resistencia con habilidad técnica',
    },
    {
      name: 'Circuito de estaciones',
      description: 'Rotación por diferentes ejercicios: sprints, saltos, conducción, tiro.',
      duration: '25-30 minutos',
      benefit: 'Resistencia muscular y cardiovascular específica',
    },
    {
      name: 'Partido reducido continuo',
      description: 'Partido en espacio reducido sin paradas prolongadas.',
      duration: '20 minutos',
      benefit: 'Resistencia en situación real de juego',
    },
    {
      name: 'Carreras en escalera (Yoyo Test)',
      description: 'Carreras de ida y vuelta con incremento progresivo de velocidad.',
      duration: '15-20 minutos',
      benefit: 'Evalúa y mejora resistencia anaeróbica láctica',
    },
    {
      name: 'Cambios de ritmo en campo completo',
      description: 'Sprint diagonal, trote lateral, sprint frontal en secuencia continua.',
      duration: '8-10 repeticiones',
      benefit: 'Simula esfuerzos variables del partido real',
    },
    {
      name: 'Carrera continua 70-75% FCmax',
      description: 'Trote sostenido a ritmo moderado para base aeróbica.',
      duration: '30-40 minutos',
      benefit: 'Desarrolla capacidad aeróbica de fondo',
    },
    {
      name: 'Series de 400m',
      description: 'Carreras de 400 metros a ritmo alto con recuperación activa.',
      duration: '6-8 repeticiones',
      benefit: 'Potencia resistencia específica de medio fondo',
    },
    {
      name: 'Juego reducido con zonas',
      description: 'Partido con restricción de que jugadores deben cambiar de zona.',
      duration: '4 series de 5 minutos',
      benefit: 'Resistencia con alta demanda cognitiva',
    },
    {
      name: 'Tabata de ejercicios mixtos',
      description: '20 segundos trabajo intenso, 10 segundos descanso con burpees, sprints, etc.',
      duration: '8 rounds (4 minutos)',
      benefit: 'Máxima mejora de VO2max en corto tiempo',
    },
    {
      name: 'Recuperaciones activas post-sprint',
      description: 'Sprint máximo seguido de trote suave inmediato para recuperación.',
      duration: '10-12 repeticiones',
      benefit: 'Mejora capacidad de recuperación durante el partido',
    },
    {
      name: 'Entrenamiento en umbrales',
      description: 'Carreras a ritmo de umbral anaeróbico mantenido.',
      duration: '3-4 series de 8-10 minutos',
      benefit: 'Aumenta umbral láctico y resistencia a alta intensidad',
    },
  ],
};

export default function TrainingMode() {
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>('fuerza');
  const [showCoachChat, setShowCoachChat] = useState(false);
  const { profile: coachProfile } = useCoachProfile();
  const { giveXP, showRankUpModal, newRank, closeRankUpModal } = useXP();

  const categories = [
    { id: 'fuerza' as TrainingCategory, name: 'Fuerza', icon: Zap, color: 'bg-yellow-600' },
    { id: 'tactico' as TrainingCategory, name: 'Táctico', icon: Brain, color: 'bg-purple-600' },
    { id: 'resistencia' as TrainingCategory, name: 'Resistencia', icon: Heart, color: 'bg-red-600' },
  ];

  return (
    <div className="relative w-full h-full min-h-screen pb-32 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Entrenamiento</h1>
        <p className="text-gray-400 mb-8">Ejercicios para mejorar el rendimiento de tus jugadores</p>

        <div className="flex gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} text-white scale-105`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISES[selectedCategory].map((exercise, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-900/20 to-black border-2 border-orange-800/50 rounded-xl p-6 hover:border-orange-600 transition-all"
            >
              <h3 className="text-2xl font-bold text-white mb-3">{exercise.name}</h3>
              <p className="text-gray-300 mb-4">{exercise.description}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 font-semibold">Duración:</span>
                  <span className="text-gray-200">{exercise.duration}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 font-semibold">Beneficio:</span>
                  <span className="text-gray-200">{exercise.benefit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCoachChat(true)}
          className="fixed bottom-32 right-8 z-20 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full transition-all hover:scale-110 shadow-2xl"
          title="Training Coach"
        >
          <MessageCircle size={32} />
        </button>

        {showCoachChat && (
          <CoachChat
            coachType="training"
            onClose={() => setShowCoachChat(false)}
            context={{
              mode: 'training',
              category: selectedCategory,
              coachProfile,
            }}
            onXPEarned={() => giveXP('CONSULT_AI')}
          />
        )}

        {showRankUpModal && newRank && (
          <RankUpModal rank={newRank} onClose={closeRankUpModal} />
        )}
      </div>
    </div>
  );
}
