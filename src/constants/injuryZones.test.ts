import { describe, it, expect } from 'vitest';
import { INJURY_ZONES, ZONE_BY_MUSCLE, BodyView } from './injuryZones';
import { BODY_BACK, BODY_FRONT } from './bodyMapPaths';

const views: BodyView[] = ['front', 'back'];
const partsOf = (view: BodyView) => (view === 'front' ? BODY_FRONT : BODY_BACK);

describe('injuryZones', () => {
  it('cada músculo asignado existe en el dibujo de su vista', () => {
    for (const view of views) {
      const slugs = new Set(partsOf(view).map(p => p.slug));
      for (const muscle of Object.keys(ZONE_BY_MUSCLE[view])) {
        expect(slugs.has(muscle), `${view}: ${muscle}`).toBe(true);
      }
    }
  });

  it('cada músculo apunta a una zona definida', () => {
    const ids = new Set(INJURY_ZONES.map(z => z.id));
    for (const view of views) {
      for (const zone of Object.values(ZONE_BY_MUSCLE[view])) {
        expect(ids.has(zone!)).toBe(true);
      }
    }
  });

  it('todas las zonas se pueden tocar en alguna vista', () => {
    const reachable = new Set(views.flatMap(v => Object.values(ZONE_BY_MUSCLE[v])));
    for (const zone of INJURY_ZONES) {
      expect(reachable.has(zone.id), zone.id).toBe(true);
    }
  });

  it('ninguna zona está vacía ni repite lesiones', () => {
    for (const zone of INJURY_ZONES) {
      expect(zone.injurySlugs.length).toBeGreaterThan(0);
      expect(new Set(zone.injurySlugs).size).toBe(zone.injurySlugs.length);
    }
  });
});
