-- Actualiza image_url con GIFs reales de ExerciseGymGifsDB (ejercicios con
-- buen match de nombre) y limpia el resto para que usen la ilustracion SVG
-- en vez de un enlace roto (public/exercises/dataset ya no existe).

UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/biceps-narrow-pull-ups.gif' WHERE id = '1c1332c9-463c-44db-b81d-a5009e904e36'; -- Dominadas -> Dominadas, estrecho, bíceps
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-full-squat-back-pov.gif' WHERE id = '5786e3a1-e312-4c50-9fbe-d8da57552846'; -- Sentadilla completa con barra -> Sentadilla completa con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/adductors/side-plank-hip-adduction.gif' WHERE id = '921df293-e6d4-40f2-a7c2-f44d06689943'; -- Plancha lateral con aducción de cadera -> Aducción de cadera en plancha lateral
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-sumo-deadlift.gif' WHERE id = 'eb10fad9-edef-4f26-892b-6a0d5203a4fb'; -- Peso muerto sumo con barra -> Peso muerto sumo con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-deadlift.gif' WHERE id = 'a0366e5f-aa1f-44ca-a9ce-564857591463'; -- Peso muerto con barra -> Peso muerto con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-romanian-deadlift.gif' WHERE id = '39bc79d7-0e3d-4e48-b904-e3a1679433c7'; -- Peso muerto rumano con barra -> Peso muerto rumano con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/walking-lunge.gif' WHERE id = 'c9acc97d-d907-4330-9800-e12b63ac81f3'; -- Zancada caminando -> Zancada, caminando
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/front-plank-with-twist.gif' WHERE id = 'fe91307f-fe90-4461-83f4-bb6a9c0933fc'; -- Plancha frontal con giro -> Plancha frontal con giro
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif' WHERE id = 'c7c97017-7b24-4570-b389-0706a5c6fbe9'; -- Press de banca con barra -> Press de banca con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/forward-jump.gif' WHERE id = '77ee30ae-68d4-4932-9db0-293274ca0715'; -- Salto adelante -> Salto, hacia adelante
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/backward-jump.gif' WHERE id = '7e2a44bb-426c-4e2f-96f1-91719291ab3c'; -- Salto atrás -> Salto, hacia atrás
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-jump-squat.gif' WHERE id = '32d20d69-8003-49f3-90c5-1ecb5a6431fa'; -- Sentadilla con salto -> Sentadilla con salto con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-jump-squat.gif' WHERE id = '919c36a3-7752-4efc-b3eb-ac81ff5bd6a1'; -- Sentadilla con salto y barra -> Sentadilla con salto con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/burpee.gif' WHERE id = '9d3f9da7-6757-431f-b67c-c572fb9cdf51'; -- Burpee -> Burpee
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/clap-push-up.gif' WHERE id = '0b5d19c8-e05d-4a7e-a2cd-6a135adce2d1'; -- Flexión con palmada -> Flexión con palmada
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/kettlebell-plyo-push-up.gif' WHERE id = '6a2f9b98-d01a-4fcc-8f5b-c27fc0231c9c'; -- Flexión pliométrica -> Flexión pliométrica con kettlebell
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/standing-lateral-stretch.gif' WHERE id = '752c1e44-3404-4222-bcee-9fab7b1e27d3'; -- Estiramiento lateral de pie -> Estiramiento, de pie, lateral
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/spine-stretch.gif' WHERE id = '4527b9e0-065a-489d-ae9a-554635d54fe0'; -- Estiramiento de columna -> Estiramiento, columna
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/exercise-ball-seated-triceps-stretch.gif' WHERE id = '4fe6c582-52bd-4fbb-bef4-9cf46bc3c2f5'; -- Estiramiento de tríceps -> Estiramiento en fitball, sentado, tríceps
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/rear-deltoid-stretch.gif' WHERE id = 'df517b1b-51cf-4a8a-8e78-f0deca00c24e'; -- Estiramiento de deltoides posterior -> Estiramiento de deltoides posterior
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/levator-scapulae/neck-side-stretch.gif' WHERE id = 'f695de28-8293-4855-8163-5bac1c43eac1'; -- Estiramiento lateral de cuello -> Estiramiento, lateral, cuello
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/assisted-prone-lying-quads-stretch.gif' WHERE id = 'f374f7d1-7e97-4364-b818-da8196d2a71e'; -- Estiramiento de cuádriceps tumbado -> Estiramiento tumbado boca abajo, asistido, cuádriceps
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/balance-board.gif' WHERE id = 'df8f90ce-9b33-4234-885c-0f59e34a5bd3'; -- Tabla de equilibrio -> Tabla de equilibrio
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/single-leg-bridge-with-outstretched-leg.gif' WHERE id = '84b7644f-1d19-48c6-90b6-e3c6fcbf4724'; -- Puente a una pierna con pierna extendida -> Puente, a una pierna con extendida
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/seated-piriformis-stretch.gif' WHERE id = '15efb609-7cc2-406b-9f90-800283fb77ee'; -- Estiramiento de piriforme sentado -> Estiramiento del piriforme, sentado
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/assisted-prone-hamstring.gif' WHERE id = '0a4876bb-c605-43d6-b91b-cdf617dcd4d7'; -- Estiramiento de isquiotibiales -> Estiramiento de isquiotibiales asistido, boca abajo
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/seated-glute-stretch.gif' WHERE id = '198e5d85-b8c2-43be-8c9e-10120420bd03'; -- Estiramiento de glúteo sentado -> Estiramiento, sentado, glúteo
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/chest-and-front-of-shoulder-stretch.gif' WHERE id = '14a93615-7c02-4934-8d85-6cba6732c018'; -- Estiramiento de pecho y hombro -> Estiramiento, frontal, pecho hombro
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/cycle-cross-trainer.gif' WHERE id = '8ccd809d-fa77-4f35-bdd6-958fd30f8f9c'; -- Bicicleta elíptica -> Bicicleta elíptica
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/back-and-forth-step.gif' WHERE id = '5c2fcec8-3f79-42d3-83e5-1ec2e7c6fe96'; -- Paso adelante-atrás -> Paso adelante y atrás
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/exercise-ball-hip-flexor-stretch.gif' WHERE id = '3b6d8126-cf94-49e1-968b-9684ca1891a0'; -- Estiramiento de flexor de cadera con balón -> Estiramiento en fitball, cadera flexor
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge-two-legs-on-bench-male.gif' WHERE id = 'caab3fae-702e-496f-8943-628c6faf888c'; -- Puente de glúteo con barra -> Puente de glúteos con barra, a dos piernas en banco
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-jump-squat.gif' WHERE id = '6344387d-3f03-4939-97b2-c5d6683e0a23'; -- Sentadilla con salto y caída -> Sentadilla con salto con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-jump-squat.gif' WHERE id = 'fe31086f-13b1-44bf-bf06-7af6da398e75'; -- Salto de sentadilla parcial -> Sentadilla con salto con barra
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/stationary-bike-run-v-3.gif' WHERE id = '072916a3-e1dd-4487-8b6d-3614666fcd53'; -- Bicicleta estática intensa -> Bicicleta estática, correr
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/band-assisted-wheel-rollerout.gif' WHERE id = '358c3949-da3c-4ac0-af5d-ee7216d570ab'; -- Rueda abdominal con extensión -> Con banda, asistido rueda abdominal
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/ski-step.gif' WHERE id = '18370ecc-9b0d-403f-94e3-f1dc02b5fc35'; -- Paso de esquí lateral -> Paso de esquí
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/stationary-bike-run-v-3.gif' WHERE id = 'd97837b7-ab4a-48f6-b9ef-84e3235e43bf'; -- Bicicleta estática suave -> Bicicleta estática, correr
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/box-jump-down-with-one-leg-stabilization.gif' WHERE id = '82f5cb46-7ec3-427d-b8b6-6c0e2f69f970'; -- Salto a caja con estabilización a una pierna -> Salto al cajón, a una pierna, down stabilization
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/skater-hops.gif' WHERE id = '75742a5f-e3fb-455e-9787-54ab0947036d'; -- Saltos de patinador (skater hops) -> Saltos de patinador
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/incline-push-up-depth-jump.gif' WHERE id = '8696cbe0-29f8-417b-b9fe-8d22f7058d3a'; -- Flexión inclinada con salto en profundidad -> Flexión inclinada, depth jump
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/all-fours-squad-stretch.gif' WHERE id = 'd09ff825-8a83-4cc6-9591-1905b86e1b15'; -- Estiramiento de cuádriceps a cuatro apoyos -> Estiramiento de cuádriceps en cuadrupedia
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/world-greatest-stretch.gif' WHERE id = '39799939-0ff7-42a4-89f9-171c299d59ae'; -- Estiramiento del mundo (world's greatest stretch) -> Estiramiento, world greatest
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/walking-lunge.gif' WHERE id = 'b5948b53-fd4b-40a9-8767-450010ae843b'; -- Zancada con rodilla alta caminando -> Zancada, caminando
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/short-stride-run.gif' WHERE id = 'bb352c12-ac09-4390-ba6d-52cca9ecfde9'; -- Carrera continua -> Carrera a zancada corta
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/bridge-mountain-climber-cross-body.gif' WHERE id = '483f11a1-1bf7-468e-be34-444625cb268c'; -- Escalador (mountain climber) -> Escalador cruzado al cuerpo, puente
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/short-stride-run.gif' WHERE id = '79bc2b07-ad31-4a2a-88ac-1749acbe982d'; -- Carrera de pasos cortos -> Carrera a zancada corta
UPDATE exercises SET image_url = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/bear-crawl.gif' WHERE id = 'a497ae27-3366-4fc7-b130-cfeb45bd3cf6'; -- Desplazamiento en oso (bear crawl) -> Paseo del oso

