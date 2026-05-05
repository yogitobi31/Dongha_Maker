import type { HiddenKey, StatKey } from '../data/gameData';

export type GameState = {
  saveVersion: number;
  month: number;
  slot: number;
  stats: Record<StatKey, number>;
  hidden: Record<HiddenKey, number>;
  schedule: string[];
  logs: string[];
  ended: boolean;
  endingId?: string;
  endingsUnlocked: string[];
};
