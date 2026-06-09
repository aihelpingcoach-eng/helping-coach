"""
Genera ilustraciones de ejercicios usando Gemini API (via requests).
Uso: python scripts/generate_exercise_image.py
"""
import requests
import base64
import json
import os
import time

API_KEY = "AIzaSyBQeneORiUyGe455vvWis-WKYCNDFCI0SI"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

# Usa el squat ya generado como referencia de estilo
REFERENCE_IMAGE = r"C:\Users\Niños\Desktop\helping coach\helping_coach-main\public\exercises\squat.png"
OUTPUT_DIR = r"C:\Users\Niños\Desktop\helping coach\helping_coach-main\public\exercises"

# 86 ejercicios — squat ya generado, se salta automáticamente
EXERCISES = [
    # FUERZA
    ("squat",             "SENTADILLA",              "LEFT: character standing upright arms extended forward. RIGHT: character in deep squat knees bent 90° arms extended forward."),
    ("hip_thrust",        "HIP THRUST",              "LEFT: character sitting on floor back against bench feet flat. RIGHT: character with hips fully extended back on bench straight line knees to shoulders."),
    ("bulgarian_squat",   "SENTADILLA BÚLGARA",      "LEFT: character standing one foot behind on bench. RIGHT: character in deep split squat rear knee near ground."),
    ("nordic_curl",       "NORDIC CURL",             "LEFT: character kneeling upright feet held down. RIGHT: character leaning forward body straight from knee to head lowering toward floor."),
    ("military_press",    "PRESS MILITAR",           "LEFT: character standing holding barbell at shoulder height. RIGHT: character pressing barbell overhead arms fully extended."),
    ("row",               "REMO",                    "LEFT: character bent forward holding barbell arms extended toward floor. RIGHT: character bent forward barbell pulled to lower chest elbows back."),
    ("glute_bridge",      "PUENTE GLÚTEO",           "LEFT: character lying on back knees bent feet flat. RIGHT: character with hips raised forming straight line from shoulders to knees."),
    ("cable_extension",   "EXTENSIÓN CABLE",         "LEFT: character standing holding cable handle arms down. RIGHT: character with arms raised in front body engaged."),
    ("explosive_pushup",  "FLEXIÓN EXPLOSIVA",       "LEFT: character in pushup position arms bent low. RIGHT: character pushing up hands leaving ground clapping."),
    ("squat_jump",        "SENTADILLA SALTO",        "LEFT: character in squat position arms back. RIGHT: character airborne jumping up arms raised."),
    ("bench_press",       "PRESS BANCA",             "LEFT: character lying on bench barbell at chest. RIGHT: character pressing barbell up arms fully extended."),
    ("shoulder_press",    "PRESS HOMBROS",           "LEFT: character seated dumbbells at shoulder height. RIGHT: character pressing dumbbells overhead arms extended."),
    ("deadlift",          "PESO MUERTO",             "LEFT: character standing holding barbell at thighs. RIGHT: character bending forward barbell near shins back straight."),
    ("pull_up",           "DOMINADA",                "LEFT: character hanging from bar arms fully extended. RIGHT: character chin above bar arms bent pulled up."),
    ("dip",               "FONDOS",                  "LEFT: character on parallel bars arms extended. RIGHT: character with arms bent body lowered between bars."),
    ("cable_fly",         "APERTURAS CABLE",         "LEFT: character standing arms extended wide holding cables. RIGHT: character arms brought together in front of chest."),
    ("lat_pulldown",      "JALÓN POLEA",             "LEFT: character seated bar above head arms extended. RIGHT: character pulling bar to upper chest elbows down."),
    ("leg_press",         "PRENSA",                  "LEFT: character seated in leg press machine knees bent platform up. RIGHT: character pushing platform away legs extended."),

    # TÁCTICO
    ("rondo",             "RONDO",                   "LEFT: four players forming a circle. RIGHT: players passing ball in circle keeping possession."),
    ("positions",         "POSICIONES",              "LEFT: team in defensive shape compact. RIGHT: team spread across field in attacking positions."),
    ("2v1",               "2 VS 1",                  "LEFT: two attackers facing one defender. RIGHT: attackers completing quick combination to beat defender."),
    ("transition",        "TRANSICIÓN",              "LEFT: team in attack possession. RIGHT: team quickly reorganizing after losing ball."),
    ("pressing",          "PRESIÓN",                 "LEFT: team sitting deep in defensive shape. RIGHT: team pressing high up the field together."),
    ("wide_play",         "JUEGO AMPLIO",            "LEFT: team narrow in possession. RIGHT: wide players stretching to touch lines creating space."),
    ("counter_attack",    "CONTRAATAQUE",            "LEFT: team defending with many players back. RIGHT: three players sprinting forward in counterattack."),
    ("corner",            "CÓRNER",                  "LEFT: players setting up for corner kick. RIGHT: players making runs into box as ball is crossed."),
    ("defensive_shape",   "BLOQUE DEFENSIVO",        "LEFT: team in high defensive line. RIGHT: team in compact low defensive block."),
    ("build_up",          "CONSTRUCCIÓN",            "LEFT: goalkeeper with ball defenders spread. RIGHT: ball played out from back through midfield."),
    ("ssg_3v3",           "3 VS 3",                  "LEFT: three players facing three players. RIGHT: players in fast 3v3 small sided game action."),
    ("ssg_4v4",           "4 VS 4",                  "LEFT: four players facing four players. RIGHT: players in 4v4 small sided game."),
    ("gegenpressing",     "GEGENPRESSING",           "LEFT: team just lost ball. RIGHT: all players immediately pressing together to win ball back."),
    ("gk_buildup",        "CONSTRUCCIÓN PORTERO",    "LEFT: goalkeeper with ball defenders positioned. RIGHT: goalkeeper playing short pass to start build-up."),
    ("offensive_corner",  "CÓRNER OFENSIVO",         "LEFT: players positioned for offensive corner routine. RIGHT: players executing corner set piece."),
    ("defensive_cover",   "COBERTURA DEFENSIVA",     "LEFT: defender marking opponent. RIGHT: second defender covering behind first defender."),
    ("possession_pass",   "POSESIÓN",                "LEFT: team in possession circle. RIGHT: quick passing sequence keeping the ball."),
    ("trigger_press",     "PRESSING TRIGGERS",       "LEFT: team waiting for trigger moment. RIGHT: team pressing immediately after trigger signal."),
    ("prohibited_passes", "PASES PROHIBIDOS",        "LEFT: players in possession exercise. RIGHT: players forced to play creatively avoiding zones."),

    # RESISTENCIA
    ("interval_10_10",    "10-10 BANGSBO",           "LEFT: player standing at cone. RIGHT: player sprinting flat out 10 meters."),
    ("intermittent_ball", "INTERMITENTE BALÓN",      "LEFT: player with ball feet together. RIGHT: player in high-intensity dribble sprint."),
    ("fit_30_15",         "30-15 IFT",               "LEFT: player walking recovering. RIGHT: player sprinting toward cone."),
    ("200m_series",       "SERIES 200M",             "LEFT: player at starting line. RIGHT: player in full sprint technique arms pumping."),
    ("hill_sprint",       "HILL SPRINT",             "LEFT: player at base of incline ready. RIGHT: player sprinting uphill leaning forward."),
    ("norwegian_api",     "PROTOCOLO NORUEGO",       "LEFT: player standing ready. RIGHT: player in controlled sprint with high knees."),
    ("circuit_5x5",       "CIRCUITO 5×5",            "LEFT: player at first station ready. RIGHT: player moving between circuit stations fast."),
    ("threshold",         "UMBRAL AERÓBICO",         "LEFT: player jogging easy pace. RIGHT: player at threshold pace with direction change."),
    ("sprint_10m",        "SPRINT 10M",              "LEFT: player in starting position crouched. RIGHT: player in explosive 10 meter sprint."),
    ("sprint_30m",        "SPRINT 30M",              "LEFT: player at start line upright. RIGHT: player at full speed in 30 meter sprint."),
    ("acceleration",      "ACELERACIÓN",             "LEFT: player leaning forward at start. RIGHT: player building to full speed accelerating."),
    ("change_direction",  "CAMBIO DIRECCIÓN",        "LEFT: player running straight. RIGHT: player planting foot cutting 90 degrees."),
    ("high_intensity",    "ALTA INTENSIDAD",         "LEFT: player recovering between reps. RIGHT: player sprinting at maximum effort."),
    ("repeated_sprint",   "SPRINTS REPETIDOS",       "LEFT: player at start of sprint series. RIGHT: player on third sprint maintaining speed."),
    ("agility_run",       "CARRERA AGILIDAD",        "LEFT: player standing before agility course. RIGHT: player weaving through cones at speed."),
    ("warmup_jog",        "CALENTAMIENTO TROTE",     "LEFT: player standing ready. RIGHT: player jogging easy with relaxed arms."),
    ("cooldown",          "ENFRIAMIENTO",            "LEFT: player after workout standing. RIGHT: player walking slowly recovering."),
    ("fartlek",           "FARTLEK",                 "LEFT: player jogging easy. RIGHT: player alternating fast and slow running."),
    ("long_run",          "CARRERA LARGA",           "LEFT: player at start of long run. RIGHT: player in steady long distance running pace."),
    ("tempo_run",         "CARRERA TEMPO",           "LEFT: player at comfortable pace. RIGHT: player at comfortably hard tempo pace."),

    # PLIOMETRÍA
    ("hurdle_jump",       "HURDLE JUMP",             "LEFT: character standing before row of small hurdles. RIGHT: character mid-jump clearing hurdle knees raised."),
    ("depth_jump",        "DEPTH JUMP",              "LEFT: character standing on small box. RIGHT: character landing from box and immediately jumping up."),
    ("lateral_jump",      "SALTO LATERAL",           "LEFT: character standing on left side of line. RIGHT: character jumping sideways over line to right side."),
    ("triple_jump",       "TRIPLE SALTO",            "LEFT: character at start of triple jump. RIGHT: character in flight during third bound."),
    ("drop_sprint",       "DROP JUMP + SPRINT",      "LEFT: character stepping off box. RIGHT: character sprinting forward immediately after landing."),
    ("skipping",          "SKIPPING",                "LEFT: character standing upright. RIGHT: character running in place with high knees rapidly."),
    ("bounds",            "ZANCADAS",                "LEFT: character in upright running stance. RIGHT: character in exaggerated bounding stride."),
    ("cmj",               "CMJ",                     "LEFT: character standing upright. RIGHT: character in countermovement jump airborne arms raised."),
    ("reactive_agility",  "AGILIDAD REACTIVA",       "LEFT: character in athletic stance ready. RIGHT: character reacting and sprinting in chosen direction."),
    ("agility_ladder",    "ESCALERA AGILIDAD",       "LEFT: character standing at start of ladder. RIGHT: character stepping quickly through ladder rungs."),
    ("broad_jump",        "SALTO LARGO",             "LEFT: character in squat arms back. RIGHT: character in flight during long jump arms forward."),

    # PREVENCIÓN
    ("bosu_balance",      "BOSU PROPIOCEPCIÓN",      "LEFT: character standing on flat ground. RIGHT: character balancing on one leg on BOSU ball."),
    ("dynamic_stretch",   "ESTIRAMIENTO DINÁMICO",   "LEFT: character standing upright. RIGHT: character doing leg swing dynamic stretch."),
    ("glute_activation",  "ACTIVACIÓN GLÚTEO MEDIO", "LEFT: character standing with resistance band at knees. RIGHT: character stepping sideways with band stretching."),
    ("single_leg_balance","EQUILIBRIO MONOPODAL",    "LEFT: character standing on two feet. RIGHT: character balancing on one leg eyes forward."),
    ("copenhagen",        "COPENHAGEN ADDUCTOR",     "LEFT: character in side plank both feet on ground. RIGHT: character in side plank top leg raised."),
    ("foam_roll",         "FOAM ROLLING",            "LEFT: character standing holding foam roller. RIGHT: character rolling quad muscle on foam roller on floor."),
    ("hip_mobility",      "MOVILIDAD CADERA",        "LEFT: character standing upright. RIGHT: character in deep hip flexor stretch lunge position."),
    ("foot_activation",   "ACTIVACIÓN PIE",          "LEFT: character sitting with bare feet flat. RIGHT: character doing short foot exercise toes gripping."),
    ("fifa11",            "FIFA 11+",                "LEFT: character at start of FIFA 11+ warm-up. RIGHT: character performing Nordic hamstring exercise."),
    ("ice_bath",          "CRIOTERAPIA",             "LEFT: character standing before ice bath. RIGHT: character seated in ice bath recovery."),
    ("band_walk",         "MARCHA CON BANDA",        "LEFT: character standing band around knees feet hip-width. RIGHT: character stepping sideways band stretched."),
]

