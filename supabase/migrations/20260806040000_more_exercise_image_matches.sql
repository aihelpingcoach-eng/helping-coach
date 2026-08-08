/*
  # Segunda pasada de coincidencias de GIFs de ejercicios

  Tras la primera migracion de imagenes (20260806030000), se revisaron a
  mano los 26 ejercicios que quedaron sin imagen real, buscando por
  palabras clave en vez de solo comparacion de texto completo. Se
  encontraron 10 coincidencias buenas adicionales.
*/

UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/hip-raise-bent-knee.gif' WHERE id = '310362b4-b20b-4d43-bc5c-0c4c486bf1a9'; -- Elevación de cadera
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/assisted-hanging-knee-raise.gif' WHERE id = '6d2fd908-83b3-460a-a4eb-560e6ff38356'; -- Elevación de piernas colgado
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/calf-stretch-with-hands-against-wall.gif' WHERE id = '7361df35-454a-49c1-8bdb-f1c1d7b6e952'; -- Estiramiento de gemelos en pared
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/kneeling-lat-stretch.gif' WHERE id = '556d4798-2000-4f29-b4f2-e2735be569b7'; -- Estiramiento de dorsal arrodillado
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/diamond-push-up.gif' WHERE id = 'e0ca038e-690a-457e-b44e-09d52987cf61'; -- Flexiones diamante
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/russian-twist.gif' WHERE id = '1bdbad1f-72d9-4bb4-b9d3-738b888d02cc'; -- Giro ruso
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/scissor-jumps-male.gif' WHERE id = '5fccbc24-b2d2-4f44-b099-bdebe7055258'; -- Saltos de tijera
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/runners-stretch.gif' WHERE id = '54d886d4-e453-46db-9e8e-9885b5a5f51e'; -- Estiramiento del corredor
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/semi-squat-jump-male.gif' WHERE id = 'c254cd80-e9ce-4d86-a1ce-757932e0ead7'; -- Sentadilla pliométrica con mancuernas
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/walking-on-incline-treadmill.gif' WHERE id = '43d40d6b-ee34-4b3f-aedc-4d989866758a'; -- Caminata inclinada en cinta
