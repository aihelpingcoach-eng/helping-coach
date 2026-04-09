export interface InjuryDetail {
  id: string;
  name: string;
  whatIs: string;
  howItHappens: string;
  treatment: string;
  prevention: string;
}

export interface InjuryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  injuries: InjuryDetail[];
}

export const INJURY_CATEGORIES: InjuryCategory[] = [
  {
    id: 'esguinces',
    name: 'Esguinces',
    icon: 'ankle',
    color: 'from-red-500 to-orange-500',
    injuries: [
      {
        id: 'esguince-tobillo',
        name: 'Esguince de tobillo',
        whatIs: 'Lesión en los ligamentos del tobillo causada por una torsión o estiramiento excesivo.',
        howItHappens: 'Al apoyar mal el pie, en cambios bruscos de dirección, saltos o contacto con otro jugador.',
        treatment: 'Reposo, hielo, compresión y elevación (RICE). Fisioterapia progresiva y vendaje funcional.',
        prevention: 'Fortalecimiento del tobillo, ejercicios propioceptivos, buen calentamiento y calzado adecuado.',
      },
      {
        id: 'esguince-rodilla',
        name: 'Esguince de rodilla',
        whatIs: 'Daño en los ligamentos de la rodilla por movimientos forzados o impactos.',
        howItHappens: 'Giros bruscos, frenadas repentinas o choques durante el juego.',
        treatment: 'Reposo, inmovilización parcial, fisioterapia y en casos graves intervención médica.',
        prevention: 'Trabajo de fuerza en piernas, estabilidad articular y técnica correcta de movimiento.',
      },
      {
        id: 'esguince-lcm',
        name: 'Esguince de ligamento colateral medial',
        whatIs: 'Lesión del ligamento lateral interno de la rodilla.',
        howItHappens: 'Impacto lateral en la rodilla o movimientos de valgo forzado.',
        treatment: 'Inmovilización con ortesis, fisioterapia y fortalecimiento progresivo.',
        prevention: 'Trabajo de estabilidad de rodilla y fortalecimiento de aductores.',
      },
      {
        id: 'esguince-muneca',
        name: 'Esguince de muñeca',
        whatIs: 'Lesión de los ligamentos de la muñeca, común en porteros.',
        howItHappens: 'Caídas apoyando la mano o atajadas forzadas.',
        treatment: 'Inmovilización temporal, hielo y fisioterapia.',
        prevention: 'Fortalecimiento de muñeca y técnica correcta de caída.',
      },
    ],
  },
  {
    id: 'sobrecargas',
    name: 'Sobrecargas musculares',
    icon: 'muscle',
    color: 'from-yellow-500 to-orange-500',
    injuries: [
      {
        id: 'sobrecarga-gemelos',
        name: 'Sobrecarga de gemelos',
        whatIs: 'Fatiga excesiva del músculo del gemelo sin rotura de fibras.',
        howItHappens: 'Exceso de carga, falta de descanso o mala recuperación entre entrenamientos.',
        treatment: 'Descanso activo, masaje deportivo, estiramientos suaves y control de cargas.',
        prevention: 'Planificación adecuada de entrenamientos y buena hidratación.',
      },
      {
        id: 'sobrecarga-isquiotibiales',
        name: 'Sobrecarga de isquiotibiales',
        whatIs: 'Acumulación de fatiga en los músculos posteriores del muslo.',
        howItHappens: 'Entrenamientos intensos, sprints repetidos o falta de calentamiento.',
        treatment: 'Reducción de carga, fisioterapia y trabajo excéntrico progresivo.',
        prevention: 'Fortalecimiento excéntrico y control del volumen de entrenamiento.',
      },
      {
        id: 'sobrecarga-aductores',
        name: 'Sobrecarga de aductores',
        whatIs: 'Fatiga muscular en la zona de la ingle sin rotura.',
        howItHappens: 'Cambios de dirección repetidos y movimientos laterales constantes.',
        treatment: 'Reposo relativo, masaje profundo y fortalecimiento gradual.',
        prevention: 'Trabajo específico de aductores y buenos estiramientos.',
      },
      {
        id: 'sobrecarga-cuadriceps',
        name: 'Sobrecarga de cuádriceps',
        whatIs: 'Tensión excesiva en la musculatura anterior del muslo.',
        howItHappens: 'Carreras intensas, saltos repetidos o entrenamiento sin recuperación.',
        treatment: 'Descanso activo, crioterapia y masaje deportivo.',
        prevention: 'Dosificación adecuada de cargas y estiramientos post-entrenamiento.',
      },
      {
        id: 'sobrecarga-lumbar',
        name: 'Sobrecarga lumbar',
        whatIs: 'Tensión en la musculatura de la zona baja de la espalda.',
        howItHappens: 'Malas posturas, cabezazos repetidos o falta de fortalecimiento de core.',
        treatment: 'Fisioterapia, estiramientos y fortalecimiento del core.',
        prevention: 'Trabajo de core, técnica correcta y control postural.',
      },
    ],
  },
  {
    id: 'roturas',
    name: 'Roturas musculares',
    icon: 'flame',
    color: 'from-red-600 to-pink-600',
    injuries: [
      {
        id: 'rotura-isquiotibiales',
        name: 'Rotura fibrilar de isquiotibiales',
        whatIs: 'Rotura parcial de fibras musculares en la parte posterior del muslo.',
        howItHappens: 'Sprint explosivo o aceleración brusca sin preparación adecuada.',
        treatment: 'Reposo, fisioterapia, readaptación progresiva y control médico.',
        prevention: 'Trabajo excéntrico, calentamiento completo y evitar sobrecargas.',
      },
      {
        id: 'rotura-cuadriceps',
        name: 'Rotura de cuádriceps',
        whatIs: 'Desgarro muscular en la parte frontal del muslo.',
        howItHappens: 'Golpeo fuerte del balón o cambios bruscos de ritmo.',
        treatment: 'Reposo, hielo, fisioterapia y fortalecimiento progresivo.',
        prevention: 'Buena preparación muscular y gestión de la fatiga.',
      },
      {
        id: 'rotura-gemelos',
        name: 'Rotura de gemelos',
        whatIs: 'Desgarro de las fibras del músculo gemelar o sóleo.',
        howItHappens: 'Aceleración súbita o salto sin calentamiento adecuado.',
        treatment: 'Reposo, elevación, compresión y rehabilitación progresiva.',
        prevention: 'Calentamiento específico de gemelos y buenos estiramientos.',
      },
      {
        id: 'rotura-aductores',
        name: 'Rotura de aductores',
        whatIs: 'Desgarro muscular en la zona de la ingle.',
        howItHappens: 'Apertura excesiva de piernas o movimiento lateral forzado.',
        treatment: 'Reposo absoluto inicial, fisioterapia y fortalecimiento gradual.',
        prevention: 'Fortalecimiento progresivo de aductores y flexibilidad.',
      },
      {
        id: 'rotura-recto-anterior',
        name: 'Rotura del recto anterior',
        whatIs: 'Desgarro del músculo recto anterior del cuádriceps.',
        howItHappens: 'Disparo potente del balón con estiramiento excesivo.',
        treatment: 'Reposo, crioterapia y readaptación específica.',
        prevention: 'Fortalecimiento del cuádriceps y técnica de golpeo correcta.',
      },
    ],
  },
  {
    id: 'lesiones-rodilla',
    name: 'Lesiones de rodilla',
    icon: 'knee',
    color: 'from-blue-500 to-cyan-500',
    injuries: [
      {
        id: 'lca',
        name: 'Lesión del ligamento cruzado anterior (LCA)',
        whatIs: 'Rotura o estiramiento grave del ligamento cruzado anterior.',
        howItHappens: 'Giros bruscos, aterrizajes mal ejecutados o contacto fuerte.',
        treatment: 'Cirugía en muchos casos y rehabilitación prolongada.',
        prevention: 'Trabajo neuromuscular, estabilidad y técnica de salto correcta.',
      },
      {
        id: 'meniscopatia',
        name: 'Meniscopatía',
        whatIs: 'Lesión del menisco de la rodilla.',
        howItHappens: 'Movimientos repetidos de giro o impacto directo.',
        treatment: 'Fisioterapia o cirugía según gravedad.',
        prevention: 'Fortalecer musculatura de soporte y evitar sobrecargas.',
      },
      {
        id: 'lcp',
        name: 'Lesión del ligamento cruzado posterior (LCP)',
        whatIs: 'Daño en el ligamento cruzado posterior de la rodilla.',
        howItHappens: 'Golpe directo en la parte frontal de la rodilla flexionada.',
        treatment: 'Conservador con fisioterapia o cirugía en casos graves.',
        prevention: 'Protección adecuada y fortalecimiento de musculatura.',
      },
      {
        id: 'condromalacia',
        name: 'Condromalacia rotuliana',
        whatIs: 'Desgaste del cartílago de la rótula.',
        howItHappens: 'Sobrecarga repetitiva, desalineación rotuliana o debilidad muscular.',
        treatment: 'Fisioterapia, fortalecimiento de cuádriceps y control de carga.',
        prevention: 'Técnica correcta de carrera y fortalecimiento equilibrado.',
      },
      {
        id: 'sindrome-cintilla',
        name: 'Síndrome de la cintilla iliotibial',
        whatIs: 'Inflamación de la banda iliotibial en su inserción lateral de rodilla.',
        howItHappens: 'Carreras prolongadas, especialmente en superficies inclinadas.',
        treatment: 'Reposo, fisioterapia, estiramientos y liberación miofascial.',
        prevention: 'Fortalecimiento de glúteos y estiramiento de cintilla.',
      },
    ],
  },
  {
    id: 'tendinosas',
    name: 'Lesiones tendinosas',
    icon: 'tendon',
    color: 'from-green-500 to-emerald-500',
    injuries: [
      {
        id: 'tendinitis-rotuliana',
        name: 'Tendinitis rotuliana',
        whatIs: 'Inflamación del tendón rotuliano.',
        howItHappens: 'Saltos repetidos y sobrecarga del aparato extensor.',
        treatment: 'Reposo, fisioterapia, ejercicios excéntricos.',
        prevention: 'Control de carga y fortalecimiento progresivo.',
      },
      {
        id: 'tendinitis-aquilea',
        name: 'Tendinitis aquílea',
        whatIs: 'Inflamación del tendón de Aquiles.',
        howItHappens: 'Exceso de carrera, calzado inadecuado o mala pisada.',
        treatment: 'Reposo, hielo, fisioterapia y estiramientos.',
        prevention: 'Trabajo de gemelos y control de impacto.',
      },
      {
        id: 'tendinopatia-aductores',
        name: 'Tendinopatía de aductores',
        whatIs: 'Inflamación de los tendones de los músculos aductores.',
        howItHappens: 'Movimientos laterales repetitivos y sobrecarga.',
        treatment: 'Fisioterapia, ejercicios excéntricos y ondas de choque.',
        prevention: 'Fortalecimiento progresivo de aductores.',
      },
      {
        id: 'tendinitis-cudriceps',
        name: 'Tendinitis del cuádriceps',
        whatIs: 'Inflamación del tendón del cuádriceps por encima de la rótula.',
        howItHappens: 'Saltos, cambios de ritmo y golpeos repetidos.',
        treatment: 'Reposo relativo, fisioterapia y trabajo excéntrico.',
        prevention: 'Control de volumen de entrenamiento y flexibilidad.',
      },
      {
        id: 'tendinitis-peroneos',
        name: 'Tendinitis de peroneos',
        whatIs: 'Inflamación de los tendones peroneos en el tobillo.',
        howItHappens: 'Esguinces previos, sobrecarga o mala pisada.',
        treatment: 'Reposo, fisioterapia y trabajo propioceptivo.',
        prevention: 'Fortalecimiento de peroneos y estabilidad de tobillo.',
      },
    ],
  },
  {
    id: 'oseas',
    name: 'Lesiones óseas',
    icon: 'bone',
    color: 'from-gray-500 to-slate-600',
    injuries: [
      {
        id: 'fractura-estres',
        name: 'Fractura por estrés',
        whatIs: 'Microfracturas óseas por sobreuso.',
        howItHappens: 'Carga repetitiva sin recuperación adecuada.',
        treatment: 'Reposo prolongado y control médico.',
        prevention: 'Buena planificación de cargas y nutrición adecuada.',
      },
      {
        id: 'periostitis',
        name: 'Periostitis tibial',
        whatIs: 'Inflamación del periostio (membrana que cubre el hueso) de la tibia.',
        howItHappens: 'Impactos repetidos al correr en superficies duras.',
        treatment: 'Reposo, hielo, antiinflamatorios y fisioterapia.',
        prevention: 'Calzado adecuado, superficies apropiadas y progresión gradual.',
      },
      {
        id: 'fractura-metacarpiano',
        name: 'Fractura de metacarpiano',
        whatIs: 'Rotura de los huesos de la mano, común en porteros.',
        howItHappens: 'Impacto directo al atajar o golpear el balón.',
        treatment: 'Inmovilización o cirugía según gravedad.',
        prevention: 'Técnica correcta de atajada y protección adecuada.',
      },
      {
        id: 'fractura-clavicula',
        name: 'Fractura de clavícula',
        whatIs: 'Rotura del hueso de la clavícula.',
        howItHappens: 'Caídas sobre el hombro o contacto fuerte.',
        treatment: 'Inmovilización con cabestrillo o cirugía si es desplazada.',
        prevention: 'Técnica correcta de caída y fortalecimiento del tren superior.',
      },
      {
        id: 'osteitis-pubis',
        name: 'Osteítis de pubis',
        whatIs: 'Inflamación de la sínfisis púbica.',
        howItHappens: 'Sobrecarga repetitiva de aductores y movimientos de corte.',
        treatment: 'Reposo prolongado, fisioterapia y fortalecimiento del core.',
        prevention: 'Fortalecimiento de aductores, core y control de cargas.',
      },
    ],
  },
  {
    id: 'otras',
    name: 'Otras lesiones',
    icon: 'first-aid',
    color: 'from-purple-500 to-pink-500',
    injuries: [
      {
        id: 'fascitis-plantar',
        name: 'Fascitis plantar',
        whatIs: 'Inflamación de la fascia plantar del pie.',
        howItHappens: 'Sobrecarga repetitiva, calzado inadecuado o mala pisada.',
        treatment: 'Estiramientos específicos, fisioterapia y plantillas ortopédicas.',
        prevention: 'Calzado apropiado, estiramientos y fortalecimiento de pie.',
      },
      {
        id: 'pubalgia',
        name: 'Pubalgia',
        whatIs: 'Dolor en la zona del pubis y la ingle por sobrecarga.',
        howItHappens: 'Desequilibrios musculares y sobrecarga de aductores.',
        treatment: 'Fisioterapia, fortalecimiento del core y en casos graves cirugía.',
        prevention: 'Trabajo equilibrado de abdominales y aductores.',
      },
      {
        id: 'hernia-deportista',
        name: 'Hernia del deportista',
        whatIs: 'Debilidad de la pared abdominal en zona inguinal.',
        howItHappens: 'Movimientos explosivos y giros repetidos.',
        treatment: 'Cirugía en la mayoría de casos y rehabilitación.',
        prevention: 'Fortalecimiento del core y técnica correcta.',
      },
      {
        id: 'conmocion-cerebral',
        name: 'Conmoción cerebral',
        whatIs: 'Lesión cerebral traumática leve por impacto.',
        howItHappens: 'Choque de cabezas, golpe con el suelo o balón fuerte.',
        treatment: 'Reposo absoluto cognitivo y físico, evaluación médica.',
        prevention: 'Técnica correcta de cabeceo y evaluación ante cualquier síntoma.',
      },
      {
        id: 'luxacion-hombro',
        name: 'Luxación de hombro',
        whatIs: 'Desplazamiento de la cabeza del húmero fuera de la cavidad.',
        howItHappens: 'Caídas sobre el brazo extendido o impactos directos.',
        treatment: 'Reducción médica, inmovilización y fisioterapia.',
        prevention: 'Fortalecimiento del manguito rotador.',
      },
      {
        id: 'contusion-muscular',
        name: 'Contusión muscular',
        whatIs: 'Golpe directo en el músculo que causa hematoma.',
        howItHappens: 'Impacto con otro jugador, rodillazo o entrada fuerte.',
        treatment: 'Hielo inmediato, compresión y drenaje si es necesario.',
        prevention: 'Protecciones y evitar contactos innecesarios.',
      },
    ],
  },
];

export function getInjuryCategory(categoryId: string): InjuryCategory | undefined {
  return INJURY_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getInjuryDetail(categoryId: string, injuryId: string): InjuryDetail | undefined {
  const category = getInjuryCategory(categoryId);
  return category?.injuries.find(inj => inj.id === injuryId);
}
