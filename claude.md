# Helping Coach — Registro de cambios

Este archivo registra el historial de cambios, decisiones y estado actual del proyecto.

---

## Despliegue

- **URL producción:** https://helping-coach.vercel.app
- **Repositorio GitHub:** https://github.com/aihelpingcoach-eng/helping-coach
- **Plataforma:** Vercel (cuenta: sunriseautomatizaciones-beep)
- **Proyecto Vercel ID:** `prj_sR3GwFr0VqSh2m6JHMZ2e7clodsp`
- **Team ID:** `team_sueenrrCsJT8IDUKMlyeTNEf`

### Comando para redesplegar
```bash
export VERCEL_TOKEN="tu_token"
export VERCEL_ORG_ID="team_sueenrrCsJT8IDUKMlyeTNEf"
export VERCEL_PROJECT_ID="prj_sR3GwFr0VqSh2m6JHMZ2e7clodsp"
vercel --yes --prod
```

---

## Estado actual de la app

### Modos funcionales
- **Táctica** — Formaciones, sinergias con IA, asesor de formaciones (FormationAdvisor integrado)
- **Lesiones** — Mapa corporal interactivo (frente/espalda, pestaña "Por zona") y base de datos completa con categorías, tratamiento y prevención
- **Entrenamiento** — Biblioteca de ejercicios por categoría (fuerza, táctico, resistencia)
- **Progresión** — Swipe para avance/retroceso de jugadores (escala 1-99)
- **Avanzado** — Alertas, eventos, carga de trabajo, misiones, carrera, ADN del equipo, informe de partido
- **Perfil** — XP, rangos (8 niveles), estadísticas del entrenador

### Componentes principales
| Componente | Estado |
|---|---|
| AuthScreen | Funcional |
| TacticsMode | Funcional — incluye FormationAdvisor |
| InjuriesMode | Funcional — incluye InjuryBodyMap |
| InjuryBodyMap | Integrado en InjuriesMode (pestaña Por zona) |
| TrainingMode | Funcional |
| ProgressMode | Funcional |
| ProfileMode | Funcional |
| AdvancedMode | Funcional — incluye TeamDNAAnalysis y MatchReportGenerator |
| CoachChat | Funcional |
| FormationAdvisor | Integrado en TacticsMode |
| TeamDNAAnalysis | Integrado en AdvancedMode (tab Resumen) |
| MatchReportGenerator | Integrado en AdvancedMode (tab Informe) |

---

## Recursos de diseño

A partir de ahora, apoyarse en estos recursos gratuitos cada vez que se cree o mejore una pantalla de
Helping Coach. Contexto del proyecto: React 18 + TypeScript + Vite + Tailwind CSS 3 + Supabase, iconos
con lucide-react, **sin shadcn** (no hay `components.json`). No actualizar Tailwind a v4 ni ejecutar
`shadcn init` sin preguntar al usuario primero.

### 1. Awwwards — referencias antes de diseñar (solo inspiración)
- Antes de diseñar una pantalla o un rediseño, buscar 3–5 referencias en awwwards.com: Sites of the Day
  (`/websites/sites_of_the_day/`), Collections (`/collections/`) y sobre todo Elements (`/elements/`:
  menús, formularios, tarjetas, navegación, dashboards, deportes). Mostrárselas al usuario con el enlace
  y qué se toma de cada una.
- Los sitios premiados son de sus autores: tomar principios (composición, jerarquía, tipografía,
  microinteracciones) y crear un diseño propio. Nunca copiar diseño, código, textos ni imágenes.
- No usar Academy ni Pro (de pago). Del Market, solo productos gratis con licencia comercial explícita.
- Si WebFetch no carga bien la página (mucho JS), capturar las referencias con Playwright.

### 2. 21st.dev — componentes React + Tailwind (plan gratis)
- Skills instaladas: `21st-ui-explore` (proponer 3 direcciones), `21st-ui-build` (construir),
  `21st-ui-review` (revisar UI) y `21st-cli-use` (buscar componentes y logos). Usarlas.
- Flujo: buscar primero en el catálogo (`npx -y @21st-dev/cli@latest search "<lo que se necesita>"`)
  antes de escribir un componente desde cero.
