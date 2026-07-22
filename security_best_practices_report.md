# Informe de seguridad — Helping Coach

**Fecha:** 2026-07-22
**Alcance:** frontend (React + TypeScript + Vite), backend (Supabase Postgres + RLS + Edge Functions Deno), Stripe.

## Resumen ejecutivo

La app aísla correctamente los datos de cada entrenador (RLS por `user_id` en `players`, `formations`, `formation_players`, `team_synergies`) y no expone secretos en el cliente ni en el repositorio. Sin embargo, **todo el control de acceso de negocio (admin, plan Free/Pro, ad-gate de IA) se aplica solo en el frontend**, siguiendo el antipatrón `REACT-AUTHZ-001` ("no confiar en autorización solo de frontend"): cualquier persona con conocimientos básicos de devtools puede saltárselo llamando directamente a la API de Supabase o a las Edge Functions. Esta es la causa raíz de los tres hallazgos críticos.

---

## 🔴 Críticos

### F1 — Cualquier usuario autenticado puede auto-otorgarse el plan Pro sin pagar
- **Ubicación:** [supabase/migrations/20260111192449_create_coach_profiles.sql:79-85](supabase/migrations/20260111192449_create_coach_profiles.sql#L79-L85)
- **Evidencia:** la política `"Users can update own profile"` permite `UPDATE ... USING (auth.uid() = user_id)` sin restringir columnas. El código cliente nunca actualiza `plan`, pero la API lo permite igual.
- **Impacto:** un usuario ejecuta `supabase.from('coach_profiles').update({plan:'pro'}).eq('user_id', miId)` desde la consola del navegador y obtiene acceso Pro (sin anuncios, sin ad-gate) gratis, para siempre.
- **Fix:** trigger `BEFORE INSERT OR UPDATE` que revierte `plan`/`stripe_customer_id`/`plan_expires_at` a su valor anterior salvo que la operación la ejecute `service_role` (el webhook de Stripe). Ver migración `20260722000000_protect_billing_and_admin_content.sql`.

### F2 — Cualquier usuario autenticado puede editar/borrar la biblioteca compartida de Ejercicios y Lesiones
- **Ubicación:** [supabase/migrations/20260116000000_create_exercises_injuries.sql:21-28, 47-54, 76-83](supabase/migrations/20260116000000_create_exercises_injuries.sql#L21-L28)
- **Evidencia:** las políticas de INSERT/UPDATE/DELETE de `exercises`, `injury_categories` e `injurias` solo exigen `TO authenticated`, no verifican el email admin. El panel `AdminPanel`/`AdminExercises` solo oculta el botón en la UI (`isAdmin.ts`) — es una comprobación puramente visual.
- **Impacto:** cualquier cuenta (incluida una creada por un desconocido en 30 segundos) puede vaciar o vandalizar el contenido que ven TODOS los usuarios de la app.
- **Fix:** reemplazar esas políticas por unas que exijan `(auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com'`. Mismo tratamiento para las políticas de escritura del bucket `exercise-images`.

### F3 — El endpoint de IA (`ai-service`) no valida quién llama ni limita el uso
- **Ubicación:** [src/utils/ai.ts:28](src/utils/ai.ts#L28), [supabase/functions/ai-service/index.ts:15-25](supabase/functions/ai-service/index.ts#L15-L25)
- **Evidencia:** el cliente llama a la función con `Authorization: Bearer <ANON_KEY>` (clave pública, va en el bundle JS). La función nunca valida que exista una sesión de usuario real ni comprueba su plan; no hay límite de peticiones.
- **Impacto:** cualquiera que inspeccione el tráfico de red puede copiar la clave anon (no es secreta) y hacer llamadas ilimitadas y gratuitas a la función, consumiendo el presupuesto de la API de Gemini del propietario sin control de costo.
- **Fix:** la función valida el JWT del usuario con `supabase.auth.getUser()` y aplica un límite diario por usuario (`ai_usage_daily`), registrado server-side donde el cliente no puede falsificarlo.

---

## 🟠 Medios

### F4 — `create-checkout` no verifica que quien llama sea el usuario indicado
- **Ubicación:** [supabase/functions/create-checkout/index.ts:14-21](supabase/functions/create-checkout/index.ts#L14-L21)
- **Evidencia:** `userId` y `email` llegan del body sin validarse contra una sesión.
- **Impacto:** se pueden generar sesiones de Stripe Checkout arbitrarias sin login. No permite robar dinero (Stripe sigue cobrando la tarjeta real de quien paga), pero es una superficie de abuso innecesaria y podría usarse para generar sesiones de checkout con metadata de `user_id` ajeno.
- **Fix:** la función valida el JWT recibido y exige que `user.id === userId` y `user.email === email` antes de crear la sesión de Stripe.

### F5 — El bucket `player-images` permite subir archivos en la carpeta de otro usuario
- **Ubicación:** [supabase/migrations/20260113212615_create_player_images_bucket.sql:33-40](supabase/migrations/20260113212615_create_player_images_bucket.sql#L33-L40)
- **Evidencia:** la política de INSERT solo exige `bucket_id = 'player-images'`; a diferencia de UPDATE/DELETE, no verifica `auth.uid()::text = (storage.foldername(name))[1]`.
- **Impacto:** un usuario autenticado podría subir archivos dentro de la carpeta de otro usuario (contaminación de storage). No permite leer ni robar datos ajenos.
- **Fix:** añadir la misma condición de carpeta que ya usan las políticas de UPDATE/DELETE.

---

## 🟢 Correcto (sin cambios)

- RLS aislado por `user_id` en `players`, `formations`, `formation_players`, `team_synergies`.
- Verificación de firma HMAC del webhook de Stripe (`stripe-webhook/index.ts`).
- Ningún secreto (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `AI_API_KEY`) presente en el bundle cliente ni en el repo; `.env` está en `.gitignore`.
- No se encontró `dangerouslySetInnerHTML` ni otros sumideros DOM XSS (`innerHTML`, `document.write`) en el código de la app.
- Formularios de login/registro ahora usan `autoComplete` correcto (corregido en sesión previa).

## Nota de alcance (no corregido en esta pasada)

- La sesión de Supabase se guarda en `localStorage` (comportamiento estándar del SDK). `REACT-AUTH-001` recomienda evitarlo por riesgo de robo vía XSS, pero cambiarlo a cookies HttpOnly requeriría reescribir el modelo de autenticación de Supabase (fuera de alcance). Como no se detectó ningún sumidero XSS en la app, el riesgo real hoy es bajo — se documenta como aceptado, no como pendiente urgente.
- No hay CSP ni cabeceras de seguridad (`X-Content-Type-Options`, `Referrer-Policy`, etc.) configuradas explícitamente; Vercel aplica algunas por defecto pero no se verificó a nivel de runtime. Recomendado como mejora futura, no crítico dado que no hay XSS conocido que explotar.

## Aplicación de las correcciones

Los fixes de F1, F2, F3 (rate limit), F5 están en la migración `supabase/migrations/20260722000000_protect_billing_and_admin_content.sql` — debes aplicarla en el SQL Editor de Supabase (mismo flujo usado en sesiones anteriores).

Los fixes de F3 (edge function) y F4 están en `supabase/functions/ai-service/index.ts` y `supabase/functions/create-checkout/index.ts` — requieren `supabase functions deploy ai-service` y `supabase functions deploy create-checkout` con tu CLI ya vinculado al proyecto.
