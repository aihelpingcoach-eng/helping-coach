# Helping Coach

Aplicación de asistencia táctica para entrenadores de fútbol con inteligencia artificial.

## Funcionalidades

- **Táctica** — Gestión de formaciones, análisis de sinergias y asesor de formaciones con IA
- **Lesiones** — Base de datos de lesiones deportivas con guías de tratamiento y prevención
- **Entrenamiento** — Biblioteca de ejercicios por categoría (fuerza, táctico, resistencia)
- **Progresión** — Sistema de avance de jugadores con swipe interactivo
- **Avanzado** — Alertas tácticas, eventos de equipo, gestión de carga, misiones, carrera e informes de partidos
- **Perfil** — Sistema de XP, rangos y progresión del entrenador

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (base de datos + autenticación + Edge Functions para IA)

## Configuración

Copia `.env.example` a `.env` y rellena las variables de Supabase. Consulta `AI_SETUP.md` para configurar la integración con IA.

## Desarrollo

```bash
npm install
npm run dev
```
