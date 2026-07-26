import LegalLayout from './LegalLayout';

const CONTACT_EMAIL = 'ai.helpingcoach@gmail.com';

export default function TermsOfService() {
  return (
    <LegalLayout title="Términos de Servicio" updatedAt="22 de julio de 2026">
      <p>
        Estos Términos de Servicio regulan el uso de Helpin Coach ("la App"). Al crear una cuenta
        aceptas estos términos y nuestra <a href="/privacidad">Política de Privacidad</a>. Si no
        estás de acuerdo, no debes usar la App.
      </p>

      <h2>1. Descripción del servicio</h2>
      <p>
        Helpin Coach es una herramienta de apoyo para entrenadores de fútbol amateur: gestión de
        alineaciones, seguimiento de progresión de jugadores, biblioteca de ejercicios y lesiones,
        y funciones asistidas por inteligencia artificial (recomendaciones de formación, análisis
        de sinergias, generación de informes).
      </p>

      <h2>2. Cuentas de usuario</h2>
      <ul>
        <li>Debes proporcionar información veraz al registrarte.</li>
        <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
        <li>Eres responsable de la actividad que ocurra en tu cuenta.</li>
        <li>Debes ser mayor de edad para crear una cuenta.</li>
      </ul>

      <h2>3. Plan gratuito y plan Pro</h2>
      <p>
        La App ofrece un plan gratuito con acceso a las funciones de IA mediante la visualización
        de un breve anuncio antes de cada uso, y un plan de pago ("Pro") con acceso sin anuncios,
        gestionado y facturado a través de Stripe. Los precios vigentes se muestran dentro de la
        App antes de confirmar la suscripción. Puedes cancelar tu suscripción Pro en cualquier
        momento; la cancelación aplica al final del período ya facturado.
      </p>

      <h2>4. Uso aceptable</h2>
      <p>No está permitido:</p>
      <ul>
        <li>Usar la App para fines ilegales o no autorizados.</li>
        <li>Intentar acceder a datos de otros usuarios o eludir las medidas de seguridad de la App.</li>
        <li>Automatizar o abusar del uso de las funciones de inteligencia artificial más allá de un uso personal razonable.</li>
        <li>Introducir contenido ofensivo, difamatorio o que infrinja derechos de terceros.</li>
      </ul>
      <p>
        Nos reservamos el derecho de suspender o cancelar cuentas que incumplan estos términos.
      </p>

      <h2>5. Contenido generado por IA</h2>
      <p>
        Las recomendaciones tácticas, análisis de sinergias, informes de partido y respuestas del
        chat son generadas por un sistema de inteligencia artificial a partir de los datos que
        introduces. Son sugerencias orientativas, no garantías de resultado, y no sustituyen el
        criterio profesional del entrenador. La información relacionada con lesiones tiene fines
        educativos y no constituye consejo médico; ante cualquier lesión real, consulta con un
        profesional sanitario.
      </p>

      <h2>6. Propiedad de los datos</h2>
      <p>
        Los datos de tu equipo y jugadores que introduces en la App te pertenecen. Puedes
        solicitar su exportación o eliminación en cualquier momento escribiendo a{' '}
        {CONTACT_EMAIL}.
      </p>

      <h2>7. Disponibilidad del servicio</h2>
      <p>
        Trabajamos para mantener la App disponible, pero no garantizamos un funcionamiento
        ininterrumpido o libre de errores. Podemos modificar, suspender o discontinuar
        funcionalidades de la App, notificándolo cuando sea razonablemente posible.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        La App se ofrece "tal cual". En la medida permitida por la ley, no somos responsables de
        daños indirectos derivados del uso de la App, incluyendo decisiones deportivas tomadas a
        partir de las recomendaciones de la IA.
      </p>

      <h2>9. Cambios en estos términos</h2>
      <p>
        Podemos actualizar estos Términos ocasionalmente. Si los cambios son significativos, te lo
        notificaremos dentro de la App. El uso continuado tras la actualización implica la
        aceptación de los nuevos términos.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para cualquier duda sobre estos Términos, escríbenos a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
