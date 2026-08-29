import LegalLayout from '../legal/LegalLayout';

const FAQS: { q: string; a: string }[] = [
  {
    q: '¿Qué es Helping Coach?',
    a: 'Helping Coach es una aplicación web para entrenadores de fútbol amateur y de base. Ayuda a gestionar la plantilla, diseñar formaciones y tácticas, planificar entrenamientos, hacer seguimiento de lesiones y del progreso de cada jugador, y consultar recomendaciones a un asistente de inteligencia artificial con contexto real de tu equipo.',
  },
  {
    q: '¿Necesito conocimientos avanzados de táctica para usarla?',
    a: 'No. La aplicación está pensada tanto para entrenadores con experiencia como para quienes empiezan. El tablero de formaciones es visual e intuitivo, y el asistente de IA explica sus recomendaciones en lenguaje sencillo, sin dar por hecho que conoces terminología táctica avanzada.',
  },
  {
    q: '¿Cuántos jugadores puedo gestionar?',
    a: 'No hay un límite artificial de jugadores en tu plantilla. Puedes crear varios equipos (hasta tres espacios de equipo distintos) y llevar el seguimiento de cada uno por separado, útil si entrenas a más de una categoría.',
  },
  {
    q: '¿Cuál es la diferencia entre el plan gratuito y el plan Pro?',
    a: 'El plan gratuito da acceso a todas las funciones principales de la aplicación. Al usar las funciones de inteligencia artificial (asistente táctico, análisis de sinergias, asesor de formaciones, informes de partido) verás un breve anuncio antes de cada uso. El plan Pro elimina los anuncios y da acceso ampliado a las consultas de IA.',
  },
  {
    q: '¿Cómo elige la aplicación qué formación recomendar?',
    a: 'El asesor de formaciones analiza las características de tus jugadores reales (posición, nivel, estilo de juego) junto con el objetivo táctico que le indiques (por ejemplo, jugar de forma equilibrada, presionar arriba o defender un resultado) y genera una recomendación adaptada a esa plantilla concreta, no una respuesta genérica igual para todos los equipos.',
  },
  {
    q: '¿La aplicación sustituye a un preparador físico o fisioterapeuta?',
    a: 'No. El contenido de entrenamiento, prevención de lesiones y las guías publicadas son información educativa general basada en metodologías conocidas del entrenamiento deportivo. No sustituyen el diagnóstico ni el seguimiento de un profesional sanitario ante una lesión real, ni la planificación de un preparador físico titulado para casos específicos.',
  },
  {
    q: '¿Puedo usar la aplicación desde el móvil durante el entrenamiento?',
    a: 'Sí, está diseñada como aplicación web progresiva (PWA), pensada primero para uso desde el móvil. Puedes instalarla en la pantalla de inicio de tu teléfono y usarla igual que una aplicación nativa, incluida la biblioteca de ejercicios durante la propia sesión de entrenamiento.',
  },
  {
    q: '¿Qué pasa con los datos de mis jugadores?',
    a: 'Los datos de tus jugadores (nombre, posición, nivel, lesiones, progreso) se almacenan de forma segura y solo tú, como entrenador de tu cuenta, tienes acceso a ellos. Puedes consultar el detalle completo en nuestra Política de Privacidad, incluidos tus derechos sobre esos datos.',
  },
  {
    q: '¿Cómo funciona el sistema de niveles y experiencia (XP)?',
    a: 'Además de gestionar tu equipo, Helping Coach incluye un sistema de progresión propio del entrenador: ganas experiencia (XP) al usar distintas funciones de la aplicación (añadir jugadores, registrar partidos, completar entrenamientos, evaluar el progreso de tus jugadores), subes de nivel y desbloqueas misiones. Es un elemento de motivación pensado para animarte a mantener actualizada la información de tu equipo.',
  },
  {
    q: '¿Puedo registrar el resultado de mis partidos y ver estadísticas?',
    a: 'Sí. Puedes llevar un calendario de partidos, registrar resultados y consultar estadísticas del equipo a lo largo de la temporada, además de generar informes de partido con ayuda de la IA a partir de los datos que introduzcas.',
  },
  {
    q: '¿Tenéis contenido sobre táctica y entrenamiento fuera de la aplicación?',
    a: 'Sí, publicamos guías gratuitas y de acceso libre sobre táctica, prevención de lesiones y planificación del entrenamiento en nuestra sección de guías, pensadas para cualquier entrenador, tenga o no cuenta en la aplicación.',
  },
  {
    q: '¿Cómo puedo contactar si tengo dudas o problemas?',
    a: 'Puedes escribirnos directamente a ai.helpingcoach@gmail.com. Intentamos responder cualquier duda sobre el funcionamiento de la aplicación, tu cuenta o tus datos en un plazo razonable.',
  },
];

export default function FAQ() {
  return (
    <LegalLayout title="Preguntas frecuentes" updatedAt="19 de agosto de 2026">
      <p>
        Respuestas a las dudas más habituales sobre Helping Coach. Si no encuentras lo que buscas,
        escríbenos a <a href="mailto:ai.helpingcoach@gmail.com">ai.helpingcoach@gmail.com</a>.
      </p>
      {FAQS.map(item => (
        <div key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
    </LegalLayout>
  );
}
