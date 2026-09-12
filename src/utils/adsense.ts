const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

export const isAdSenseConfigured = Boolean(ADSENSE_CLIENT_ID);

let scriptLoaded = false;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Inyecta el script de Google AdSense una sola vez. No hacemos nada si no
// hay client ID configurado (cuenta todavía sin aprobar), para que la app
// funcione igual en desarrollo o antes de tener AdSense listo.
//
// Además activa los "Anuncios automáticos" (enable_page_level_ads): sin
// esto, el script cargado no registra ningún anuncio activo en la página, y
// el sistema de reconocimiento de código publicitario de Google no
// encuentra nada que validar en la landing pública — solo el <ins> manual
// del AdGate (con Slot ID, que no podemos tener hasta estar aprobados).
// Los anuncios automáticos no necesitan Slot ID.
export function loadAdSenseScript() {
  if (!isAdSenseConfigured || scriptLoaded) return;
  scriptLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  script.crossOrigin = 'anonymous';
  script.onload = () => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: ADSENSE_CLIENT_ID,
        enable_page_level_ads: true,
      });
    } catch {
      // No pasa nada si falla (cuenta aún no aprobada, bloqueador de anuncios, etc.)
    }
  };
  document.head.appendChild(script);
}

export function getAdSenseClientId() {
  return ADSENSE_CLIENT_ID;
}
