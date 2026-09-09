// Genera HTML estático real para las páginas públicas (landing, guías, FAQ,
// legales) sobre el resultado de `vite build`. El bot de AdSense (a
// diferencia del de Búsqueda) no ejecuta JavaScript de forma fiable, así que
// sin esto esas páginas se ven completamente vacías para su rastreador —
// causa probable del rechazo por "contenido de poco valor" pese a tener
// contenido real. Reutiliza los mismos componentes React que ve el usuario,
// no hay contenido duplicado.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingPage from '../src/components/LandingPage';
import GuidesIndex from '../src/components/guides/GuidesIndex';
import GuideArticle from '../src/components/guides/GuideArticle';
import FAQ from '../src/components/guides/FAQ';
import PrivacyPolicy from '../src/components/legal/PrivacyPolicy';
import TermsOfService from '../src/components/legal/TermsOfService';
import { GUIDES } from '../src/constants/guides';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');

interface Route {
  route: string;
  element: React.ReactElement;
  title?: string;
  description?: string;
}

const routes: Route[] = [
  { route: '/', element: <LandingPage /> },
  { route: '/guias', element: <GuidesIndex />, title: 'Guías para entrenadores de fútbol — Helping Coach', description: 'Artículos prácticos sobre táctica, prevención de lesiones y planificación del entrenamiento para entrenadores de fútbol amateur y de base.' },
  { route: '/faq', element: <FAQ />, title: 'Preguntas frecuentes — Helping Coach', description: 'Respuestas a las dudas más habituales sobre Helping Coach, la app de gestión y táctica de fútbol con inteligencia artificial.' },
  { route: '/privacidad', element: <PrivacyPolicy />, title: 'Política de Privacidad — Helping Coach' },
  { route: '/terminos', element: <TermsOfService />, title: 'Términos de Servicio — Helping Coach' },
  ...GUIDES.map(g => ({
    route: `/guias/${g.slug}`,
    element: <GuideArticle slug={g.slug} />,
    title: `${g.title} — Helping Coach`,
    description: g.excerpt,
  })),
];

const template = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

for (const { route, element, title, description } of routes) {
  const html = renderToStaticMarkup(element);

  let page = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );

  if (title) {
    page = page.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  }
  if (description) {
    page = page.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
    );
  }

  const outDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  console.log(`prerendered ${route} (${html.length} bytes of HTML)`);
}
