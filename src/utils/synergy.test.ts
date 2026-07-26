import { describe, it, expect } from 'vitest';
import { calculateSynergy, getSynergyColor } from './synergy';
import { PLAYSTYLE_CATEGORIES, Player } from '../constants/playstyles';

function makePlayer(category: string | undefined): Player {
  return {
    id: '1',
    name: 'Test Player',
    playstyle_category: category,
  } as Player;
}

describe('calculateSynergy', () => {
  it('devuelve "poor" si a alguno de los dos jugadores le falta la categoría de playstyle', () => {
    const withCategory = makePlayer(PLAYSTYLE_CATEGORIES.FINISHING);
    const withoutCategory = makePlayer(undefined);
    expect(calculateSynergy(withCategory, withoutCategory)).toBe('poor');
    expect(calculateSynergy(withoutCategory, withCategory)).toBe('poor');
  });

  it('devuelve "excellent" cuando ambos jugadores comparten la misma categoría', () => {
    const a = makePlayer(PLAYSTYLE_CATEGORIES.DEFENSE);
    const b = makePlayer(PLAYSTYLE_CATEGORIES.DEFENSE);
    expect(calculateSynergy(a, b)).toBe('excellent');
  });

  it('es simétrica: el orden de los jugadores no cambia el resultado', () => {
    const a = makePlayer(PLAYSTYLE_CATEGORIES.FINISHING);
    const b = makePlayer(PLAYSTYLE_CATEGORIES.PASSING);
    expect(calculateSynergy(a, b)).toBe(calculateSynergy(b, a));
  });

  it('Finalización + Pase da una sinergia excelente (combo conocido)', () => {
    const finisher = makePlayer(PLAYSTYLE_CATEGORIES.FINISHING);
    const passer = makePlayer(PLAYSTYLE_CATEGORIES.PASSING);
    expect(calculateSynergy(finisher, passer)).toBe('excellent');
  });
});

describe('getSynergyColor', () => {
  it('asigna un color hexadecimal distinto a cada nivel', () => {
    const levels = ['poor', 'medium', 'good', 'excellent'] as const;
    const colors = levels.map(getSynergyColor);
    expect(new Set(colors).size).toBe(levels.length);
    colors.forEach(color => expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/));
  });
});
