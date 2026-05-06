import type { GameState, ScheduleId, StatName, Stats } from './types';

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const SEASONS = ['봄', '여름', '가을', '겨울'] as const;

export const schedules: Record<
  ScheduleId,
  {
    name: string;
    effects: Partial<Record<StatName, number>>;
    fatigue: number;
    stress: number;
    description: string;
  }
> = {
  speech: { name: '말 배우기', effects: { 지능: 3, 사회성: 1, 집중력: 1 }, fatigue: 1, stress: 0, description: '지능 +3 / 사회성 +1 / 집중력 +1 / 피로 +1' },
  storybook: { name: '그림책 보기', effects: { 지능: 1, 감수성: 3, 호기심: 2 }, fatigue: 1, stress: -1, description: '감수성 +3 / 호기심 +2 / 스트레스 -1 / 피로 +1' },
  blocks: { name: '블록 쌓기', effects: { 창의력: 3, 집중력: 2 }, fatigue: 1, stress: 0, description: '창의력 +3 / 집중력 +2 / 피로 +1' },
  walk: { name: '산책하기', effects: { 체력: 2, 감수성: 1, 호기심: 1 }, fatigue: 1, stress: -2, description: '체력 +2 / 스트레스 -2 / 피로 +1' },
  nap: { name: '낮잠 자기', effects: { 체력: 2, 자존감: 1 }, fatigue: -3, stress: -2, description: '체력 +2 / 자존감 +1 / 피로 -3 / 스트레스 -2' },
  toy: { name: '장난감 가지고 놀기', effects: { 창의력: 2, 호기심: 2, 자존감: 1 }, fatigue: 1, stress: -1, description: '창의력 +2 / 호기심 +2 / 자존감 +1 / 피로 +1' },
  family: { name: '엄마 아빠와 시간 보내기', effects: { 사회성: 2, 감수성: 2, 자존감: 2 }, fatigue: 0, stress: -2, description: '사회성 +2 / 감수성 +2 / 자존감 +2 / 스트레스 -2' },
  daydream: { name: '멍하니 상상하기', effects: { 창의력: 3, 감수성: 2 }, fatigue: -1, stress: -1, description: '창의력 +3 / 감수성 +2 / 피로 -1 / 스트레스 -1' },
};

export function createInitialState(): GameState {
  return {
    player: { name: '동하', age: 1, season: 0, week: 1, money: 0 },
    stats: { 체력: 30, 지능: 20, 창의력: 20, 감수성: 25, 사회성: 20, 호기심: 30, 집중력: 15, 자존감: 25 },
    fatigue: 0,
    stress: 0,
    actionsLeft: 3,
    actionsPerWeek: 3,
    flags: { introSeen: false },
    logs: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getDateLabel(state: GameState) {
  return `동하 ${state.player.age}살 · ${SEASONS[state.player.season]} · ${state.player.week}주차`;
}

function statusSummary(stats: Stats) {
  if (stats.자존감 >= 70) return '동하는 작은 성공에도 자신 있게 웃습니다.';
  if (stats.호기심 >= 70) return '동하는 세상의 모든 것에 질문을 던집니다.';
  return '동하는 아직 말을 잘하지 못하지만, 눈빛은 반짝입니다.';
}

export function runWeek(state: GameState, scheduleId: ScheduleId) {
  if (state.actionsLeft <= 0) {
    return { state, summary: '이번 주 행동을 모두 사용했습니다.', resultLines: ['이번 주를 마무리해 주세요.'], scheduleName: '행동 불가' };
  }

  const selected = schedules[scheduleId];
  const next: GameState = structuredClone(state);
  const lines: string[] = [];

  Object.entries(selected.effects).forEach(([key, delta]) => {
    if (!delta) return;
    const statKey = key as StatName;
    next.stats[statKey] = clamp(next.stats[statKey] + delta);
    lines.push(`${statKey} ${delta > 0 ? '+' : ''}${delta}`);
  });

  next.fatigue = clamp(next.fatigue + selected.fatigue);
  next.stress = clamp(next.stress + selected.stress);
  next.actionsLeft -= 1;

  lines.push(`피로도 ${selected.fatigue >= 0 ? '+' : ''}${selected.fatigue}`);
  lines.push(`스트레스 ${selected.stress >= 0 ? '+' : ''}${selected.stress}`);

  const weekLabel = getDateLabel(next);
  next.logs = [{ weekLabel, scheduleName: selected.name, lines }, ...next.logs].slice(0, 24);
  next.updatedAt = new Date().toISOString();

  return { state: next, summary: statusSummary(next.stats), resultLines: lines, scheduleName: selected.name };
}

export function advanceWeek(state: GameState) {
  const next: GameState = structuredClone(state);
  if (next.player.week >= 4) {
    next.player.week = 1;
    if (next.player.season >= 3) {
      next.player.season = 0;
      next.player.age += 1;
    } else {
      next.player.season += 1;
    }
  } else {
    next.player.week += 1;
  }
  next.actionsLeft = next.actionsPerWeek;
  next.fatigue = Math.max(0, next.fatigue - 2);
  next.stress = Math.max(0, next.stress - 1);
  next.updatedAt = new Date().toISOString();
  return next;
}

export const SAVE_VERSION = 1;
export const validateState = (_s: GameState) => true;
