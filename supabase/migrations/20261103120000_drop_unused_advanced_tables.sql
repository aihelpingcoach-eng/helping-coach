/*
  # Limpieza de tablas sin uso de Avanzado

  - tactical_alerts y weekly_workload: nada las rellenaba (las pestañas Alertas
    y Carga antiguas estaban siempre vacías). Carga ahora sale de match_events.
  - coach_career: la Carrera antigua creaba una fila al abrirla pero nunca la
    actualizaba (todo a 0). La Carrera nueva calcula con partidos, sesiones y
    misiones.

  Protección: cada tabla solo se borra si no tiene datos útiles; si los tuviera
  se deja como está. Al final se muestra qué tablas siguen existiendo.
*/

DO $$
BEGIN
  IF to_regclass('public.tactical_alerts') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM tactical_alerts) THEN
    DROP TABLE tactical_alerts;
  END IF;

  IF to_regclass('public.weekly_workload') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM weekly_workload) THEN
    DROP TABLE weekly_workload;
  END IF;

  IF to_regclass('public.coach_career') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM coach_career
       WHERE reputation <> 0 OR matches_managed <> 0 OR tactical_decisions <> 0 OR missions_completed <> 0
     ) THEN
    DROP TABLE coach_career;
  END IF;
END $$;

SELECT tabla, to_regclass('public.' || tabla) IS NOT NULL AS sigue_existiendo
FROM unnest(ARRAY['tactical_alerts', 'weekly_workload', 'coach_career']) AS tabla;