- Gratis y sin cuenta: `search` y `logo <marca>`. Con la cuenta del usuario (`21st login`, lo hace él):
  `get`/`add` gastan las 2 copias gratis al día; mirar antes `21st usage`.
- **Prohibido sin que el usuario lo pida explícitamente:** `21st generate`/`iterate` (IA de pago),
  `publish`, `publish-theme`, `21st-design-sync` y `21st-registry` (publican en abierto). No contratar
  ni activar nada de pago.
- Como no se usa shadcn ni Tailwind 4, no instalar con `21st add`: leer el código del componente y
  reescribirlo con las convenciones del proyecto (TypeScript, Tailwind 3, lucide-react, paleta morada
  `#7C3AED`). Si depende de `cn()` o de Radix, sustituirlo por código propio o preguntar al usuario.
- Licencias: el código es de su autor y de 21st Labs; revisar la licencia de cada componente. Si no la
  indica, usarlo solo como referencia y escribir una versión propia.
- Los logos de marcas (`21st logo`) solo para mostrar herramientas o integraciones, nunca como clientes.
- MCP opcional: si el usuario pide conectarlo, el comando lo ejecuta él con su propia clave
  (`claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: <SU_CLAVE>"`).
  La clave nunca va en el repo ni en `.mcp.json`.

### 3. GetLayers — efectos visuales (solo capas gratis)
- Consultar getlayers.ai cuando una pantalla necesite un efecto especial: fondo animado (login,
  bienvenida, pantallas vacías), gradiente interactivo, escena 3D (Three.js), animación de texto o cursor.
- Solo plan Free (prompt completo, licencia comercial, sin atribución). El MCP de GetLayers, el código
  fuente (Full Stack) y las capas Premium son de pago: no usarlos.
- El prompt de cada capa se copia en `getlayers.ai/layer/<nombre>` con la cuenta del usuario; si no se
  puede leer, pedírselo. Adaptarlo siempre a la paleta propia y a React + Tailwind; nunca entregarlo tal cual.
- Capas gratis vistas el 2026-10-26 (la lista cambia, revisar en cada uso):
  - Fondos: Metal Human, Purple Desert, Sea Storm, Moon Walk, Material Hills
  - Gradientes: Soffit, Soffit 001–004
  - Escenas 3D: Flow Wave, Tunnel, Starfield Close, Storm, Elliptical Galaxy
  - Templates: Soda, Kimi, Baseline (deportes/educación), Lumora, Laocoon
  - Herramientas (`getlayers.ai/tools`: Text Animations, Custom Cursors, Orb Studio, Shader
    Backgrounds…): confirmar en cada una que sigue siendo gratis antes de usarla.

### 4. Nano Banana — todas las imágenes nuevas
- Generar las imágenes nuevas (ilustraciones, fondos, imágenes de ejercicios, OG image) con el servidor
  MCP `nanobanana` de `.mcp.json`, y editar las existentes con su herramienta de edición. Para lotes de
  ejercicios revisar antes `npm run generate-images` (`scripts/generate-exercise-images.ts`).
- Estilo coherente con el personaje de `recursos/` y la paleta morada; usar la misma conversación o
  imágenes de referencia para no perder el estilo.
- Proporciones según el uso: 16:9 fondos/hero, 4:3 o 3:2 tarjetas, 9:16 móvil, 1:1 avatares.
- Sin texto ni logos dentro de las imágenes (el texto va en el HTML). Convertir a WebP y usar lazy loading.
- Seguridad: `.mcp.json` contiene la clave de Gemini. Debe estar en `.gitignore` — comprobar con
  `git ls-files .mcp.json` que no está subido.

### Reglas comunes
- Flujo para pantallas nuevas: referencias de Awwwards → `21st-ui-explore` (3 direcciones, el usuario
  elige) → construir con `frontend-design` + `21st-ui-build` → imágenes con Nano Banana → revisar con
  `21st-ui-review` (accesibilidad WCAG AA, móvil, teclado, `prefers-reduced-motion`).
- Mobile-first. Nada de pago sin preguntar al usuario. Nunca claves en el código ni en el repo.
- No inventar datos: ni testimonios, ni usuarios, ni cifras que el usuario no haya confirmado.
- Antes de un cambio grande, enseñarlo en una preview de Vercel y esperar el OK del usuario.

---

## Historial de sesiones

### Sesión 1 — 2026-04-09

