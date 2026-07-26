import LegalLayout from './LegalLayout';
import LegalReview from './LegalReview';

const CONTACT_EMAIL = 'ai.helpingcoach@gmail.com';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidad" updatedAt="22 de julio de 2026">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6 text-yellow-200 text-sm">
        <strong>Nota interna (quitar antes de publicar en tiendas):</strong> este documento es un
        borrador generado con apoyo de IA. No sustituye asesoría legal. Antes de publicar
        formalmente, revísalo con un abogado especializado en protección de datos, especialmente
        las secciones marcadas con <LegalReview>revisión legal</LegalReview>, y confirma tu
        situación legal como responsable del tratamiento (persona física / empresa constituida).
      </div>

      <p>
        Esta Política de Privacidad explica qué datos recoge Helpin Coach ("la App", "nosotros"),
        con qué finalidad, con qué base legal, y qué derechos tienes sobre ellos. Al crear una
        cuenta aceptas esta política y los <a href="/terminos">Términos de Servicio</a>.
      </p>

      <h2>1. Responsable del tratamiento <LegalReview>revisión legal</LegalReview></h2>
      <p>
        Helpin Coach es responsable del tratamiento de los datos descritos en este documento.
        Actualmente opera como proyecto individual, sin una entidad legal (sociedad) constituida a
        la fecha de esta versión; este dato debe actualizarse aquí si se constituye una empresa.
        Puedes contactarnos en{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> para cualquier consulta sobre tus
        datos o para ejercer tus derechos.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <p>Recogemos únicamente los datos necesarios para el funcionamiento de la App:</p>
      <ul>
        <li><strong>Datos de cuenta:</strong> email y contraseña (gestionados de forma segura por nuestro proveedor de autenticación; nunca almacenamos tu contraseña en texto plano).</li>
        <li><strong>Datos de perfil de entrenador:</strong> nombre, nombre del equipo, país, años de experiencia, estilo de entrenamiento y objetivos que introduzcas voluntariamente.</li>
        <li><strong>Datos de jugadores:</strong> nombre, posición, nivel, estilo de juego e imagen opcional que tú, como entrenador, decidas introducir para gestionar tu equipo. Eres responsable de tener autorización para introducir estos datos, incluidos los de menores de edad.</li>
        <li><strong>Datos de uso deportivo:</strong> alineaciones, formaciones, partidos, lesiones registradas y progresión que generes al usar la App.</li>
        <li><strong>Contenido enviado a la IA:</strong> los mensajes y datos de contexto (jugadores, formación) que envías a las funciones de inteligencia artificial del chat, análisis de sinergias, asesor de formaciones e informes de partido.</li>
        <li><strong>Datos de pago:</strong> si contratas el plan Pro, el pago se procesa directamente por Stripe. No almacenamos el número completo de tu tarjeta en nuestros servidores; solo conservamos un identificador de cliente de Stripe para gestionar la suscripción.</li>
        <li><strong>Datos técnicos:</strong> información básica de uso (fecha de conexión, tipo de dispositivo, dirección IP a nivel de infraestructura de hosting) necesaria para el funcionamiento y la seguridad de la App.</li>
        <li><strong>Almacenamiento local del navegador:</strong> guardamos tu sesión de acceso (token de autenticación) en el almacenamiento local (<code>localStorage</code>) de tu navegador para que no tengas que iniciar sesión cada vez. No usamos cookies de rastreo publicitario ni de terceros.</li>
      </ul>
      <p>
        No recogemos categorías especiales de datos (salud, biometría, origen étnico, etc.) de los
        entrenadores. La información de lesiones que ofrece la App es contenido educativo general,
        no datos de salud reales de ninguna persona identificada.
      </p>

      <h2>3. Para qué usamos tus datos y base legal <LegalReview>revisión legal</LegalReview></h2>
      <ul>
        <li><strong>Prestar el servicio</strong> (tácticas, entrenamiento, progresión, lesiones, informes) — base legal: ejecución del contrato contigo.</li>
        <li><strong>Generar recomendaciones y análisis mediante IA</strong> a partir de los datos que introduces — base legal: ejecución del contrato / consentimiento implícito al usar la función.</li>
        <li><strong>Gestionar tu suscripción y procesar pagos</strong> a través de Stripe — base legal: ejecución del contrato y obligación legal (facturación).</li>
        <li><strong>Mantener la seguridad de la cuenta</strong> y prevenir el uso abusivo del servicio — base legal: interés legítimo.</li>
        <li><strong>Comunicarnos contigo</strong> sobre tu cuenta cuando sea necesario — base legal: ejecución del contrato.</li>
      </ul>
      <p>No usamos tus datos con fines de marketing de terceros ni los vendemos.</p>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>No vendemos tus datos a terceros. Compartimos datos únicamente con proveedores que nos ayudan a operar la App:</p>
      <ul>
        <li><strong>Supabase</strong> (hosting de base de datos, autenticación y almacenamiento de archivos).</li>
        <li><strong>Stripe</strong> (procesamiento de pagos de la suscripción Pro).</li>
        <li><strong>Proveedor de inteligencia artificial de terceros</strong> (procesa el texto que envías a las funciones de IA para generar la respuesta; no lo usa para entrenar modelos destinados a otros clientes, según los términos vigentes del proveedor <LegalReview>confirmar cláusula vigente</LegalReview>).</li>
        <li><strong>Vercel</strong> (hosting de la aplicación web).</li>
      </ul>

      <h2>5. Transferencias internacionales de datos <LegalReview>revisión legal</LegalReview></h2>
      <p>
        Algunos de nuestros proveedores (Supabase, Stripe, Vercel y el proveedor de IA) pueden
        procesar o almacenar datos en servidores fuera de España/la Unión Europea, incluyendo
        Estados Unidos. Estos proveedores cuentan con sus propios mecanismos de cumplimiento (como
        cláusulas contractuales tipo) para transferencias internacionales. Se recomienda verificar
        y documentar formalmente estos mecanismos con cada proveedor antes de publicar la App a
        nivel internacional.
      </p>

      <h2>6. Cuánto tiempo conservamos tus datos <LegalReview>confirmar plazos exactos</LegalReview></h2>
      <ul>
        <li><strong>Datos de cuenta y deportivos:</strong> mientras tu cuenta esté activa.</li>
        <li><strong>Tras solicitar la baja:</strong> eliminamos tus datos personales y deportivos en un plazo de hasta 30 días, salvo que la ley nos obligue a conservar cierta información (por ejemplo, registros de facturación, que se conservan según el plazo legal aplicable en materia fiscal).</li>
        <li><strong>Registros de uso de IA (límite diario de solicitudes):</strong> se conservan de forma agregada y se eliminan periódicamente; no incluyen el contenido de los mensajes.</li>
      </ul>

      <h2>7. Tus derechos</h2>
      <p>Puedes ejercer en cualquier momento, escribiéndonos a {CONTACT_EMAIL}, los siguientes derechos:</p>
      <ul>
        <li>Acceder a los datos que tenemos sobre ti.</li>
        <li>Rectificar datos incorrectos.</li>
        <li>Solicitar la eliminación de tu cuenta y tus datos ("derecho al olvido").</li>
        <li>Solicitar una copia de tus datos en formato portable.</li>
        <li>Oponerte o limitar el tratamiento de tus datos en determinados casos.</li>
        <li>Presentar una reclamación ante la autoridad de protección de datos correspondiente (en España, la <strong>AEPD</strong>) si consideras que tus derechos no se han respetado.</li>
      </ul>
      <p>Responderemos a tu solicitud en un plazo razonable, generalmente no superior a 30 días.</p>

      <h2>8. Cookies y almacenamiento local</h2>
      <p>
        Helpin Coach <strong>no utiliza cookies</strong>: no hay cookies de análisis (como Google
        Analytics), ni píxeles publicitarios, ni cookies de rastreo de terceros. No compartimos
        datos con redes publicitarias.
      </p>
      <p>
        Lo único que guardamos en tu navegador es el almacenamiento local (
        <code>localStorage</code>), y con un solo propósito:
      </p>
      <div className="overflow-x-auto my-3">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="py-2 pr-3">Dato</th>
              <th className="py-2 pr-3">Tipo</th>
              <th className="py-2 pr-3">Finalidad</th>
              <th className="py-2 pr-3">Duración</th>
              <th className="py-2">Cómo desactivarlo</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-white/5">
              <td className="py-2 pr-3">Token de sesión (Supabase Auth)</td>
              <td className="py-2 pr-3">Estrictamente necesario</td>
              <td className="py-2 pr-3">Mantener tu sesión iniciada entre visitas</td>
              <td className="py-2 pr-3">Hasta que cierres sesión o borres los datos del navegador</td>
              <td className="py-2">Borrar datos del sitio en la configuración de tu navegador (cerrará tu sesión)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Por ser un dato técnico <strong>estrictamente necesario</strong> para que la App funcione
        (no se usa para publicidad, análisis ni perfilado), no requiere un banner de consentimiento
        interactivo — basta con este aviso informativo, conforme a la excepción del artículo 5.3 de
        la Directiva ePrivacy para almacenamiento técnicamente necesario{' '}
        <LegalReview>confirmar con abogado si aplica igual en tu jurisdicción de lanzamiento</LegalReview>.
      </p>
      <p>
        La App no responde actualmente a las señales de "No rastrear" (Do Not Track) del
        navegador porque, al no usar cookies de rastreo, no hay nada que dicha señal deba
        desactivar.
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas razonables para proteger tus datos: conexiones cifradas (HTTPS),
        control de acceso por usuario a nivel de base de datos (Row Level Security), separación
        entre datos de administración y datos de usuario, y revisiones periódicas de seguridad.
        Ningún sistema es 100% infalible, pero trabajamos activamente para mantener la plataforma
        segura.
      </p>

      <h2>10. Menores de edad <LegalReview>revisión legal</LegalReview></h2>
      <p>
        La App está destinada a entrenadores adultos (mayores de 18 años); no está dirigida a
        niños ni diseñada para que la usen directamente. Los datos de jugadores menores de edad
        que un entrenador introduzca para la gestión de su equipo son responsabilidad de ese
        entrenador, quien debe contar con la autorización correspondiente (por ejemplo, del club o
        de los tutores legales) para tratarlos.
      </p>

      <h2>11. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política de Privacidad ocasionalmente. Si los cambios son
        significativos, te lo notificaremos dentro de la App o por email antes de que entren en
        vigor.
      </p>

      <h2>12. Contacto</h2>
      <p>
        Para cualquier duda o para ejercer tus derechos, escríbenos a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  );
}
