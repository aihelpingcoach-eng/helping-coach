import { EXERCISES, TrainingCategory } from '../src/constants/training.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = 'AIzaSyBQeneORiUyGe455vvWis-WKYCNDFCI0SI';
const MODEL = 'imagen-4.0-fast-generate-001';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'exercises');

async function generateImage(prompt: string): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;
  const body = JSON.stringify({
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '4:3',
    },
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json() as {
    predictions: Array<{ bytesBase64Encoded: string; mimeType: string }>;
  };

  const b64 = data.predictions[0].bytesBase64Encoded;
  return Buffer.from(b64, 'base64');
}

function buildPrompt(exerciseName: string, description: string, category: string): string {
  const categoryContext: Record<string, string> = {
    fuerza: 'ejercicio de fuerza y musculación para futbolistas',
    tactico: 'ejercicio táctico de fútbol con jugadores en campo',
    resistencia: 'entrenamiento de resistencia cardiovascular para fútbol',
    pliometria: 'ejercicio pliométrico explosivo con saltos para atleta de fútbol',
    prevencion: 'ejercicio de prevención de lesiones y fisioterapia deportiva',
  };

  return (
    `Professional sports training infographic: "${exerciseName}". ` +
    `Context: ${categoryContext[category] ?? 'football training'}. ` +
    `${description} ` +
    `Style: clean sports coaching diagram, dark background with orange and purple gradient accents, ` +
    `athlete silhouette demonstrating correct form, arrows showing movement direction, ` +
    `muscles highlighted. No text overlay. High quality illustration.`
  );
}

async function processChunk(
  tasks: Array<{ category: string; index: number; name: string; description: string }>,
  total: number,
  completed: { count: number }
) {
  await Promise.all(
    tasks.map(async ({ category, index, name, description }) => {
      const outPath = path.join(OUTPUT_DIR, category, `${index}.jpg`);

      // Skip if already generated
      if (fs.existsSync(outPath)) {
        completed.count++;
        console.log(`[${completed.count}/${total}] ✓ (skip) ${name}`);
        return;
      }

      try {
        const prompt = buildPrompt(name, description, category);
        const imageBuffer = await generateImage(prompt);
        fs.writeFileSync(outPath, imageBuffer);
        completed.count++;
        console.log(`[${completed.count}/${total}] ✓ ${name}`);
      } catch (err) {
        completed.count++;
        console.error(`[${completed.count}/${total}] ✗ ${name}: ${(err as Error).message}`);
      }
    })
  );
}

async function main() {
  console.log('🎨 Generando imágenes de ejercicios con Gemini Imagen 4...\n');

  const categories = Object.keys(EXERCISES) as TrainingCategory[];
  const allTasks: Array<{ category: string; index: number; name: string; description: string }> = [];

  for (const category of categories) {
    const exercises = EXERCISES[category];
    for (let i = 0; i < exercises.length; i++) {
      allTasks.push({
        category,
        index: i,
        name: exercises[i].name,
        description: exercises[i].description,
      });
    }
  }

  const BATCH_SIZE = 3;
  const completed = { count: 0 };
  const total = allTasks.length;

  console.log(`Total: ${total} imágenes a generar en lotes de ${BATCH_SIZE}\n`);

  for (let i = 0; i < allTasks.length; i += BATCH_SIZE) {
    const chunk = allTasks.slice(i, i + BATCH_SIZE);
    await processChunk(chunk, total, completed);
    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < allTasks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n✅ Generación completada.');
}

main().catch(console.error);
