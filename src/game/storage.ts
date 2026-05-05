import { SAVE_VERSION, createInitialState } from './engine';
import type { GameState } from './types';

const KEY = 'dongha-save';

export function saveGame(state: GameState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadGame(): GameState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return createInitialState();
  try {
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.saveVersion !== SAVE_VERSION) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}
