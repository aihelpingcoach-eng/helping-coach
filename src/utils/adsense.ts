const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

export const isAdSenseConfigured = Boolean(ADSENSE_CLIENT_ID);

let scriptLoaded = false;

// Inyecta el script de Google AdSense una sola vez. No hacemos nada si no
// hay client ID configurado (cuenta todavía sin aprobar), para que la app
// funcione igual en desarrollo o antes de tener AdSense listo.
export function loadAdSenseScript() {
  if (!isAdSenseConfigured || scriptLoaded) return;
  scriptLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

export function getAdSenseClientId() {
  return ADSENSE_CLIENT_ID;
}
