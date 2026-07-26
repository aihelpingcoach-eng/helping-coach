import { describe, it, expect } from 'vitest';
import { getRankByXP, RANKS } from './progression';

describe('getRankByXP', () => {
  it('devuelve el primer rango (Aspirante) con 0 XP', () => {
    expect(getRankByXP(0).id).toBe('aspirante');
  });

  it('devuelve el rango más alto alcanzado, no el siguiente', () => {
    // Un XP justo por debajo del umbral de "Entrenador Táctico" (1500)
    // debe seguir devolviendo "Entrenador Base".
    expect(getRankByXP(1499).id).toBe('entrenador_base');
    expect(getRankByXP(1500).id).toBe('entrenador_tactico');
  });

  it('nunca devuelve un rango con más XP requerido del que tiene el jugador', () => {
    for (const xp of [0, 1, 499, 500, 7999, 8000, 999999]) {
      const rank = getRankByXP(xp);
      expect(rank.xpRequired).toBeLessThanOrEqual(xp);
    }
  });

  it('devuelve el rango máximo (Legendario) para XP muy alto', () => {
    expect(getRankByXP(1_000_000).id).toBe('legendario');
  });

  it('los rangos están ordenados de menor a mayor XP requerido', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].xpRequired).toBeGreaterThan(RANKS[i - 1].xpRequired);
    }
  });
});