-- Sin match de confianza: usar ilustracion SVG en vez de enlace roto
UPDATE exercises SET image_url = '' WHERE id = 'd92e7386-d913-4a23-ace7-c5052c4ab9da'; -- Press militar sentado con barra
UPDATE exercises SET image_url = '' WHERE id = 'be5aa7e6-e3c8-43d3-9fce-d9c57812a935'; -- Remo invertido
UPDATE exercises SET image_url = '' WHERE id = '310362b4-b20b-4d43-bc5c-0c4c486bf1a9'; -- Elevación de cadera
UPDATE exercises SET image_url = '' WHERE id = '6d2fd908-83b3-460a-a4eb-560e6ff38356'; -- Elevación de piernas colgado
UPDATE exercises SET image_url = '' WHERE id = '6bfcec5f-a3e4-4df2-be93-e82222497094'; -- Estiramiento de cadera con rodillo
UPDATE exercises SET image_url = '' WHERE id = '2f18f87b-4179-43f0-b00c-a68abf35ed54'; -- Estiramiento de espalda con rodillo
UPDATE exercises SET image_url = '' WHERE id = '7361df35-454a-49c1-8bdb-f1c1d7b6e952'; -- Estiramiento de gemelos en pared
UPDATE exercises SET image_url = '' WHERE id = '556d4798-2000-4f29-b4f2-e2735be569b7'; -- Estiramiento de dorsal arrodillado
UPDATE exercises SET image_url = '' WHERE id = 'dce33596-454e-4acc-b26b-4a24e5fcaa54'; -- Rodillas altas en pared
UPDATE exercises SET image_url = '' WHERE id = '4364e7e3-ccc1-4c62-96d6-d8a10096e5a1'; -- Zancada con mancuernas
UPDATE exercises SET image_url = '' WHERE id = '5c177947-4efd-4506-81a3-7284eb068580'; -- Flexiones en TRX
UPDATE exercises SET image_url = '' WHERE id = '89e5688a-3d23-43be-a1b6-1be5e118eb36'; -- Flexiones de brazos
UPDATE exercises SET image_url = '' WHERE id = 'e0ca038e-690a-457e-b44e-09d52987cf61'; -- Flexiones diamante
UPDATE exercises SET image_url = '' WHERE id = '1bdbad1f-72d9-4bb4-b9d3-738b888d02cc'; -- Giro ruso
UPDATE exercises SET image_url = '' WHERE id = 'd2643318-434d-4e23-be6f-93b1a64cfecc'; -- Zancada con salto
UPDATE exercises SET image_url = '' WHERE id = 'b36e1565-70ee-44e8-976b-80a103b82cee'; -- Salto estrella
UPDATE exercises SET image_url = '' WHERE id = '5fccbc24-b2d2-4f44-b099-bdebe7055258'; -- Saltos de tijera
UPDATE exercises SET image_url = '' WHERE id = '54d886d4-e453-46db-9e8e-9885b5a5f51e'; -- Estiramiento del corredor
UPDATE exercises SET image_url = '' WHERE id = '06306284-6ee5-47f5-97f4-e30a4252ecca'; -- Estiramiento de isquiotibiales y gemelo con banda
UPDATE exercises SET image_url = '' WHERE id = '5068f8d6-e8db-45c9-851a-2bc313ba799d'; -- Comba (cuerda de saltar)
UPDATE exercises SET image_url = '' WHERE id = 'c254cd80-e9ce-4d86-a1ce-757932e0ead7'; -- Sentadilla pliométrica con mancuernas
UPDATE exercises SET image_url = '' WHERE id = '64ccb6d7-db55-4d7e-bf4f-e41e3e382dd4'; -- Saltos en tijera abierta
UPDATE exercises SET image_url = '' WHERE id = 'acf1ac96-1aa8-48e7-a378-45932825e82d'; -- Estiramiento cruz de hierro
UPDATE exercises SET image_url = '' WHERE id = 'afbadb95-d56e-482c-81e8-1080251cb69f'; -- Giro de brazos 360
UPDATE exercises SET image_url = '' WHERE id = '43d40d6b-ee34-4b3f-aedc-4d989866758a'; -- Caminata inclinada en cinta
UPDATE exercises SET image_url = '' WHERE id = '8f83221e-7e06-4253-ab33-e3ebd33ca60b'; -- Flexión y carrera en el sitio

-- Categoria tactico: sin equivalente en una base de datos de gimnasio, usar SVG
UPDATE exercises SET image_url = '' WHERE id = '3090f734-d30f-4c3c-951a-d16ef9a6f670'; -- Transiciones defensa-ataque
UPDATE exercises SET image_url = '' WHERE id = '88c4cb42-3ee2-4f1f-8216-96d52c402ebb'; -- Situaciones de 2v1 y 3v2
UPDATE exercises SET image_url = '' WHERE id = 'b028c77a-058e-4236-86c3-c4825095ffa4'; -- Cobertura y vigilancia defensiva
UPDATE exercises SET image_url = '' WHERE id = 'df6feddb-eb12-41a5-b82c-d702a7e95562'; -- Posesión con líneas de pase prohibidas
UPDATE exercises SET image_url = '' WHERE id = 'd137f10d-00a6-42f9-9b42-85ffd6cbc325'; -- SSG 3v3 con porteros neutros
