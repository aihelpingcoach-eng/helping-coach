export type BodyView = 'front' | 'back';

export type InjuryZoneId =
  | 'cabeza'
  | 'hombro'
  | 'muneca-mano'
  | 'lumbar'
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

/** De arriba abajo: es también el orden de tabulación del mapa. */
export const INJURY_ZONES: InjuryZone[] = [
  { id: 'cabeza', label: 'Cabeza', injurySlugs: ['conmocion-cerebral'] },
  { id: 'hombro', label: 'Hombro', injurySlugs: ['luxacion-hombro', 'fractura-clavicula'] },
  { id: 'muneca-mano', label: 'Muñeca y mano', injurySlugs: ['esguince-muneca', 'fractura-metacarpiano'] },
  { id: 'lumbar', label: 'Zona lumbar', injurySlugs: ['sobrecarga-lumbar'] },
  {
    id: 'ingle',
    label: 'Ingle y aductores',
    injurySlugs: ['pubalgia', 'osteitis-pubis', 'hernia-deportista', 'tendinopatia-aductores', 'rotura-aductores', 'sobrecarga-aductores'],
  },
  {
    id: 'muslo-anterior',
    label: 'Muslo (delante)',
    injurySlugs: ['rotura-cuadriceps', 'rotura-recto-anterior', 'sobrecarga-cuadriceps', 'tendinitis-cudriceps', 'contusion-muscular'],
  },
  { id: 'muslo-posterior', label: 'Muslo (detrás)', injurySlugs: ['rotura-isquiotibiales', 'sobrecarga-isquiotibiales'] },
  {
    id: 'rodilla',
    label: 'Rodilla',
    injurySlugs: ['lca', 'lcp', 'meniscopatia', 'esguince-rodilla', 'esguince-lcm', 'condromalacia', 'tendinitis-rotuliana', 'sindrome-cintilla'],
  },
  { id: 'espinilla', label: 'Espinilla', injurySlugs: ['periostitis', 'fractura-estres'] },
  { id: 'gemelo', label: 'Gemelo', injurySlugs: ['rotura-gemelos', 'sobrecarga-gemelos', 'contusion-muscular'] },
  { id: 'tobillo', label: 'Tobillo', injurySlugs: ['esguince-tobillo', 'tendinitis-peroneos'] },
  { id: 'aquiles', label: 'Tendón de Aquiles', injurySlugs: ['tendinitis-aquilea'] },
  { id: 'pie', label: 'Pie', injurySlugs: ['fascitis-plantar', 'fractura-estres'] },
];

/** Grupo muscular del dibujo (slug de bodyMapPaths) → zona tocable, por vista. */
export const ZONE_BY_MUSCLE: Record<BodyView, Partial<Record<string, InjuryZoneId>>> = {
  front: {
    head: 'cabeza',
    hair: 'cabeza',
    deltoids: 'hombro',
    hands: 'muneca-mano',
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
    deltoids: 'hombro',
    hands: 'muneca-mano',
    'lower-back': 'lumbar',
    adductors: 'ingle',
    hamstring: 'muslo-posterior',
    calves: 'gemelo',
    ankles: 'aquiles',
    feet: 'pie',
  },
};
