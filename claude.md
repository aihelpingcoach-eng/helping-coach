# Helping Coach — Registro de cambios

Este archivo registra el historial de cambios, decisiones y estado actual del proyecto.

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

---

## Notas técnicas

- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase
- **Routing:** No usa React Router — modo activo via `useState` en App.tsx
- **IA:** Edge Function de Supabase en `/supabase/functions/ai-service/`. Las funciones `analyzeTeamDNA`, `recommendFormation`, `generateMatchReport` y más están en `src/utils/ai.ts`
- **Auth:** Supabase Auth con contexto en `src/contexts/AuthContext.tsx`
- **XP:** Hook `useXP()` en `src/hooks/useXP.ts` — acciones recompensadas: `ADD_PLAYER`, `CONSULT_AI`, etc.
- **Configuración necesaria:** Archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver `AI_SETUP.md`)
