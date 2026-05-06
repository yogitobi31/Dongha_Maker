import { createInitialState } from './engine';
import type { GameState } from './types';

const KEY = 'dongha-save';
export const hasSaveData = () => Boolean(localStorage.getItem(KEY));
export function saveGame(state: GameState) { localStorage.setItem(KEY, JSON.stringify(state)); }

function migrateState(rawState: Partial<GameState>): GameState {
  const base = createInitialState();
  return {
    ...base,
    ...rawState,
    player: { ...base.player, ...(rawState.player ?? {}) },
    stats: { ...base.stats, ...(rawState.stats ?? {}) },
    flags: { ...base.flags, ...(rawState.flags ?? {}) },
    growthProfile: {
      ...base.growthProfile,
      ...(rawState.growthProfile ?? {}),
      hiddenTraits: { ...base.growthProfile.hiddenTraits, ...(rawState.growthProfile?.hiddenTraits ?? {}) },
      eventFlags: { ...base.growthProfile.eventFlags, ...(rawState.growthProfile?.eventFlags ?? {}) },
      relationshipScores: { ...base.growthProfile.relationshipScores, ...(rawState.growthProfile?.relationshipScores ?? {}) },
      endingSeeds: { ...base.growthProfile.endingSeeds, ...(rawState.growthProfile?.endingSeeds ?? {}) },
    },
    memories: rawState.memories ?? [],
    relationships: rawState.relationships ?? base.relationships,
    relationshipEventFlags: rawState.relationshipEventFlags ?? {},
    seasonEventHistory: rawState.seasonEventHistory ?? [],
    weeklyActivityHistory: rawState.weeklyActivityHistory ?? [],
    weeklyReflections: rawState.weeklyReflections ?? [],
    logs: rawState.logs ?? [],
  };
}

export function loadGame(): GameState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return createInitialState();
  try { return migrateState(JSON.parse(raw) as Partial<GameState>); } catch { return createInitialState(); }
}
export function createAndSaveInitialGame() { const initial = createInitialState(); saveGame(initial); return initial; }
