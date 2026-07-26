import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('isAdmin', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_ADMIN_EMAIL', 'ai.helpingcoach@gmail.com');
  });

  it('devuelve true cuando el email coincide exactamente', async () => {
    const { isAdmin } = await import('./isAdmin');
    expect(isAdmin('ai.helpingcoach@gmail.com')).toBe(true);
  });

  it('ignora mayúsculas/minúsculas', async () => {
    const { isAdmin } = await import('./isAdmin');
    expect(isAdmin('AI.HelpingCoach@Gmail.com')).toBe(true);
  });

  it('devuelve false para cualquier otro email', async () => {
    const { isAdmin } = await import('./isAdmin');
    expect(isAdmin('otro@usuario.com')).toBe(false);
  });

  it('devuelve false para email vacío o nulo', async () => {
    const { isAdmin } = await import('./isAdmin');
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(isAdmin('')).toBe(false);
  });
});
