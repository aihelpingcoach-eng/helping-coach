// Compila scripts/prerender.tsx (que sí puede escribirse con JSX normal,
// importando los componentes reales) a un bundle Node ejecutable. Node no
// sabe resolver imports de imágenes (.png/.webp) como hace Vite en el
// cliente, así que se sustituyen por una ruta de texto simple — el HTML
// estático generado es solo para que los rastreadores vean el contenido de
// texto; el bundle de la app sustituye el contenido real al cargar.
import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outfile = path.join(__dirname, '.prerender-bundle.mjs');

const imagePlaceholderPlugin = {
  name: 'image-placeholder',
  setup(build) {
    build.onLoad({ filter: /\.(png|jpe?g|webp|svg)$/ }, (args) => ({
      contents: `export default ${JSON.stringify('/' + path.basename(args.path))};`,
      loader: 'js',
    }));
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, 'prerender.tsx')],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/server'],
  plugins: [imagePlaceholderPlugin],
});

try {
  await import(`file://${outfile}?t=${Date.now()}`);
} finally {
  fs.rmSync(outfile, { force: true });
}