# Ya generadas — se saltan
ALREADY_DONE = {"squat"}

IMAGE_MODELS = [
    "gemini-2.0-flash-preview-image-generation",
    "gemini-2.0-flash-exp-image-generation",
    "gemini-2.0-flash-image-generation",
]

def find_working_model():
    """Busca el primer modelo de imagen que funcione."""
    print("Detectando modelo disponible...")
    url = f"{BASE_URL}/models?key={API_KEY}"
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            models = r.json().get("models", [])
            image_models = [
                m["name"].replace("models/", "")
                for m in models
                if any(k in m["name"].lower() for k in ["image", "imagen"])
                and "generateContent" in m.get("supportedGenerationMethods", [])
            ]
            print(f"  Modelos imagen encontrados: {image_models}")
            if image_models:
                return image_models[0]
    except Exception as e:
        print(f"  No se pudo listar modelos: {e}")

    # Probar la lista hardcodeada
    for model in IMAGE_MODELS:
        test_url = f"{BASE_URL}/models/{model}:generateContent?key={API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": "hi"}]}],
            "generationConfig": {"responseModalities": ["TEXT"]}
        }
        try:
            r = requests.post(test_url, json=payload, timeout=10)
            if r.status_code != 404:
                print(f"  Modelo activo: {model} (status {r.status_code})")
                return model
        except:
            continue
    return IMAGE_MODELS[0]  # fallback

