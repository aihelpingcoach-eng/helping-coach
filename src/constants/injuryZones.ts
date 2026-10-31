export type BodyView = 'front' | 'back';

export type InjuryZoneId =
  | 'cabeza'
  | 'cuello'
  | 'hombro'
  | 'espalda-alta'
  | 'pecho'
  | 'brazo-codo'
  | 'muneca-mano'
  | 'abdomen'
  | 'lumbar'
  | 'gluteo'
  | 'ingle'
  | 'muslo-anterior'
  | 'muslo-posterior'
  | 'rodilla'
  | 'espinilla'
  | 'gemelo'
  | 'tobillo'
  | 'aquiles'
  | 'pie';

export interface InjuryZone {
  id: InjuryZoneId;
  label: string;
  /** Slugs de la tabla `injuries` que se muestran al tocar la zona */
  injurySlugs: string[];
}

/**
 * De arriba abajo: es el orden de pintado y de tabulación del mapa. El cuello
 * va antes que la cabeza porque su dibujo se mete bajo la barbilla.
 */
export const INJURY_ZONES: InjuryZone[] = [
  { id: 'cuello', label: 'Cuello', injurySlugs: ['esguince-cervical'] },
  { id: 'cabeza', label: 'Cabeza y cara', injurySlugs: ['conmocion-cerebral', 'fractura-nasal'] },
  { id: 'hombro', label: 'Hombro', injurySlugs: ['luxacion-hombro', 'lesion-acromioclavicular', 'fractura-clavicula'] },
  { id: 'espalda-alta', label: 'Espalda alta y trapecio', injurySlugs: ['contractura-trapecio'] },
  { id: 'pecho', label: 'Pecho y costillas', injurySlugs: ['fractura-costilla'] },
  { id: 'brazo-codo', label: 'Brazo y codo', injurySlugs: ['luxacion-codo', 'fractura-antebrazo'] },
  {
    id: 'muneca-mano',
    label: 'Muñeca y mano',
    injurySlugs: ['esguince-muneca', 'fractura-radio-distal', 'fractura-metacarpiano', 'esguince-dedo-mano'],
  },
  { id: 'abdomen', label: 'Abdomen', injurySlugs: ['distension-abdominal', 'hernia-deportista'] },
  { id: 'lumbar', label: 'Zona lumbar', injurySlugs: ['sobrecarga-lumbar', 'espondilolisis'] },
  {
    id: 'gluteo',
    label: 'Glúteo y cadera',
    injurySlugs: ['sindrome-piramidal', 'tendinopatia-glutea', 'tendinopatia-isquios-proximal'],
  },
  {
    id: 'ingle',
    label: 'Ingle y aductores',
    injurySlugs: [
      'pubalgia',
      'osteitis-pubis',
      'hernia-deportista',
      'tendinopatia-aductores',
      'rotura-aductores',
      'sobrecarga-aductores',
      'sobrecarga-psoas',
      'pinzamiento-cadera',
    ],
  },
  {
    id: 'muslo-anterior',
    label: 'Muslo (delante)',
    injurySlugs: ['rotura-cuadriceps', 'rotura-recto-anterior', 'sobrecarga-cuadriceps', 'tendinitis-cudriceps', 'contusion-muscular'],
  },
  {
    id: 'muslo-posterior',
    label: 'Muslo (detrás)',
    injurySlugs: ['rotura-isquiotibiales', 'sobrecarga-isquiotibiales', 'tendinopatia-isquios-proximal'],
  },
  {
    id: 'rodilla',
    label: 'Rodilla',
    injurySlugs: [
      'lca',
      'lcp',
      'meniscopatia',
      'esguince-rodilla',
      'esguince-lcm',
      'condromalacia',
      'tendinitis-rotuliana',
      'sindrome-cintilla',
      'osgood-schlatter',
    ],
  },
  { id: 'espinilla', label: 'Espinilla', injurySlugs: ['periostitis', 'fractura-estres'] },
  { id: 'gemelo', label: 'Gemelo', injurySlugs: ['rotura-gemelos', 'sobrecarga-gemelos', 'contusion-muscular'] },
  {
    id: 'tobillo',
    label: 'Tobillo',
    injurySlugs: ['esguince-tobillo', 'esguince-sindesmosis', 'tendinitis-peroneos', 'pinzamiento-tobillo'],
  },
  { id: 'aquiles', label: 'Talón y Aquiles', injurySlugs: ['tendinitis-aquilea', 'enfermedad-sever'] },
  {
    id: 'pie',
    label: 'Pie',
    injurySlugs: ['fascitis-plantar', 'fractura-quinto-metatarsiano', 'turf-toe', 'fractura-estres'],
  },
];

/** Grupo muscular del dibujo (slug de bodyMapPaths) → zona tocable, por vista. */
export const ZONE_BY_MUSCLE: Record<BodyView, Partial<Record<string, InjuryZoneId>>> = {
  front: {
    head: 'cabeza',
    hair: 'cabeza',
    neck: 'cuello',
    trapezius: 'espalda-alta',
    deltoids: 'hombro',
    chest: 'pecho',
    biceps: 'brazo-codo',
    triceps: 'brazo-codo',
    forearm: 'brazo-codo',
    hands: 'muneca-mano',
    abs: 'abdomen',
    obliques: 'abdomen',
    adductors: 'ingle',
    quadriceps: 'muslo-anterior',
    knees: 'rodilla',
    tibialis: 'espinilla',
    calves: 'gemelo',
    ankles: 'tobillo',
    feet: 'pie',
  },
  back: {
    head: 'cabeza',
    hair: 'cabeza',
    neck: 'cuello',
    trapezius: 'espalda-alta',
    'upper-back': 'espalda-alta',
    deltoids: 'hombro',
    triceps: 'brazo-codo',
    forearm: 'brazo-codo',
    hands: 'muneca-mano',
    'lower-back': 'lumbar',
    gluteal: 'gluteo',
    adductors: 'ingle',
    hamstring: 'muslo-posterior',
    calves: 'gemelo',
    ankles: 'aquiles',
    feet: 'pie',
  },
};