**Objetivos:** Terminar y perfeccionar la app. Eliminar archivos de Bolt.

**Cambios realizados:**

#### Limpieza de Bolt
- Eliminada carpeta `.bolt/` (contenía `config.json` con template `bolt-vite-react-ts` y archivo `prompt`)
- `package.json`: nombre cambiado de `"vite-react-typescript-starter"` → `"helping-coach"`
- `README.md`: reescrito con descripción real del proyecto

#### Bug fixes
- `src/components/AuthScreen.tsx` línea 183 — logo usaba ruta hardcodeada `/src/assets/logo_(1).png` que rompe en producción. Corregido para usar la variable `logoImg` ya importada (igual que línea 110).

#### TypeScript — eliminación de tipos `any`
- `src/components/FormationAdvisor.tsx` — añadida interfaz `FormationRecommendation` con campos: `recommended_formation`, `style`, `reason`, `strengths[]`, `risks[]`, `ideal_scenario`
- `src/components/TeamDNAAnalysis.tsx` — añadida interfaz `TeamDNAResult` con campos: `team_dna`, `style`, `strengths[]`, `weaknesses[]`, `recommendation`
- `src/components/MatchReportGenerator.tsx` — añadida interfaz `MatchReport` con campos: `summary`, `key_players[]`, `issues[]`, `recommendations[]`

#### Integraciones
- `src/components/TacticsMode.tsx` — añadido botón Lightbulb (azul) en la barra superior que despliega `FormationAdvisor` como panel inline. El botón "Aplicar formación" del advisor actualiza directamente `selectedFormation`.
- `src/components/AdvancedMode.tsx`:
  - Carga jugadores y formación activa desde Supabase al montar
  - Tab **Resumen**: añadido `TeamDNAAnalysis` con los datos del equipo
  - Nuevo tab **Informe** con `MatchReportGenerator` (usa los playstyles del equipo cargado)

### Sesión 3 — 2026-04-11

**Objetivo:** Añadir ilustraciones SVG explicativas a cada ejercicio del módulo de Entrenamiento.

**Cambios realizados:**

