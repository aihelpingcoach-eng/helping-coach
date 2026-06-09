# Helping Coach — Tareas Pendientes

Registro de tareas pendientes ordenadas por prioridad para estabilizar y publicar la app.

---

## 🔴 Crítico — Antes de publicar

- [ ] **Eliminar console.logs de producción**
  - `src/utils/ai.ts` — líneas 75, 82, 90, 92
  - `src/components/TacticsMode.tsx` — líneas 76, 86, 101, 112
  - `src/components/ProfileEditor.tsx` — línea 102

- [ ] **Añadir Error Boundary global**
  - Si un componente falla, la app entera queda en pantalla blanca
  - Crear `src/components/ErrorBoundary.tsx` y envolverlo en `App.tsx`
  - Mostrar pantalla de recuperación con botón "Recargar"

- [ ] **Botón "Eliminar cuenta" no funciona**
  - `src/components/ProfileEditor.tsx` línea 102 solo hace un console.log
  - Implementar la eliminación real con Supabase Auth + borrado de datos
  - O eliminar el botón del UI hasta implementarlo

---

## 🟡 Medio — Importante para buena experiencia

- [ ] **Estados de carga en AdvancedMode**
  - `src/components/AdvancedMode.tsx` líneas 41-52 carga datos sin spinner
  - Añadir estado de loading visible mientras se obtienen datos de Supabase

- [ ] **Mostrar errores de IA al usuario**
  - Cuando la IA falla, el error solo se registra en consola
  - Añadir toast o mensaje de error visible para el usuario
  - Afecta a: sinergias, asesor de formaciones, informe de partido, chat

- [ ] **Manejo de errores en sesión de auth**
  - `src/contexts/AuthContext.tsx` línea 38 sin try/catch en getSession()
  - Añadir manejo de error para que la app no quede en estado indefinido

- [ ] **Prueba completa de todos los modos**
  - Tácticas: crear jugador, asignar posición, sinergias, asesor
  - Entrenamiento: ver ejercicios, crear sesión, completar sesión
  - Lesiones: navegar categorías, ver detalle de lesión
  - Progresión: swipe up/down en jugadores
  - Partidos: crear partido, registrar resultado, ver historial
  - Avanzado: ADN del equipo, informe de partido, misiones
  - Perfil: ver XP, rango, estadísticas
  - Admin: CRUD ejercicios y lesiones

---

## 🟢 Publicación — Play Store

- [ ] **Comprar dominio propio** (ej: helpingcoach.app ~12€/año)
  - Requerido por AdSense/AdMob para monetización

- [ ] **Instalar Capacitor**
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap init "Helping Coach" "com.helpingcoach.app"
  ```

- [ ] **Generar iconos en todos los tamaños**
  - Usar icon.kitchen con el logo de la app
  - Formatos: 48x48, 72x72, 96x96, 144x144, 192x192, 512x512 px

- [ ] **Crear cuenta Google Play Console** (25€ pago único)
  - play.google.com/console

- [ ] **Generar keystore (firma de la app)**
  - Android Studio → Build → Generate Signed Bundle
  - Guardar el archivo .jks en lugar seguro (necesario para siempre)

- [ ] **Preparar ficha de Play Store**
  - Descripción corta (80 caracteres)
  - Descripción larga (4.000 caracteres)
  - Capturas de pantalla (mínimo 2, formato 16:9)
  - Icono 512x512 px
  - Imagen destacada 1024x500 px
  - Clasificación de contenido (cuestionario)

- [ ] **Publicar política de privacidad**
  - URL pública obligatoria
  - Debe mencionar: datos recogidos, uso de IA, Supabase, anuncios

- [ ] **Subir .aab y enviar a revisión**
  - Tiempo de revisión primera vez: 3-7 días

---

## 🔵 Publicación — App Store (iOS)

> Requiere Mac + cuenta Apple Developer (99€/año)

- [ ] **Crear cuenta Apple Developer** (99€/año)
  - developer.apple.com

- [ ] **Instalar plataforma iOS en Capacitor**
  ```bash
  npx cap add ios
  npx cap open ios
  ```

- [ ] **Configurar certificados en Xcode**
  - Bundle ID: com.helpingcoach.app
  - Activar "Automatically manage signing"
  - Distribution Certificate + Provisioning Profile

- [ ] **Preparar capturas de pantalla**
  - iPhone 6.5" obligatorio (1242x2688 px)
  - iPad opcional pero recomendado

- [ ] **Archivar y subir desde Xcode**
  - Product → Archive → Distribute App → App Store Connect

- [ ] **Enviar a revisión en App Store Connect**
  - Tiempo de revisión: 24-48 horas
  - Apple es más estricto — tener la app sin bugs visibles

---

## 💜 Monetización — Antes de lanzar

- [ ] **Implementar campo `plan` en Supabase**
  - Añadir columna `plan text DEFAULT 'free'` en `coach_profiles`
  - Valores: `'free'` | `'pro'`

- [ ] **Crear componente AdGate**
  - Pantalla que bloquea la función de IA hasta ver un anuncio
  - Saltable si el usuario tiene plan Pro
  - `src/components/AdGate.tsx`

- [ ] **Integrar Stripe para plan Pro**
  - stripe.com → crear producto "Helping Coach Pro" a 4,99€/mes
  - Webhook de Stripe → actualizar campo `plan` en Supabase

- [ ] **Registrar cuenta AdMob**
  - admob.google.com
  - Crear unidad de anuncio tipo "Rewarded Video"
  - Integrar con `@capacitor/admob` (para app nativa)

- [ ] **Configurar AdSense para web** (si se publica solo como web)
  - Requiere dominio propio verificado
  - Tiempo de aprobación: 1-2 semanas

---

## 📋 Mejoras del producto (ver ROADMAP.md)

- [ ] Estadísticas individuales por partido (goles, asistencias, tarjetas)
- [ ] Convocatorias por partido
- [ ] Análisis del rival con IA
- [ ] Comparador de jugadores
- [ ] Exportar plantilla en PDF
- [ ] Objetivos de temporada
- [ ] Notas de partido
- [ ] Historial de lesiones por jugador

---

*Última actualización: Junio 2026*
