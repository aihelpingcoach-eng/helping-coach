import LegalLayout from './LegalLayout';

const CONTACT_EMAIL = 'ai.helpingcoach@gmail.com';

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidad" updatedAt="22 de julio de 2026">
      <p>
        Esta Política de Privacidad explica qué datos recoge Helpin Coach ("la App", "nosotros"),
        con qué finalidad, y qué derechos tienes sobre ellos. Al crear una cuenta aceptas esta
        política y los <a href="/terminos">Términos de Servicio</a>.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Helpin Coach es responsable del tratamiento de los datos descritos en este documento.
        Puedes contactarnos en{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> para cualquier consulta sobre tus
        datos o para ejercer tus derechos.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <p>Recogemos únicamente los datos necesarios para el funcionamiento de la App:</p>
      <ul>
        <li><strong>Datos de cuenta:</strong> email y contraseña (gestionados de forma segura por nuestro proveedor de autenticación, nunca almacenamos tu contraseña en texto plano).</li>
        <li><strong>Datos de perfil de entrenador:</strong> nombre, nombre del equipo, país, años de experiencia, estilo de entrenamiento y objetivos que introduzcas voluntariamente.</li>
        <li><strong>Datos de jugadores:</strong> los datos de jugadores (nombre, posición, nivel, estilo de juego, imagen opcional) que tú, como entrenador, decidas introducir para gestionar tu equipo. Eres responsable de tener autorización para introducir estos datos.</li>
        <li><strong>Datos de uso deportivo:</strong> alineaciones, formaciones, partidos, lesiones registradas y progresión que generes al usar la App.</li>
        <li><strong>Datos de pago:</strong> si contratas el plan Pro, el pago se procesa directamente por Stripe. No almacenamos los datos completos de tu tarjeta en nuestros servidores.</li>
        <li><strong>Datos técnicos:</strong> información básica de uso (fecha de conexión, tipo de dispositivo) necesaria para el funcionamiento y la seguridad de la App.</li>
      </ul>

      <h2>3. Para qué usamos tus datos</h2>
      <ul>
        <li>Proveer las funciones de la App (tácticas, entrenamiento, progresión, lesiones, informes).</li>
        <li>Generar recomendaciones y análisis mediante inteligencia artificial (formaciones, sinergias entre jugadores, informes de partido) a partir de los datos que introduces.</li>
        <li>Gestionar tu suscripción y procesar pagos a través de Stripe.</li>
        <li>Mantener la seguridad de la cuenta y prevenir el uso abusivo del servicio.</li>
        <li>Comunicarnos contigo sobre tu cuenta cuando sea necesario.</li>
      </ul>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>No vendemos tus datos a terceros. Compartimos datos únicamente con proveedores que nos ayudan a operar la App, bajo sus propias garantías de seguridad:</p>
      <ul>
        <li><strong>Supabase:</strong> hosting de base de datos, autenticación y almacenamiento de archivos.</li>
        <li><strong>Stripe:</strong> procesamiento de pagos de la suscripción Pro.</li>
        <li><strong>Proveedor de inteligencia artificial:</strong> el texto que envías a las funciones de IA (chat con el entrenador, análisis de sinergias, informes) se procesa mediante un servicio de IA de terceros para generar la respuesta.</li>
        <li><strong>Vercel:</strong> hosting de la aplicación web.</li>
      </ul>

      <h2>5. Cuánto tiempo conservamos tus datos</h2>
      <p>
        Conservamos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de tu
        cuenta, borraremos tus datos personales y deportivos en un plazo razonable, salvo que la
        ley nos obligue a conservar determinada información (por ejemplo, registros de facturación).
      </p>

      <h2>6. Tus derechos</h2>
      <p>Puedes ejercer en cualquier momento, escribiéndonos a {CONTACT_EMAIL}, los siguientes derechos:</p>
      <ul>
        <li>Acceder a los datos que tenemos sobre ti.</li>
        <li>Rectificar datos incorrectos.</li>
        <li>Solicitar la eliminación de tu cuenta y tus datos.</li>
        <li>Solicitar una copia de tus datos en formato portable.</li>
        <li>Oponerte al tratamiento de tus datos en determinados casos.</li>
      </ul>

      <h2>7. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas razonables para proteger tus datos: conexiones cifradas (HTTPS),
        control de acceso por usuario a nivel de base de datos y revisiones periódicas de seguridad.
        Ningún sistema es 100% infalible, pero trabajamos activamente para mantener la plataforma segura.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        La App está destinada a entrenadores adultos. Los datos de jugadores menores de edad que un
        entrenador introduzca en la App para la gestión de su equipo son responsabilidad del
        entrenador, quien debe contar con la autorización correspondiente para tratarlos.
      </p>

      <h2>9. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política de Privacidad ocasionalmente. Si los cambios son
        significativos, te lo notificaremos dentro de la App.
      </p>
    </LegalLayout>
  );
}
