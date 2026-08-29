import { ReactNode } from 'react';

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  content: ReactNode;
}

export const GUIDES: Guide[] = [
  {
    slug: 'como-elegir-formacion-4-3-3-vs-4-4-2',
    title: 'Cómo elegir la formación adecuada para tu equipo: 4-3-3 vs 4-4-2',
    excerpt: 'Las dos formaciones más usadas en el fútbol amateur tienen ventajas y riesgos distintos. Te contamos cuándo conviene cada una según la plantilla que tengas.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          Elegir una formación no es copiar la que usa tu equipo favorito en la televisión: es una
          decisión que depende de los jugadores que tienes disponibles, de su nivel físico y de qué
          quieres priorizar, ataque o solidez defensiva. El 4-3-3 y el 4-4-2 son, con diferencia, las
          dos formaciones más habituales en el fútbol amateur y de base, y entender sus diferencias
          reales te ayudará a tomar mejores decisiones cada fin de semana.
        </p>

        <h2>El 4-3-3: control del centro del campo</h2>
        <p>
          Con tres centrocampistas frente a los dos del 4-4-2, el 4-3-3 te da superioridad numérica
          en la zona central del campo casi siempre. Esto facilita mantener la posesión, construir el
          juego desde atrás y presionar más arriba, porque tienes un jugador de más para cubrir
          espacios cuando el equipo pierde el balón.
        </p>
        <p>
          A cambio, exige extremos con resistencia física real: son ellos quienes dan la anchura al
          equipo y quienes tienen que replegar cuando el rival ataca por las bandas. Si tu plantilla
          no tiene jugadores rápidos y con buen fondo físico en esas posiciones, el 4-3-3 puede dejar
          los laterales desprotegidos.
        </p>

        <h2>El 4-4-2: simplicidad y solidez</h2>
        <p>
          El 4-4-2 es más fácil de entender para jugadores jóvenes o con poca experiencia táctica: las
          líneas son claras, las referencias son sencillas (cada jugador marca a su par en el rival) y
          los dos delanteros se apoyan entre sí, lo que reduce la dependencia de un solo goleador.
        </p>
        <p>
          Su punto débil clásico es el centro del campo: con solo dos centrocampistas frente a los
          tres del 4-3-3, es fácil quedarse en inferioridad numérica ahí si el rival controla bien esa
          zona. Se compensa con un buen trabajo de bloque compacto y transiciones rápidas en lugar de
          jugar pases largos por el centro.
        </p>

        <h2>Cómo decidir con tu equipo real</h2>
        <ul>
          <li><strong>Si tienes extremos rápidos y con buen físico:</strong> el 4-3-3 aprovechará mejor sus cualidades y te dará más control del balón.</li>
          <li><strong>Si tu plantilla es más joven o con menos rodaje táctico:</strong> el 4-4-2 reduce la complejidad y da referencias más claras a cada jugador.</li>
          <li><strong>Si el rival suele presionar alto y con intensidad:</strong> el 4-4-2 facilita salidas más directas y verticales, evitando quedarte corto de gente en defensa.</li>
          <li><strong>Si necesitas mantener el balón para controlar el ritmo del partido:</strong> el 4-3-3 te da la superioridad numérica central que necesitas para eso.</li>
        </ul>
        <p>
          No hay una formación "mejor" en abstracto — hay una formación mejor para el equipo que
          tienes delante esta temporada. Revisar el nivel físico y las cualidades reales de tus
          jugadores antes de cada partido, y no solo copiar un sistema porque "es el que se lleva
          ahora", suele marcar la diferencia entre un planteamiento que funciona y uno que se cae a
          los veinte minutos.
        </p>
      </>
    ),
  },
  {
    slug: 'prevencion-lesiones-pretemporada',
    title: 'Prevención de lesiones en pretemporada: guía práctica para entrenadores',
    excerpt: 'La mayoría de lesiones musculares de la temporada se deciden en las primeras semanas de pretemporada. Estas son las claves para reducir el riesgo desde el primer día.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          La pretemporada es el momento de mayor riesgo de lesión de toda la temporada. Los jugadores
          llegan con distintos niveles de forma física tras las vacaciones, y la tentación de acelerar
          la carga de entrenamiento para "ponerse a punto rápido" es exactamente lo que más lesiones
          musculares provoca. Una pretemporada bien planificada no es la que más corre, es la que
          construye la base física de forma progresiva.
        </p>

        <h2>Progresividad de la carga: la regla más importante</h2>
        <p>
          El error más común es aumentar el volumen y la intensidad del entrenamiento al mismo tiempo
          durante la primera semana. Lo recomendable es subir primero el volumen (minutos de trabajo)
          con intensidad moderada, y solo cuando el equipo tolera bien esa carga, empezar a introducir
          trabajo de mayor intensidad como sprints, cambios de dirección o pliometría.
        </p>
        <p>
          Como referencia general, evita incrementos de carga semanal superiores al 10-15% respecto a
          la semana anterior. Si un jugador ha estado varias semanas sin actividad física regular,
          necesita una progresión todavía más gradual que el resto del grupo, aunque eso implique
          entrenar por debajo del ritmo del equipo los primeros días.
        </p>

        <h2>Trabajo excéntrico e isquiotibiales</h2>
        <p>
          Los isquiotibiales son, con diferencia, el grupo muscular que más se lesiona en fútbol,
          especialmente en las primeras semanas de pretemporada. El ejercicio con mayor evidencia para
          reducir este riesgo es el <strong>curl nórdico</strong> (Nordic hamstring curl): un trabajo
          excéntrico que fortalece el músculo precisamente en la posición donde se suele producir la
          lesión, al frenar la pierna en la fase final de la zancada al esprintar.
        </p>
        <p>
          Introducirlo dos veces por semana desde el primer día de pretemporada, con pocas repeticiones
          al principio, es una de las medidas más efectivas y baratas que puede aplicar cualquier
          equipo, sin necesidad de material especializado.
        </p>

        <h2>Calentamiento estructurado tipo FIFA 11+</h2>
        <p>
          Sustituir el calentamiento genérico (unas vueltas al campo y estiramientos estáticos) por un
          protocolo estructurado de activación, fuerza, equilibrio y pliometría reduce de forma
          demostrada la incidencia de lesiones, tanto musculares como de rodilla y tobillo. No hace
          falta que dure más de 20 minutos, y se puede repetir con pocas variaciones antes de cada
          sesión y cada partido.
        </p>

        <h2>Cinco puntos clave para tu pretemporada</h2>
        <ul>
          <li>Sube la carga de forma progresiva: primero volumen, después intensidad.</li>
          <li>Individualiza la progresión de los jugadores que llegan con menos forma física.</li>
          <li>Introduce trabajo excéntrico de isquiotibiales desde la primera semana.</li>
          <li>Usa un calentamiento estructurado y repítelo de forma consistente.</li>
          <li>Vigila las señales de fatiga acumulada: rendimiento a la baja, molestias musculares recurrentes o cambios de humor pueden anticipar una lesión.</li>
        </ul>
        <p>
          Ninguna de estas medidas elimina el riesgo por completo — el fútbol es un deporte de
          impacto y cambios de dirección constantes — pero aplicadas de forma sistemática reducen de
          forma significativa las bajas por lesión muscular durante el tramo más delicado de la
          temporada.
        </p>
      </>
    ),
  },
  {
    slug: 'como-planificar-sesion-entrenamiento',
    title: 'Cómo planificar una sesión de entrenamiento de fútbol paso a paso',
    excerpt: 'Una buena sesión no se improvisa sobre la marcha. Esta es la estructura que usan la mayoría de metodologías modernas para sacarle partido al tiempo de entrenamiento.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          Con dos o tres sesiones semanales de una hora u hora y media, cada minuto de entrenamiento
          cuenta. Improvisar ejercicios sobre la marcha suele acabar en sesiones desordenadas donde los
          jugadores pasan más tiempo esperando turno que entrenando de verdad. Tener una estructura
          clara, aunque el contenido cambie cada semana, es lo que marca la diferencia.
        </p>

        <h2>1. Define un único objetivo por sesión</h2>
        <p>
          Antes de pensar en ejercicios, decide qué es lo único que quieres que tu equipo mejore hoy:
          ¿la salida de balón desde atrás? ¿el pressing tras pérdida? ¿la finalización? Una sesión que
          intenta trabajar cinco cosas distintas normalmente no consolida ninguna. Todo el contenido de
          la sesión — desde el calentamiento hasta el partido final — debería apuntar a ese mismo
          objetivo.
        </p>

        <h2>2. Estructura en cuatro bloques</h2>
        <ul>
          <li><strong>Activación (10-15 min):</strong> calentamiento con balón, movilidad y activación muscular. Ideal aprovechar este bloque también para prevención de lesiones (ver nuestra guía de pretemporada).</li>
          <li><strong>Ejercicio analítico o forma jugada reducida (15-20 min):</strong> trabajo específico del objetivo del día en un espacio controlado — por ejemplo, un rondo con condicionantes si el objetivo es la conservación del balón bajo presión.</li>
          <li><strong>Situación reducida de mayor complejidad (20-25 min):</strong> un juego de posesión más amplio o un ejercicio de superioridad numérica (por ejemplo, un 4v2 o una transición) que acerque el trabajo a una situación real de partido.</li>
          <li><strong>Juego global o partido condicionado (15-20 min):</strong> partido en espacio reducido con alguna regla que refuerce el objetivo (por ejemplo, "solo vale gol si se ha construido con al menos tres pases seguidos").</li>
        </ul>

        <h2>3. De lo simple a lo complejo</h2>
        <p>
          La progresión de la sesión debería ir de ejercicios con menos oposición y menos jugadores a
          situaciones cada vez más parecidas al partido real. Empezar directamente con un partido
          completo desperdicia la oportunidad de corregir gestos técnicos o decisiones tácticas
          específicas, porque hay demasiadas variables ocurriendo a la vez para que el jugador
          aprenda algo concreto.
        </p>

        <h2>4. Cuida los tiempos de espera</h2>
        <p>
          Un jugador parado en una fila esperando su turno no está entrenando. Diseña los ejercicios
          para que el máximo número de jugadores esté en movimiento e implicado en cada momento — por
          ejemplo, dividiendo al grupo en varios espacios simultáneos en lugar de hacer una sola fila
          larga para un solo ejercicio.
        </p>

        <h2>5. Cierra con feedback breve</h2>
        <p>
          Los últimos cinco minutos, ya sin balón, sirven para repasar en voz alta qué se ha trabajado
          y por qué, y para que los propios jugadores digan qué les ha costado más. Este cierre corto
          ayuda a que el objetivo de la sesión quede claro también fuera del campo, no solo durante el
          entrenamiento.
        </p>
      </>
    ),
  },
  {
    slug: 'pliometria-futbol-introduccion-segura',
    title: 'Pliometría en fútbol: qué es y cómo introducirla de forma segura',
    excerpt: 'Saltos, cambios de dirección y aceleraciones explosivas mejoran el rendimiento, pero mal dosificados aumentan mucho el riesgo de lesión. Así se introduce con cabeza.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          La pliometría es el entrenamiento basado en el ciclo de estiramiento-acortamiento: el músculo
          se estira rápidamente (por ejemplo, al aterrizar de un salto) y después se contrae de forma
          explosiva (al volver a saltar o esprintar). Es el mecanismo detrás de casi todas las acciones
          decisivas del fútbol — un cambio de dirección brusco, un salto para rematar de cabeza, una
          arrancada tras un desmarque. Entrenarla bien mejora directamente el rendimiento; entrenarla
          mal es una de las formas más rápidas de lesionar a un jugador.
        </p>

        <h2>Por qué no se puede empezar por lo más exigente</h2>
        <p>
          Ejercicios como el drop jump (salto de caída desde un cajón) o los saltos con vallas generan
          fuerzas de impacto muy altas sobre tendones y articulaciones. Introducirlos sin una base
          previa de fuerza en tren inferior es la receta habitual para tendinopatías rotulianas o
          molestias en el tobillo. La pliometría se construye en niveles, no se empieza por el
          ejercicio más espectacular.
        </p>

        <h2>Progresión recomendada por niveles</h2>
        <ul>
          <li><strong>Nivel 1 — saltos básicos con aterrizaje controlado:</strong> saltos verticales y horizontales sencillos, prestando más atención a cómo aterriza el jugador (rodillas alineadas, aterrizaje suave) que a cuánto salta.</li>
          <li><strong>Nivel 2 — saltos repetidos y multidireccionales:</strong> skipping, saltos laterales, escalera de agilidad — trabajo de coordinación y ritmo con impacto moderado.</li>
          <li><strong>Nivel 3 — saltos reactivos:</strong> saltos con mínimo tiempo de contacto en el suelo (bounds, saltos a vallas bajas), que empiezan a exigir de verdad el ciclo de estiramiento-acortamiento.</li>
          <li><strong>Nivel 4 — pliometría de alta intensidad:</strong> drop jumps, saltos con cambio de dirección a máxima velocidad — reservado para jugadores con buena base de fuerza y ya adaptados a los niveles anteriores.</li>
        </ul>
        <p>
          Un equipo amateur no necesita llegar siempre al nivel 4 — para la mayoría de jugadores,
          consolidar bien los niveles 1 a 3 durante varias semanas ya supone una mejora notable en la
          capacidad de aceleración y en la resistencia a lesiones de tobillo y rodilla.
        </p>

        <h2>Dosificación: menos es más</h2>
        <p>
          La pliometría no se mide en minutos, sino en número de contactos con el suelo. Para un
          jugador amateur en fase de introducción, entre 60 y 100 contactos por sesión (sumando todos
          los saltos) es un volumen razonable, con dos sesiones semanales como máximo y al menos 48
          horas de descanso entre ellas. Aumentar el volumen demasiado rápido anula el beneficio y
          dispara el riesgo de sobrecarga.
        </p>

        <h2>Señales de que hay que frenar</h2>
        <p>
          Dolor en tendón rotuliano o de Aquiles, aterrizajes cada vez más ruidosos o descontrolados, o
          quejas de rigidez que no desaparecen entre sesiones son señales claras de que el volumen o la
          intensidad han subido demasiado rápido para ese jugador. Bajar un nivel durante una o dos
          semanas suele ser suficiente para recuperar la progresión con seguridad.
        </p>
      </>
    ),
  },
  {
    slug: 'como-dar-feedback-jugadores-jovenes',
    title: 'Cómo dar feedback a jugadores jóvenes: guía de comunicación para entrenadores',
    excerpt: 'La forma en que corriges a un jugador influye tanto en su aprendizaje como el ejercicio en sí. Estas son las claves de una comunicación que realmente ayuda a mejorar.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          Un mismo error táctico corregido de dos formas distintas puede producir resultados muy
          diferentes: un jugador que entiende qué mejorar y se siente respaldado, o un jugador que se
          bloquea y deja de intentar cosas por miedo a fallar. El feedback es una herramienta de
          entrenamiento tan importante como cualquier ejercicio con balón, y merece la misma
          preparación.
        </p>

        <h2>Feedback específico, no genérico</h2>
        <p>
          "Bien hecho" o "así no" no le dan al jugador información que pueda aplicar la próxima vez.
          Un feedback útil describe la acción concreta y qué hacer de forma distinta: "has girado el
          cuerpo hacia el balón antes de recibir, por eso has podido ver el pase al espacio" es mucho
          más valioso que un simple "muy bien". Cuanto más específico y ligado a una acción concreta,
          más fácil es que el jugador lo repita o lo corrija.
        </p>

        <h2>La proporción entre corrección y refuerzo importa</h2>
        <p>
          No se trata de evitar las correcciones — son necesarias para mejorar — sino de que no sean
          lo único que el jugador escucha. Un jugador que solo recibe feedback negativo tiende a jugar
          con miedo a equivocarse, lo que reduce su disposición a intentar jugadas arriesgadas o
          creativas. Reconocer también las decisiones correctas, aunque el resultado final no haya
          sido gol, ayuda a que el jugador entienda qué proceso quieres que repita.
        </p>

        <h2>Momento y lugar</h2>
        <p>
          Una corrección técnica o táctica delante de todo el equipo puede ser útil si el error es
          común y sirve de ejemplo para el grupo. Pero una crítica personal o repetida en público
          sobre el mismo jugador suele generar rechazo en lugar de aprendizaje. Para temas más
          personales — actitud, confianza, situaciones puntuales — un comentario individual, aparte
          del grupo, es casi siempre más efectivo.
        </p>

        <h2>Preguntar en lugar de solo corregir</h2>
        <p>
          Preguntar "¿qué opciones tenías ahí?" antes de dar la respuesta directamente obliga al
          jugador a pensar por sí mismo la próxima vez que se encuentre en una situación similar, en
          lugar de depender siempre de que el entrenador le diga qué hacer. Es una herramienta
          especialmente útil con jugadores más jóvenes, que están desarrollando su propia lectura del
          juego.
        </p>

        <h2>Adapta el tono a cada jugador</h2>
        <p>
          No todos los jugadores responden igual a la misma forma de comunicación. Algunos necesitan
          un tono directo y exigente para mantenerse concentrados; otros se bloquean con ese mismo
          tono y responden mejor a un enfoque más calmado. Conocer a cada jugador — algo que puedes
          registrar y consultar en la ficha de cada uno — ayuda a decidir cómo comunicarte con él en
          el momento adecuado, no solo qué decirle.
        </p>
      </>
    ),
  },
  {
    slug: 'periodizacion-entrenamiento-futbol-amateur',
    title: 'Periodización del entrenamiento en fútbol amateur: conceptos básicos',
    excerpt: 'No hace falta un equipo de preparadores físicos para planificar la temporada con criterio. Estas son las ideas clave para organizar la carga a lo largo del año.',
    updatedAt: '15 de agosto de 2026',
    content: (
      <>
        <p>
          Periodizar significa organizar la carga de entrenamiento a lo largo de la temporada en lugar
          de repetir siempre el mismo tipo de sesión. En el fútbol profesional esto lo gestionan
          equipos completos de preparadores físicos, pero las ideas básicas se pueden aplicar
          perfectamente a un equipo amateur con un poco de planificación previa.
        </p>

        <h2>Las tres fases de la temporada</h2>
        <ul>
          <li>
            <strong>Pretemporada (preparatoria):</strong> el objetivo es construir la base física —
            resistencia, fuerza general, prevención de lesiones — antes de empezar a competir. Es el
            momento de mayor volumen de entrenamiento físico y menor intensidad táctica específica.
          </li>
          <li>
            <strong>Temporada regular (competitiva):</strong> el foco pasa del desarrollo físico puro
            al mantenimiento de la forma y al trabajo táctico específico para cada rival. La carga
            física se reduce en volumen para dejar sitio a la recuperación entre partidos, pero sube
            en intensidad puntual.
          </li>
          <li>
            <strong>Descanso (transición):</strong> tras la temporada, un periodo de descanso activo
            evita el desgaste físico y mental acumulado, y prepara al jugador para volver a subir la
            carga de forma progresiva en la siguiente pretemporada.
          </li>
        </ul>

        <h2>Microciclos: la unidad semanal</h2>
        <p>
          Dentro de la temporada regular, la semana (microciclo) suele organizarse en función del día
          del partido. Como referencia general para un equipo que juega los fines de semana:
        </p>
        <ul>
          <li><strong>Día después del partido:</strong> recuperación activa o descanso, evitando cualquier carga física intensa.</li>
          <li><strong>Mitad de semana:</strong> los días de mayor carga física y de trabajo táctico más exigente, con margen suficiente para recuperar antes del próximo partido.</li>
          <li><strong>Días previos al partido:</strong> se reduce el volumen y la intensidad física, priorizando la activación, la velocidad y los ajustes tácticos específicos para el rival.</li>
        </ul>

        <h2>No todas las semanas son iguales</h2>
        <p>
          Meter siempre la misma carga de entrenamiento, semana tras semana, acaba en estancamiento o
          en fatiga acumulada. Alternar semanas de mayor exigencia física con semanas algo más suaves
          (aunque sea reduciendo un 20-30% el volumen cada tres o cuatro semanas) ayuda al cuerpo a
          asimilar el trabajo acumulado y reduce el riesgo de lesiones por sobrecarga hacia la segunda
          mitad de temporada.
        </p>

        <h2>Adapta el plan a lo que realmente pasa</h2>
        <p>
          Ningún plan de periodización sobrevive intacto a una temporada real: lesiones, resultados,
          disponibilidad de jugadores entre semana... La periodización no es una receta rígida, es un
          marco de referencia que te ayuda a decidir con criterio cuándo apretar la carga y cuándo
          bajarla, en lugar de improvisar sesión a sesión sin ver el conjunto de la temporada.
        </p>
      </>
    ),
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}
