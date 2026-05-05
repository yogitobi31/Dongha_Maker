import { describe, expect, it } from 'vitest';
import { applyActivity, createInitialState, validateState } from './engine';

describe('game loop', () => {
  it('ends after 12 months', () => {
    let s = createInitialState();
    for (let i = 0; i < 36; i++) s = applyActivity(s, 'english').state;
    expect(s.ended).toBe(true);
    expect(s.endingId).toBeTruthy();
  });

  it('keeps ranges clamped', () => {
    let s = createInitialState();
    for (let i = 0; i < 60; i++) s = applyActivity(s, 'anpan').state;
    expect(validateState(s)).toBe(true);
  });
});
