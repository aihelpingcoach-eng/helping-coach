/*
  # Eliminar ejercicios sin buena ilustracion

  16 ejercicios (de fuerza, pliometria, prevencion y resistencia) se
  quedaron sin GIF real tras las dos pasadas de coincidencias con
  ExerciseGymGifsDB, y su ilustracion SVG generica no convencio al
  usuario. Se eliminan de la biblioteca en vez de dejarlos con una
  imagen que no representa bien el ejercicio.

  Los 5 ejercicios de la categoria tactico se dejan intactos (tienen
  su propio sistema de diagramas nuevo, aprobado por separado).
*/

DELETE FROM exercises WHERE id IN (
  'd92e7386-d913-4a23-ace7-c5052c4ab9da', -- Press militar sentado con barra
  'be5aa7e6-e3c8-43d3-9fce-d9c57812a935', -- Remo invertido
  '6bfcec5f-a3e4-4df2-be93-e82222497094', -- Estiramiento de cadera con rodillo
  '2f18f87b-4179-43f0-b00c-a68abf35ed54', -- Estiramiento de espalda con rodillo
  'dce33596-454e-4acc-b26b-4a24e5fcaa54', -- Rodillas altas en pared
  '4364e7e3-ccc1-4c62-96d6-d8a10096e5a1', -- Zancada con mancuernas
  '5c177947-4efd-4506-81a3-7284eb068580', -- Flexiones en TRX
  '89e5688a-3d23-43be-a1b6-1be5e118eb36', -- Flexiones de brazos
  'd2643318-434d-4e23-be6f-93b1a64cfecc', -- Zancada con salto
  'b36e1565-70ee-44e8-976b-80a103b82cee', -- Salto estrella
  '06306284-6ee5-47f5-97f4-e30a4252ecca', -- Estiramiento de isquiotibiales y gemelo con banda
  '5068f8d6-e8db-45c9-851a-2bc313ba799d', -- Comba (cuerda de saltar)
  '64ccb6d7-db55-4d7e-bf4f-e41e3e382dd4', -- Saltos en tijera abierta
  'acf1ac96-1aa8-48e7-a378-45932825e82d', -- Estiramiento cruz de hierro
  'afbadb95-d56e-482c-81e8-1080251cb69f', -- Giro de brazos 360
  '8f83221e-7e06-4253-ab33-e3ebd33ca60b'  -- Flexión y carrera en el sitio
);
