import LegalLayout from './LegalLayout';
import LegalReview from './LegalReview';

const CONTACT_EMAIL = 'ai.helpingcoach@gmail.com';

export default function TermsOfService() {
  return (
    <LegalLayout title="Términos de Servicio" updatedAt="22 de julio de 2026">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6 text-yellow-200 text-sm">
        <strong>Nota interna (quitar antes de publicar en tiendas):</strong> este documento es un
        borrador generado con apoyo de IA siguiendo un framework legal estándar de 18 secciones.
        No sustituye asesoría legal. Antes de publicar formalmente, revísalo con un abogado,
        especialmente las secciones marcadas con <LegalReview>revisión legal</LegalReview>.
      </div>

      <h2>1. Aceptación de los Términos</h2>
      <p>
        Al acceder o usar Helpin Coach ("la App", "el Servicio"), aceptas quedar vinculado por
        estos Términos de Servicio y por nuestra <a href="/privacidad">Política de Privacidad</a>.
        Si no estás de acuerdo, no debes usar la App.
      </p>

      <h2>2. El Servicio</h2>
      <p>
        Helpin Coach es una herramienta de apoyo para entrenadores de fútbol amateur: gestión de
        alineaciones, seguimiento de progresión de jugadores, biblioteca de ejercicios y lesiones,
        y funciones asistidas por inteligencia artificial (chat de coaching, recomendaciones de
        formación, análisis de sinergias, generación de informes).
      </p>
      <p>
        Para mantener el servicio disponible y justo para todos, las funciones de IA del plan
        gratuito tienen un límite diario de uso por cuenta.
      </p>

      <h2>3. Elegibilidad</h2>
      <p>
        Debes ser mayor de 18 años para crear una cuenta y usar la App. Al registrarte, confirmas
        que cumples este requisito.
      </p>

      <h2>4. Tu cuenta</h2>
      <ul>
        <li>Debes proporcionar información veraz al registrarte.</li>
        <li>Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta.</li>
        <li>Notifícanos de inmediato si detectas un acceso no autorizado a tu cuenta.</li>
      </ul>

      <h2>5. Uso aceptable</h2>
      <p><strong>Contenido prohibido:</strong></p>
      <ul>
        <li>Contenido ilegal bajo la legislación aplicable.</li>
        <li>Contenido que explote o dañe a menores.</li>
        <li>Contenido que infrinja derechos de propiedad intelectual, privacidad o imagen de terceros.</li>
        <li>Contenido que promueva violencia, acoso u odio.</li>
      </ul>
      <p><strong>Conductas prohibidas:</strong></p>
      <ul>
        <li>Scraping, rastreo o automatización de acceso más allá del uso normal de la App.</li>
        <li>Intentar eludir el límite diario de uso de IA, medidas de seguridad o el sistema de planes.</li>
        <li>Ingeniería inversa, descompilación o manipulación del código de la App.</li>
        <li>Usar la App para fines ilegales o no autorizados.</li>
      </ul>
      <p>
        Nos reservamos el derecho de investigar incumplimientos y de suspender o cancelar cuentas
        que violen estas reglas.
      </p>

      <h2>6. Tu contenido</h2>
      <p>
        Conservas la propiedad de los datos que introduces en la App (perfil, jugadores,
        alineaciones, mensajes al chat de IA). Nos concedes una licencia limitada, no exclusiva y
        acotada a la prestación del servicio, únicamente para procesar ese contenido y generar las
        respuestas, análisis o recomendaciones que solicitas. No usamos tu contenido para entrenar
        modelos de inteligencia artificial de terceros <LegalReview>confirmar cláusula vigente del proveedor de IA</LegalReview>.
      </p>
      <p>
        Eres responsable de tener autorización para introducir datos de jugadores, incluidos los
        de menores de edad, y de que dicho contenido no infrinja derechos de terceros.
      </p>

      <h2>7. Contenido generado por la IA</h2>
      <p>
        Eres propietario de las recomendaciones, análisis e informes generados para tu cuenta y
        puedes usarlos libremente para gestionar tu equipo. Como el contenido es generado por IA,
        eres responsable de verificar su exactitud antes de tomar decisiones importantes basadas
        en él.
      </p>

      <h2>8. Aviso sobre la Inteligencia Artificial</h2>
      <p>
        Las recomendaciones tácticas, análisis de sinergias, informes de partido y respuestas del
        chat son generadas por un sistema de IA probabilístico a partir de los datos que
        introduces. Son sugerencias orientativas, no garantías de resultado, y no sustituyen el
        criterio profesional del entrenador. La información relacionada con lesiones tiene fines
        educativos y no constituye consejo médico; ante cualquier lesión real, consulta con un
        profesional sanitario. La IA puede contener imprecisiones o resultados inesperados;
        verifica siempre la información antes de aplicarla.
      </p>

      <h2>9. Servicios de terceros</h2>
      <p>Para operar la App, dependemos de los siguientes proveedores, cuyos propios términos también aplican:</p>
      <ul>
        <li><strong>Supabase:</strong> base de datos, autenticación y almacenamiento.</li>
        <li><strong>Stripe:</strong> procesamiento de pagos de la suscripción Pro.</li>
        <li><strong>Vercel:</strong> hosting de la aplicación web.</li>
        <li><strong>Proveedor de inteligencia artificial de terceros:</strong> procesa el texto que envías a las funciones de IA para generar la respuesta.</li>
      </ul>

      <h2>10. Plan gratuito y plan Pro</h2>
      <p>
        <strong>Plan gratuito:</strong> se ofrece "tal cual" y con mejor esfuerzo. Las funciones de
        IA están sujetas a un límite diario de uso por cuenta. No garantizamos disponibilidad
        ininterrumpida ni tiempos de respuesta específicos, y podemos ajustar límites o funciones
        en cualquier momento.
      </p>
      <p>
        <strong>Plan Pro:</strong> suscripción de pago recurrente gestionada y facturada a través
        de Stripe, con renovación automática al final de cada periodo salvo que canceles antes de
        la fecha de renovación. Puedes cancelar en cualquier momento desde tu perfil; la
        cancelación aplica al final del período ya facturado y no genera reembolsos
        proporcionales por el tiempo restante, salvo que la ley aplicable exija lo contrario{' '}
        <LegalReview>confirmar política de reembolsos aplicable en tu jurisdicción</LegalReview>.
      </p>

      <h2>11. Propiedad intelectual</h2>
      <p>
        El nombre "Helpin Coach", el logotipo, el diseño de la App, el código fuente y los
        contenidos curados (biblioteca de ejercicios y lesiones) son propiedad nuestra o de
        nuestros licenciantes. No se concede ninguna licencia para copiar, modificar o
        redistribuir estos elementos sin autorización.
      </p>

      <h2>12. Terminación</h2>
      <p>
        Podemos suspender o cancelar cuentas que incumplan la sección 5 (Uso aceptable). Puedes
        cancelar tu cuenta en cualquier momento solicitándolo a {CONTACT_EMAIL}. Las disposiciones
        que por su naturaleza deban seguir vigentes tras la terminación (exención de garantías,
        limitación de responsabilidad, indemnización, ley aplicable) permanecerán en vigor.
      </p>

      <h2>13. Exención de garantías</h2>
      <p>
        LA APP SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD", SIN GARANTÍAS DE NINGÚN TIPO,
        EXPRESAS O IMPLÍCITAS. NO GARANTIZAMOS QUE EL SERVICIO SERÁ ININTERRUMPIDO, LIBRE DE
        ERRORES, O QUE EL CONTENIDO GENERADO POR IA SERÁ SIEMPRE PRECISO O ADECUADO.
      </p>

      <h2>14. Limitación de responsabilidad <LegalReview>revisión legal</LegalReview></h2>
      <p>
        En la medida permitida por la ley, no seremos responsables de daños indirectos,
        incidentales o consecuentes derivados del uso de la App, incluyendo decisiones deportivas
        tomadas a partir de las recomendaciones de la IA. Nuestra responsabilidad total frente a
        ti se limita, como máximo, al importe que hayas pagado por el plan Pro en los últimos 12
        meses (o a 0€ si usas el plan gratuito). Algunas jurisdicciones no permiten la exclusión o
        limitación de determinadas garantías o responsabilidades; en esos casos, nuestra
        responsabilidad se limita al máximo permitido por la ley aplicable.
      </p>

      <h2>15. Indemnización</h2>
      <p>
        Aceptas indemnizarnos frente a reclamaciones, daños o gastos razonables derivados de: el
        contenido que introduces en la App, tu uso del contenido generado, tu incumplimiento de
        estos Términos, o tu violación de derechos de terceros o de la ley aplicable.
      </p>

      <h2>16. Ley aplicable y jurisdicción <LegalReview>revisión legal</LegalReview></h2>
      <p>
        Estos Términos se rigen por la legislación española. Cualquier disputa se someterá a los
        tribunales competentes de España, salvo que la normativa de protección al consumidor de tu
        país de residencia te otorgue derecho a acudir a otro fuero, en cuyo caso dicha normativa
        prevalecerá.
      </p>

      <h2>17. Cambios en estos Términos</h2>
      <p>
        Podemos actualizar estos Términos ocasionalmente. Si los cambios son significativos, te lo
        notificaremos dentro de la App o por email antes de que entren en vigor. El uso continuado
        de la App tras la actualización implica la aceptación de los nuevos Términos.
      </p>

      <h2>18. Contacto</h2>
      <p>
        Para cualquier duda sobre estos Términos, incluidas notificaciones de infracción de
        derechos de propiedad intelectual, escríbenos a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