def generate_image(model, reference_bytes, exercise_name, pose_description):
    left = pose_description.split('RIGHT:')[0].replace('LEFT:', '').strip()
    right = pose_description.split('RIGHT:')[1].strip()

    prompt = f"""Using this exact character as visual reference — same flat cartoon art style, same purple color palette (#7C3AED), same faceless athletic male design — create a fitness exercise card on PURE BLACK background.

Exercise name: {exercise_name}

Layout: TWO FRAMES side by side separated by a bold ORANGE arrow (→) pointing right.
- LEFT FRAME: {left}
  White bold label "INICIO" centered below the frame.
- RIGHT FRAME: {right}
  White bold label "EJECUCIÓN" centered below the frame.

Style rules:
- Flat cartoon, NO facial features, NO eyes/mouth/nose
- Purple v-neck shirt, dark purple shorts, purple sneakers, lavender/light purple skin
- Clean black background (#000000)
- Wide landscape aspect ratio (2:1)
- Simple clean lines, bold colors"""

    url = f"{BASE_URL}/models/{model}:generateContent?key={API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/png",
                            "data": base64.b64encode(reference_bytes).decode()
                        }
                    },
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"]
        }
    }

    response = requests.post(url, json=payload, timeout=90)
    if response.status_code != 200:
        print(f"    HTTP {response.status_code}: {response.text[:200]}")
        return None

    data = response.json()
    for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    return None

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    model = find_working_model()
    print(f"\nUsando modelo: {model}\n")

    if not os.path.exists(REFERENCE_IMAGE):
        print(f"ERROR: No se encuentra la imagen de referencia en:\n  {REFERENCE_IMAGE}")
        print("Asegúrate de que public/exercises/squat.png existe.")
        return

    with open(REFERENCE_IMAGE, 'rb') as f:
        reference_bytes = f.read()
    print(f"Referencia cargada: {REFERENCE_IMAGE}\n")

    total = len([e for e in EXERCISES if e[0] not in ALREADY_DONE])
    done = 0
    failed = []

    for exercise_id, exercise_name, pose_description in EXERCISES:
        if exercise_id in ALREADY_DONE:
            print(f"  ✓ {exercise_name} — ya existe, saltando")
            continue

        output_path = os.path.join(OUTPUT_DIR, f"{exercise_id}.png")
        if os.path.exists(output_path):
            print(f"  ✓ {exercise_name} — archivo ya existe, saltando")
            done += 1
            continue

        print(f"Generando [{done+1}/{total}]: {exercise_name}...", end="", flush=True)
        img_data = generate_image(model, reference_bytes, exercise_name, pose_description)

        if img_data:
            with open(output_path, 'wb') as f:
                f.write(img_data)
            done += 1
            print(f" ✓ ({len(img_data)//1024}KB)")
        else:
            failed.append(exercise_name)
            print(f" ✗ Falló")

        time.sleep(1)  # evitar rate limiting

    print(f"\n--- Completado: {done}/{total} ---")
    if failed:
        print(f"Fallidos ({len(failed)}):")
        for name in failed:
            print(f"  - {name}")
    print(f"\nImágenes en: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
