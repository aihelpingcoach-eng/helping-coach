import { useEffect, useRef } from 'react';
import { getAdSenseClientId, loadAdSenseScript } from '../utils/adsense';

const ADSENSE_SLOT_ID = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Bloque de anuncio real de Google AdSense. Si no hay client/slot ID
// configurados (cuenta sin aprobar todavía), no renderiza nada — quien
// lo use debe mostrar su propio fallback (ver AdGate.tsx).
export default function AdUnit() {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const clientId = getAdSenseClientId();

  useEffect(() => {
    if (!clientId || !ADSENSE_SLOT_ID || pushedRef.current) return;
    loadAdSenseScript();
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // AdSense todavía no ha terminado de cargar o la cuenta no está
      // aprobada; no rompemos la UI por esto.
    }
  }, [clientId]);

  if (!clientId || !ADSENSE_SLOT_ID) return null;

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={ADSENSE_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
