import { ACTIVITIES, ENDINGS, HIDDEN_KEYS, STAT_KEYS } from '../data/gameData';
import type { GameState } from './types';

export const SAVE_VERSION = 1;
const MAX = 100;
const MIN = 0;

export const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));

export function createInitialState(): GameState {
  const stats = Object.fromEntries(STAT_KEYS.map((k) => [k, 25])) as GameState['stats'];
  const hidden = Object.fromEntries(HIDDEN_KEYS.map((k) => [k, k === 'fatigue' ? 10 : 0])) as GameState['hidden'];
  return { saveVersion: SAVE_VERSION, month: 1, slot: 1, stats, hidden, schedule: [], logs: ['동하의 12개월 다이어리가 시작되었습니다.'], ended: false, endingsUnlocked: [] };
}

export function applyActivity(state: GameState, activityId: string): GameState {
  const activity = ACTIVITIES.find((a) => a.id === activityId);
  if (!activity || state.ended) return state;
  const next = structuredClone(state);
  next.schedule.push(activity.id);
  for (const [key, value] of Object.entries(activity.effects)) {
    if (key in next.stats) next.stats[key as keyof typeof next.stats] = clamp(next.stats[key as keyof typeof next.stats] + value);
    if (key in next.hidden) next.hidden[key as keyof typeof next.hidden] = clamp(next.hidden[key as keyof typeof next.hidden] + value);
  }
  next.logs = [...next.logs, `${next.month}월-${next.slot}슬롯: ${activity.name}`];
  if (next.slot < 3) {
    next.slot += 1;
  } else {
    next.slot = 1;
    next.month += 1;
  }
  if (next.month > 12) {
    next.ended = true;
    const ending = ENDINGS.find((e) => e.when(next)) ?? ENDINGS[ENDINGS.length - 1];
    next.endingId = ending.id;
    if (!next.endingsUnlocked.includes(ending.id)) next.endingsUnlocked.push(ending.id);
    next.logs.push(`엔딩 도달: ${ending.name}`);
  }
  return next;
}

export const getMonthlyLogs = (state: GameState, month: number) => state.logs.filter((l) => l.startsWith(`${month}월-`));

export const validateState = (state: GameState) => {
  const allNums = [...Object.values(state.stats), ...Object.values(state.hidden)];
  return allNums.every((n) => n >= 0 && n <= 100) && state.saveVersion === SAVE_VERSION;
};
