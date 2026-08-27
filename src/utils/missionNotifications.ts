export interface MissionCompletionRecord {
  id: string;
  title: string;
  reward_xp: number;
  completedAt: string;
}

const STORAGE_KEY = 'helpingcoach_recent_mission_completions';
const MAX_RECORDS = 20;

// Evento same-tab para que el panel de notificaciones (montado en App.tsx)
// se entere al instante de una misión completada en otro componente
// (AdvancedMode), sin tener que pasar callbacks por todo el árbol.
export const MISSION_COMPLETED_EVENT = 'helpingcoach:mission-completed';

function readAll(): MissionCompletionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordMissionCompletion(title: string, reward_xp: number): MissionCompletionRecord {
  const record: MissionCompletionRecord = {
    id: `${title}-${Date.now()}`,
    title,
    reward_xp,
    completedAt: new Date().toISOString(),
  };
  const updated = [record, ...readAll()].slice(0, MAX_RECORDS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(MISSION_COMPLETED_EVENT, { detail: record }));
  return record;
}

export function getRecentMissionCompletions(withinHours = 48): MissionCompletionRecord[] {
  const cutoff = Date.now() - withinHours * 60 * 60 * 1000;
  return readAll().filter(r => new Date(r.completedAt).getTime() >= cutoff);
}
