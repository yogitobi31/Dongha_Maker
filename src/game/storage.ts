import { createInitialState } from './engine';
import type { GameState } from './types';
const KEY = 'dongha-save';
export const hasSaveData = () => Boolean(localStorage.getItem(KEY));
export function saveGame(state: GameState) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function loadGame(): GameState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return createInitialState();
  try { return JSON.parse(raw) as GameState; } catch { return createInitialState(); }
}
export function createAndSaveInitialGame() { const initial = createInitialState(); saveGame(initial); return initial; }
