# Helping Coach — Roadmap de Mejoras

Registro de funcionalidades pendientes de implementar, ordenadas por prioridad e impacto.

---

## Prioridad Alta

### 1. Estadísticas individuales por partido
**Qué es:** Registrar goles, asistencias, tarjetas amarillas/rojas y minutos jugados de cada jugador en cada partido.  
**Por qué:** Actualmente los jugadores solo tienen "nivel". Con estadísticas reales, las evaluaciones de progresión tienen datos objetivos en lugar de ser subjetivas.  
**Conexión:** Liga el Calendario de Partidos con el Modo Progresión — al registrar un resultado, se abre una pantalla para puntuar a cada jugador convocado.  
**Tablas nuevas:** `match_player_stats` (match_id, player_id, goals, assists, yellow_cards, red_cards, minutes_played).

---

### 2. Convocatorias por partido
**Qué es:** Antes de cada partido, seleccionar los jugadores convocados (de la plantilla completa).  
**Por qué:** Permite gestionar rotaciones y tener visibilidad de quién juega poco. Genera contexto real para el análisis táctico.  
**Flujo:** Crear partido → Convocar jugadores → Registrar resultado → Puntuar actuaciones.  
**Tablas nuevas:** `match_callups` (match_id, player_id, is_starter).

---

### 3. Análisis del rival con IA
**Qué es:** Sección de scouting: describes al rival (formación, estilo, jugadores clave) y la IA genera un informe de preparación táctica.  
**Contenido del informe:**
- Cómo atacar al rival (debilidades defensivas)
- Cómo defenderse (amenazas ofensivas)
- Formación recomendada para el partido
- Jugadores clave del rival a vigilar  

**Ubicación:** Nuevo tab en Modo Avanzado o integrado en el detalle de cada partido.

---

### 4. Comparador de jugadores
**Qué es:** Seleccionar dos jugadores y verlos lado a lado con sus stats, PlayStyle, nivel e historial de progresión.  
**Por qué:** Útil para decidir titularidades, evaluar renovaciones o comparar evolución en el tiempo.  
**Ubicación:** Botón "Comparar" en el perfil de jugador dentro de Progresión.

---

## Prioridad Media

### 5. Exportar plantilla y alineación en PDF
**Qué es:** Generar un documento PDF con la alineación visual del campo, los jugadores y sus PlayStyles.  
**Casos de uso:** Compartir con cuerpo técnico, imprimir para el vestuario, guardar como histórico de temporada.  
**Librería sugerida:** `jsPDF` + `html2canvas` para capturar el campo SVG.

---

### 6. Objetivos de temporada
**Qué es:** Definir metas al inicio de la temporada (ganar X partidos, llegar a la final, mejorar X jugadores a nivel 70+) y ver el progreso hacia ellas.  
**Conexión con misiones:** Los objetivos de temporada son metas largas (3-6 meses); las misiones actuales son semanales/diarias. Son complementarios.  
**Tabla nueva:** `season_goals` (user_id, title, target_value, current_value, deadline, completed).

---

### 7. Notas y diario de partido
**Qué es:** Campo de texto libre al registrar cada resultado: situaciones clave, errores tácticos, jugadores destacados, decisiones del banquillo.  
**Por qué:** El campo `notes` ya existe en la tabla `matches` — solo hay que exponer la UI para escribir en él.  
**Coste:** Mínimo — es un textarea en el modal de resultado.

---

### 8. Historial de lesiones por jugador
**Qué es:** Registrar qué lesiones ha sufrido cada jugador, cuándo ocurrieron y si está recuperado.  
**Conexión:** Cruza el Modo Lesiones (base de datos) con la plantilla real. Un jugador puede tener estado "lesionado" que aparece en el campo táctico.  
**Tabla nueva:** `player_injuries` (player_id, injury_id, date_occurred, date_recovered, notes).

---

### 9. Modo Portapapeles / Pizarra táctica
**Qué es:** Canvas libre donde el entrenador puede dibujar jugadas con flechas, posiciones y notas sobre un campo de fútbol.  
**Casos de uso:** Preparar jugadas de estrategia ofensiva, defensiva o de pelota parada para mostrar al equipo.  
**Tecnología:** Canvas HTML5 o librería ligera como `fabric.js`.

---

## Prioridad Baja

### 10. Modo offline básico
**Qué es:** Guardar localmente los datos más consultados (plantilla, formación activa, ejercicios) usando `localStorage` o IndexedDB para funcionar sin internet.  
**Por qué:** La app ya es PWA — es el paso natural para hacerla completamente funcional en el campo.  
**Scope inicial:** Solo lectura offline; escritura requiere conexión.

---

### 11. Compartir equipo con asistentes
**Qué es:** Generar un enlace o código de invitación para que otro usuario (asistente técnico) pueda ver la plantilla en modo lectura.  
**Scope:** Solo visualización, sin permisos de edición para el invitado.

---

### 12. Informes automáticos semanales
**Qué es:** Cada lunes, la app genera un resumen de la semana: partidos jugados, jugadores evaluados, sesiones completadas, progresión del equipo.  
**Entrega:** Notificación push o email (usando el webhook de n8n ya configurado).

---

### 13. Calendario de temporada unificado
**Qué es:** Vista de calendario mensual que combine partidos, sesiones de entrenamiento y días de descanso en una sola pantalla.  
**Por qué:** Ahora los partidos y las sesiones de entrenamiento están en modos separados. Un calendario unificado da visión global de la carga de trabajo.

---

### 14. Rankings y tabla de clasificación
**Qué es:** Registrar la posición del equipo en la competición semana a semana y ver la evolución en forma de gráfico.  
**Tabla nueva:** `league_standings` (user_id, date, position, points, matches_played).

---

### 15. Modo torneo / eliminatorias
**Qué es:** Crear un torneo propio (copa, torneo de verano) con brackets de eliminación directa o grupos, y registrar los resultados de cada ronda.

---

## Mejoras técnicas pendientes

| Mejora | Descripción | Prioridad |
|---|---|---|
| Code splitting | El bundle principal supera 500KB. Separar en chunks por modo reduciría el tiempo de carga inicial | Alta |
| Imágenes de jugadores | Permitir subir foto de perfil del jugador (bucket Supabase Storage ya existe) | Media |
| Dark mode toggle | La app siempre es oscura. Añadir opción de tema claro para exteriores con mucha luz | Baja |
| Tests E2E | Playwright para probar flujos críticos (login → crear jugador → guardar formación) | Media |
| Rate limiting en Edge Function | Proteger `/ai-service` con límite de requests por usuario para evitar abuso de cuota | Alta |

---

*Última actualización: Junio 2026*
