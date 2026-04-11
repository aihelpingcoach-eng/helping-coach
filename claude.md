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
- **Lesiones** — Base de datos completa con categorías, tratamiento y prevención
- **Entrenamiento** — Biblioteca de ejercicios por categoría (fuerza, táctico, resistencia)
- **Progresión** — Swipe para avance/retroceso de jugadores (escala 1-99)
- **Avanzado** — Alertas, eventos, carga de trabajo, misiones, carrera, ADN del equipo, informe de partido
- **Perfil** — XP, rangos (8 niveles), estadísticas del entrenador

### Componentes principales
| Componente | Estado |
|---|---|
| AuthScreen | Funcional |
| TacticsMode | Funcional — incluye FormationAdvisor |
| InjuriesMode | Funcional |
| TrainingMode | Funcional |
| ProgressMode | Funcional |
| ProfileMode | Funcional |
| AdvancedMode | Funcional — incluye TeamDNAAnalysis y MatchReportGenerator |
| CoachChat | Funcional |
| FormationAdvisor | Integrado en TacticsMode |
| TeamDNAAnalysis | Integrado en AdvancedMode (tab Resumen) |
| MatchReportGenerator | Integrado en AdvancedMode (tab Informe) |

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

---

## Notas técnicas

- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase
- **Routing:** No usa React Router — modo activo via `useState` en App.tsx
- **IA:** Edge Function de Supabase en `/supabase/functions/ai-service/`. Las funciones `analyzeTeamDNA`, `recommendFormation`, `generateMatchReport` y más están en `src/utils/ai.ts`
- **Auth:** Supabase Auth con contexto en `src/contexts/AuthContext.tsx`
- **XP:** Hook `useXP()` en `src/hooks/useXP.ts` — acciones recompensadas: `ADD_PLAYER`, `CONSULT_AI`, etc.
- **Configuración necesaria:** Archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver `AI_SETUP.md`)
