import { createInitialState } from './engine';
import type { GameState } from './types';

const KEY = 'dongha-save';
export const hasSaveData = () => Boolean(localStorage.getItem(KEY));
export function saveGame(state: GameState) { localStorage.setItem(KEY, JSON.stringify(state)); }

const asArray = <T>(v: unknown, fallback: T[] = []) => (Array.isArray(v) ? (v as T[]) : fallback);
const asNumber = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

function migrateState(rawState: Partial<GameState>): GameState {
  const base = createInitialState();
  const next: GameState = {
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
    memories: asArray(rawState.memories), relationships: rawState.relationships ?? base.relationships,
    relationshipEventFlags: rawState.relationshipEventFlags ?? {}, seasonEventHistory: asArray(rawState.seasonEventHistory),
    weeklyActivityHistory: asArray(rawState.weeklyActivityHistory), weeklyReflections: asArray(rawState.weeklyReflections),
    logs: asArray(rawState.logs), growthHistory: asArray(rawState.growthHistory), eventHistory: asArray(rawState.eventHistory),
    discoveredCombos: asArray(rawState.discoveredCombos), recentActionTags: asArray(rawState.recentActionTags), recentActions: asArray(rawState.recentActions),
    milestoneHistory: asArray(rawState.milestoneHistory), pendingMilestones: asArray((rawState as any).pendingMilestones), seenMilestoneIds: asArray((rawState as any).seenMilestoneIds),
    monthlyReports: asArray(rawState.monthlyReports), pendingMonthlyReport: rawState.pendingMonthlyReport ?? null, pendingEvent: (rawState as any).pendingEvent ?? null,
    saveVersion: 2,
    currentWeek: asNumber(rawState.currentWeek, base.currentWeek), currentMonth: asNumber(rawState.currentMonth, base.currentMonth),
    ageInMonths: asNumber(rawState.ageInMonths, base.ageInMonths), actionsLeft: asNumber(rawState.actionsLeft, base.actionsLeft),
    actionsPerWeek: asNumber(rawState.actionsPerWeek, base.actionsPerWeek), stress: asNumber(rawState.stress, base.stress), fatigue: asNumber(rawState.fatigue, base.fatigue),
    lastMonthlyReportWeek: asNumber(rawState.lastMonthlyReportWeek, base.lastMonthlyReportWeek),
  };
  return next;
}

export function loadGame(): GameState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return createInitialState();
  try { return migrateState(JSON.parse(raw) as Partial<GameState>); } catch { return createInitialState(); }
}
export function createAndSaveInitialGame() { const initial = createInitialState(); saveGame(initial); return initial; }
