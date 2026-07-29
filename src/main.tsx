import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { loadAdSenseScript } from './utils/adsense';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Se carga en toda la app (incluida la landing pública en "/") para que el
// rastreador de Google pueda verificar el sitio, no solo dentro del gate de
// anuncios (que está detrás de login). No hace nada si no hay client ID.
loadAdSenseScript();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
