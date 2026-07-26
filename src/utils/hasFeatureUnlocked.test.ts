import { describe, it, expect } from 'vitest';
import { hasFeatureUnlocked } from './progression';

describe('hasFeatureUnlocked', () => {
  it('devuelve true si la feature está explícitamente en la lista', () => {
    expect(hasFeatureUnlocked(['synergy_analysis', 'ai_detailed_reports'], 'synergy_analysis')).toBe(true);
  });

  it('devuelve false si la feature no está en la lista', () => {
    expect(hasFeatureUnlocked(['basic_formations'], 'synergy_analysis')).toBe(false);
  });

  it('devuelve true para cualquier feature cuando "all_features" está desbloqueado (rango Legendario)', () => {
    expect(hasFeatureUnlocked(['all_features'], 'lo_que_sea')).toBe(true);
  });

  it('devuelve false con lista vacía', () => {
    expect(hasFeatureUnlocked([], 'synergy_analysis')).toBe(false);
  });
});