- Creado `src/components/ExerciseIllustration.tsx` — componente SVG puro con 43 tipos de ilustración:
  - **32 poses físicas** del entrenador (paleta morada #7C3AED, piel gris, estilo del personaje de `recursos/`): squat, hip_thrust, hip_hinge, plank, bench_press, shoulder_press, row, lunge, pushup, mountain_climber, nordic_curl, cable_extension, squat_jump, run, sprint, jump_vertical, depth_jump, jump_lateral, bounds, skipping, hurdle_jump, agility_ladder, triple_jump, balance_single, stretch_dynamic, foam_roll, band_walk, hip_mobility, foot_activation, warmup_run, ice_bath, copenhagen
  - **11 diagramas de campo táctico** (vista superior, campo verde, jugadores coloreados, flechas): field_rondo, field_positions, field_2v1, field_transition, field_press, field_wide, field_counter, field_corner, field_defensive, field_buildup, field_ssg
  - Poses físicas muestran 2 frames (INICIO → EJECUCIÓN) con flecha naranja entre ellas
- Actualizado `src/constants/training.ts` — añadido tipo `IllustrationType` y campo `illustration` a los 86 ejercicios
- Actualizado `src/components/TrainingMode.tsx` — renderiza `ExerciseIllustration` (140px de altura) en la parte superior de cada tarjeta de ejercicio, antes del nombre y descripción

**Resultado:** Cada una de las 86 tarjetas de ejercicio muestra una ilustración SVG a medida. Build ✓ TypeScript ✓

---

### Sesión 2 — 2026-04-09

**Objetivo:** Expandir el apartado de entrenamiento usando fuentes del NotebookLM del usuario.

**Cambios realizados:**

- Creado `src/constants/training.ts` — extrae los ejercicios de `TrainingMode.tsx` a un archivo de constantes separado. Añadidas 2 categorías nuevas y tipos exportados.
- Actualizado `src/components/TrainingMode.tsx` — ahora importa desde constants, añade tabs de Pliometría y Prevención.

**Resultado:** De 34 ejercicios en 3 categorías → **86 ejercicios en 5 categorías**:
- Fuerza (18 ejercicios) — SIA Academy, Adolfo Madrid. Añadidos: Hip Thrust, Sentadilla Búlgara, Nordic Hamstring, Press Militar, Remo, Puente glúteo, Extensión cadera cable, Flexiones explosivas, Sentadilla con salto
- Táctico (20 ejercicios) — entrenamientosdefutbol.es, SSG. Añadidos: SSG 3v3, Pressing con triggers, Posesión con pases prohibidos, Transición 4v4, Gegenpressing 6s, Construcción GK+3, Córner ofensivo, Cobertura defensiva
- Resistencia (20 ejercicios) — Bangsbo, Kirka Athletic, Grupo Ekipo. Añadidos: Protocolo 10-10 Bangsbo, Intermitente con balón 4 m/s, 30-15 IFT, Series 200m técnicas, Hill Sprints, API noruego, Circuito 5×5, Umbral con cambios dirección
- **Pliometría** (11 ejercicios, NUEVA) — Living4Football/Altamirano, Bosco. Hurdles, Depth Jump, Saltos laterales, Triple salto horizontal, Drop Jump+sprint, Skipping, Bounds, CMJ, Reactive Agility, Escalera, Salto largo
- **Prevención** (11 ejercicios, NUEVA) — Forum Sport/BOSU, FIFA F-MARC, Adolfo Madrid. BOSU propiocepción, Nordic Curl, Estiramientos dinámicos, Activación glúteo medio, Equilibrio monopodal, Copenhagen Adductor, Foam rolling, Movilidad cadera, Activación pie/tobillo, FIFA 11+, Crioterapia

### Sesión — 2026-11-01

**Objetivo:** Mapa corporal en Lesiones: tocar la zona donde duele y ver las lesiones probables.

**Cambios realizados:**

- Diseño: 3 direcciones propuestas (artifact "Mapa de dolor"); el usuario eligió la A "Toca y mira" y pidió un
  dibujo más realista → cuerpo anatómico por grupos musculares.
- `src/constants/bodyMapPaths.ts` — trazados SVG de frente y espalda tomados de `react-native-body-highlighter`
  v3.2.0 (licencia MIT, aviso conservado con `@license` para que sobreviva al minificado). Solo los datos; el
  componente es propio.
- `src/constants/injuryZones.ts` — 19 zonas (orden = pintado y tabulación; el cuello va antes que la cabeza para
  que la barbilla quede encima) y su relación músculo → zona → slugs de lesiones.
- `src/components/InjuryBodyMap.tsx` — zona tocada en rojo con brillo; en móvil sube una hoja inferior no modal y
  el cuerpo se desplaza para que la zona siga visible; en escritorio (≥768px) panel lateral. Zonas pequeñas con
  trazo transparente para ampliar el área de toque. Una zona solo se puede tocar si la BD tiene alguna de sus
  lesiones. Teclado, `aria-live` y `prefers-reduced-motion`.
- `src/components/InjuriesMode.tsx` — pestañas "Por zona" (por defecto) / "Por categoría"; al volver de una ficha
  abierta desde el mapa se regresa al mapa con la zona marcada.
- `supabase/migrations/20261101000000_add_more_injuries.sql` — 22 lesiones nuevas (35 → 57), idempotente. La
  escritura en `injuries` es solo del admin: el usuario la ejecuta en el SQL Editor de Supabase.
- `src/constants/injuryZones.test.ts` — comprueba que todo el dibujo tiene zona y que cada slug de las zonas
  existe en las migraciones.
- Vercel: añadidas `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` al entorno Preview (sin ellas las previews no
  arrancan y se queda la landing estática).

### Sesión — 2026-11-02

**Objetivo:** Rehacer la barra inferior de navegación (opción B elegida por el usuario).

**Cambios realizados:**

- `src/components/BottomNav.tsx` — 4 secciones fijas (Lesiones, Entreno, Tácticas en el centro, Partidos) + "Más",
  que abre una hoja (`Modal` align="bottom") con Progreso, Avanzado, Perfil y Admin. "Más" se resalta cuando la
  sección activa está dentro. La hoja se renderiza fuera del `<nav>` porque su `backdrop-blur` haría de contenedor
  de los `fixed`. Un único color activo (morado-200 sobre pastilla morada; inactivo gris-400): antes cada sección
  tenía su color y el rojo de Lesiones daba contraste 1,8:1. `<nav aria-label>` + `aria-current`. Barra centrada
  (`max-w-lg`) en escritorio. Icono de Progreso de línea.
- Motivo: con 7–8 botones la barra no cabía; en 360 px Perfil quedaba fuera de pantalla y en 390 px solo se veía
  un tercio, sin indicación de que se podía deslizar.
- `src/App.tsx` — avatar de Perfil (foto o inicial) junto a la campana; lados de la cabecera con `flex-1` para que
  el logo siga centrado.
- `src/hooks/useTutorial.ts` — los pasos de Progresión, Avanzado y Perfil dicen dónde están ahora.
- Iconos: faltaba `apple-touch-icon` (el iPhone ponía una captura de la página al añadirla a inicio) y los
  iconos eran un balón provisional. Ahora todos salen del logo `src/assets/logo_new.png`: `apple-touch-icon.png`
  (180, opaco), `icon-192/512.png` (fondo morado, zona segura maskable), `favicon.ico` (16/32/48) y
  `favicon-96.png` (Google pide múltiplos de 48 px). `public/sw.js` pasa a `CACHE_NAME` v2: los estáticos son
  cache-first y hay que subir la versión cada vez que cambien iconos o manifest.

### Sesión — 2026-11-03

**Objetivo:** Ordenar Avanzado y mejorarlo (plan aprobado por el usuario antes de tocar nada).

**Cambios realizados:**

- `src/components/AdvancedMode.tsx` — de 9 pestañas (en móvil solo se veían 3) a 4: Resumen, Equipo, Retos y
  Avisos. Fuera Alertas y Carga: nada escribía en `tactical_alerts` ni en `weekly_workload` (siempre vacías).
  Carga volverá con el registro de acciones del partido (los minutos saldrán de entradas y salidas).
- `AdvancedSummary.tsx` — Resumen de una pantalla (antes >3.000 px repitiendo las otras pestañas).
- `src/hooks/useTeamAlerts.ts` + `TeamAlertsList.tsx` — avisos calculados al momento (no se guardan, así no
  se quedan desfasados): próximo partido ≤3 días, resultados pendientes, alineación a medias, jugador que baja
  en sus 2 últimas evaluaciones, ≥7 días sin entrenar. Enlazan a la sección con `onNavigate` (App → AdvancedMode).
  Ojo: `player_progress` no tiene relación declarada con `players` en la BD; el embed `players(name)` da 400.
- `useEventGenerator.ts` — no esperaba a los datos: corría con los partidos sin cargar y creaba "Sin historial de
  partidos"; además solo miraba 7 días y lo duplicaba cada semana. Ahora recibe `ready`, no duplica y retira ese
  aviso cuando hay partidos. `EventCards.tsx` da el XP anunciado (antes siempre 10) y usa `Modal`.
- `CareerMode.tsx` — datos reales (partidos, victorias, entrenamientos, misiones); ya no usa `coach_career`.
  Rangos (progression.ts, 8) y niveles (levels.ts) se mantienen: el usuario prefirió no unificarlos.
- `MatchReportGenerator.tsx` — elegir un partido registrado rellena el resultado; "Tiros a puerta".
- Clasificación (`LeaderboardPanel.tsx`, `useRankingPosition.ts`, `RankingPrivacyToggle.tsx` en Perfil):
  pestaña semanal, puesto real fuera del top 100, opción de no aparecer y la edad deja de ser pública.
  Migración `20261102000000_ranking_privacy_and_weekly.sql` (ejecutada por el usuario): `show_in_ranking`,
  `xp_events` rellenada por trigger al subir `total_xp`, vista `coach_rankings_weekly` (lunes, hora de Madrid).

---

## Notas técnicas

- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase
- **Routing:** No usa React Router — modo activo via `useState` en App.tsx
- **IA:** Edge Function de Supabase en `/supabase/functions/ai-service/`. Las funciones `analyzeTeamDNA`, `recommendFormation`, `generateMatchReport` y más están en `src/utils/ai.ts`
- **Auth:** Supabase Auth con contexto en `src/contexts/AuthContext.tsx`
- **XP:** Hook `useXP()` en `src/hooks/useXP.ts` — acciones recompensadas: `ADD_PLAYER`, `CONSULT_AI`, etc.
- **Configuración necesaria:** Archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver `AI_SETUP.md`)
