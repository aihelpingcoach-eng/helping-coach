import logoImg from '../../assets/logo_new.png';
import { GUIDES } from '../../constants/guides';

export default function GuidesIndex() {
  return (
    <div
      className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-gray-200"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <a href="/" className="flex items-center gap-3 mb-8 w-fit">
          <img src={logoImg} alt="Helping Coach" className="w-10 h-10 object-contain" />
          <span className="text-white font-bold text-lg">Helping Coach</span>
        </a>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Guías para entrenadores</h1>
        <p className="text-gray-400 mb-10">
          Artículos prácticos sobre táctica, prevención de lesiones y planificación del entrenamiento,
          escritos para entrenadores de fútbol amateur y de base.
        </p>

        <div className="space-y-4">
          {GUIDES.map(guide => (
            <a
              key={guide.slug}
              href={`/guias/${guide.slug}`}
              className="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 hover:-translate-y-0.5 transition-all"
            >
              <h2 className="text-white font-semibold text-lg mb-2">{guide.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{guide.excerpt}</p>
              <span className="text-purple-400 text-sm font-medium">Leer guía →</span>
            </a>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10">
          <a href="/" className="text-purple-400 hover:text-purple-300 text-sm">
            ← Volver a Helping Coach
          </a>
        </div>
      </div>
    </div>
  );
}
