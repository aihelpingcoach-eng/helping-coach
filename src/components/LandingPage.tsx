import logoImg from '../assets/logo_new.png';

export default function LandingPage() {
  const goToApp = () => { window.location.href = '/acceder'; };

  return (
    <div
      className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-gray-200"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >

      {/* ── 1. HEADER ── */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoImg} alt="Helpin Coach" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-base sm:text-lg">Helpin Coach</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          </nav>
          <button
            onClick={goToApp}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* ── 2. HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6 text-purple-300 text-sm font-medium">
          Asistente de fútbol con inteligencia artificial
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Entrena mejor.<br />
          <span className="text-purple-400">Decide más rápido.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed mb-10">
          Helpin Coach es el asistente inteligente para entrenadores de fútbol. Gestiona tu plantilla,
          diseña tácticas, analiza partidos y consulta a la IA — todo en una sola aplicación.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={goToApp}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-purple-900/40"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={goToApp}
            className="border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Ya tengo cuenta
          </button>
        </div>
      </section>

      {/* ── 3. FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Todo lo que necesitas para entrenar</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Diseñado para entrenadores que quieren más control, más claridad y mejores resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                </svg>
              ),
              title: 'Asistente IA',
              desc: 'Consulta tácticas, rotaciones y estrategias a la IA en lenguaje natural.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              title: 'Gestión de plantilla',
              desc: 'Perfiles de jugadores, posiciones, nivel y seguimiento de lesiones.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              ),
              title: 'Tablero de tácticas',
              desc: 'Diseña formaciones y alineaciones de forma visual e intuitiva.',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Análisis de partidos',
              desc: 'Informes post-partido con métricas y recomendaciones personalizadas.',
            },
          ].map((feat) => (
            <div key={feat.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
              <div className="text-purple-400 mb-3">{feat.icon}</div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ASISTENTE IA (DETALLE) ── */}
      <section className="bg-purple-900/10 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-3">Inteligencia Artificial</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Tu asistente táctico disponible las 24 horas
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Pregunta qué formación usar contra un rival de presión alta, pide ideas para el partido
              del sábado o solicita un análisis de sinergias entre jugadores. La IA tiene contexto
              completo de tu equipo y responde con recomendaciones concretas.
            </p>
            <ul className="space-y-3">
              {[
                'Análisis de sinergias entre jugadores',
                'Asesor de formaciones según el rival',
                'Informes de partido generados automáticamente',
                'Chat en lenguaje natural, sin tecnicismos',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">T</div>
              <div className="bg-white/5 rounded-xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300 max-w-xs">
                ¿Qué formación me recomiendas para jugar contra un equipo de 4-4-2 compacto?
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl rounded-tr-none px-4 py-2.5 text-sm text-gray-200 max-w-xs">
                Con tu plantilla y los perfiles que tienes, te recomiendo un 4-3-3 con presión alta.
                Tu mediapunta puede explotar los espacios entre líneas que deja ese sistema...
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                <img src={logoImg} alt="" className="w-5 h-5 object-contain" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">T</div>
              <div className="bg-white/5 rounded-xl rounded-tl-none px-4 py-2.5 text-sm text-gray-300 max-w-xs">
                ¿Y qué pasa si necesito proteger el resultado en los últimos 20 minutos?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. GESTIÓN DE PLANTILLA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1 grid grid-cols-2 gap-3">
          {[
            { name: 'Carlos M.', pos: 'Portero', nivel: 'Avanzado', color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
            { name: 'Iván R.', pos: 'Central', nivel: 'Intermedio', color: 'bg-green-500/20 border-green-500/40 text-green-300' },
            { name: 'Marcos T.', pos: 'Delantero', nivel: 'Avanzado', color: 'bg-purple-500/20 border-purple-500/40 text-purple-300' },
            { name: 'Diego A.', pos: 'Mediocampista', nivel: 'Básico', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
          ].map((p) => (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 mb-2.5 flex items-center justify-center text-purple-300 font-bold text-sm">
                {p.name[0]}
              </div>
              <p className="text-white text-sm font-medium">{p.name}</p>
              <p className="text-gray-500 text-xs">{p.pos}</p>
              <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full border ${p.color}`}>{p.nivel}</span>
            </div>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-3">Plantilla</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            Conoce a fondo a cada jugador
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Crea perfiles detallados para todos tus jugadores: posición, nivel, estilo de juego,
            estado físico y lesiones. La IA utiliza esta información para darte recomendaciones
            adaptadas a tu plantilla real.
          </p>
          <ul className="space-y-3">
            {[
              'Registro de lesiones con historial por jugador',
              'Seguimiento de progresión individual',
              'Estilos de juego y características técnicas',
              'Control de disponibilidad para cada partido',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 6. CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="bg-purple-900/10 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Empieza en tres pasos</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Sin configuraciones complejas. En menos de cinco minutos tienes tu equipo listo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Crea tu cuenta',
                desc: 'Regístrate con tu email, introduce tu nombre de entrenador y el nombre de tu equipo.',
              },
              {
                step: '02',
                title: 'Añade tus jugadores',
                desc: 'Importa o añade manualmente tu plantilla con los datos que consideres relevantes.',
              },
              {
                step: '03',
                title: 'Entrena con IA',
                desc: 'Diseña tácticas, consulta al asistente y analiza tus partidos desde cualquier dispositivo.',
              },
            ].map((s) => (
              <div key={s.step} className="relative pl-14">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CALENDARIO Y PARTIDOS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="bg-gradient-to-br from-purple-900/30 to-gray-900/50 border border-purple-500/20 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-3">Calendario</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Nunca pierdas el hilo de tu temporada
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Gestiona todos tus partidos desde un calendario visual. Consulta los próximos encuentros,
              revisa los resultados anteriores y recibe recordatorios automáticos antes de cada partido.
            </p>
            <button
              onClick={goToApp}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Ver mis partidos
            </button>
          </div>
          <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 space-y-2.5">
            {[
              { fecha: 'Sáb 2 ago', rival: 'CD Atletico Norte', hora: '18:00', estado: 'Próximo' },
              { fecha: 'Sáb 26 jul', rival: 'FC Deportivo Sur', hora: '17:00', estado: 'Victoria' },
              { fecha: 'Dom 20 jul', rival: 'Unión Fútbol Club', hora: '11:00', estado: 'Empate' },
            ].map((m) => (
              <div key={m.fecha} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 text-sm">
                <div>
                  <p className="text-white font-medium">{m.rival}</p>
                  <p className="text-gray-500 text-xs">{m.fecha} · {m.hora}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  m.estado === 'Próximo' ? 'bg-purple-500/20 text-purple-300' :
                  m.estado === 'Victoria' ? 'bg-green-500/20 text-green-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>{m.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA FINAL + FOOTER ── */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Lleva tu equipo al siguiente nivel
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Únete a los entrenadores que ya usan Helpin Coach para preparar mejor sus partidos,
            gestionar su plantilla y tomar decisiones con apoyo de la inteligencia artificial.
          </p>
          <button
            onClick={goToApp}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-10 py-4 rounded-xl text-base transition-colors shadow-lg shadow-purple-900/40"
          >
            Crear cuenta gratis
          </button>
          <p className="mt-4 text-gray-600 text-xs">Sin tarjeta de crédito. Sin compromiso.</p>
        </div>

        <footer className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Helpin Coach" className="w-6 h-6 object-contain" />
              <span className="text-gray-500 text-sm">Helpin Coach</span>
            </div>
            <nav className="flex items-center gap-5 text-sm text-gray-500">
              <a href="/privacidad" className="hover:text-gray-300 transition-colors">Privacidad</a>
              <a href="/terminos" className="hover:text-gray-300 transition-colors">Términos</a>
              <a href="mailto:ai.helpingcoach@gmail.com" className="hover:text-gray-300 transition-colors">Contacto</a>
            </nav>
            <p className="text-gray-600 text-xs">{new Date().getFullYear()} Helpin Coach</p>
          </div>
        </footer>
      </section>
    </div>
  );
}
