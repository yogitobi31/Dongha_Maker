import type { GameState, ScheduleId, StatName, Stats } from './types';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export const schedules: Record<
  ScheduleId,
  {
    name: string;
    effects: Partial<Record<StatName | 'money', number>>;
    description: string;
  }
> = {
  study: { name: '공부하기', effects: { 지능: 5, 스트레스: 4, 체력: -2 }, description: '지능 +5 / 스트레스 +4 / 체력 -2' },
  coding: { name: '코딩 연습', effects: { 코딩력: 6, 창의력: 3, 스트레스: 5, 체력: -3 }, description: '코딩력 +6 / 창의력 +3 / 스트레스 +5 / 체력 -3' },
  workout: { name: '운동하기', effects: { 운동: 5, 체력: 3, 스트레스: 2 }, description: '운동 +5 / 체력 +3 / 스트레스 +2' },
  draw: { name: '그림/상상 노트 쓰기', effects: { 창의력: 5, 감성: 3, 스트레스: -1 }, description: '창의력 +5 / 감성 +3 / 스트레스 -1' },
  date: { name: '희선과 데이트', effects: { 행복도: 8, 매력: 2, 스트레스: -5, money: -8000 }, description: '행복도 +8 / 매력 +2 / 스트레스 -5 / 돈 -8000' },
  jjajang: { name: '짜장면 먹기', effects: { 행복도: 4, 체력: 2, money: -7000 }, description: '행복도 +4 / 체력 +2 / 돈 -7000' },
  sweetBread: { name: '단팥빵 먹기', effects: { 행복도: 3, 스트레스: -2, money: -2500 }, description: '행복도 +3 / 스트레스 -2 / 돈 -2500' },
};

export function createInitialState(): GameState {
  return {
    player: { name: '동하', age: 17, month: 3, week: 1, money: 50000 },
    stats: { 체력: 50, 스트레스: 10, 지능: 60, 감성: 55, 매력: 45, 운동: 40, 도덕성: 50, 창의력: 70, 코딩력: 35, 행복도: 60 },
    flags: { heesunDating: true, afraidOfBugs: true, likesRedPepperJjajang: true, likesSweetRedBeanBread: true },
    logs: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getDateLabel(state: GameState) {
  return `${state.player.age}세 / ${state.player.month}월 ${state.player.week}주차`;
}

function statusSummary(stats: Stats) {
  if (stats.스트레스 >= 70) return '조금 지쳐 보입니다. 이번 주는 무리를 줄이는 편이 좋아요.';
  if (stats.행복도 >= 80) return '표정이 한결 밝습니다. 좋은 흐름이 이어지고 있어요.';
  if (stats.코딩력 >= 50) return '아이디어를 구현해보고 싶은 의지가 강해졌습니다.';
  return '오늘도 차분하게 하루를 준비하고 있습니다.';
}

export function runWeek(state: GameState, scheduleId: ScheduleId) {
  const selected = schedules[scheduleId];
  const next: GameState = structuredClone(state);
  const lines: string[] = [];

  Object.entries(selected.effects).forEach(([key, delta]) => {
    if (!delta) return;
    if (key === 'money') {
      next.player.money += delta;
      lines.push(`돈 ${delta > 0 ? '+' : ''}${delta}`);
      return;
    }
    const statKey = key as StatName;
    next.stats[statKey] = clamp(next.stats[statKey] + delta);
    lines.push(`${statKey} ${delta > 0 ? '+' : ''}${delta}`);
  });

  if (scheduleId === 'jjajang') {
    lines.push('동하는 오늘도 고춧가루를 믿을 수 없을 만큼 뿌렸다.');
  }

  if (next.stats.코딩력 >= 50) {
    lines.push('동하는 자신만의 작은 게임 아이디어를 노트에 적기 시작했다.');
  }
  if (next.stats.스트레스 >= 70) {
    lines.push('동하는 잠시 쉬고 싶어 한다. 무리한 일정은 위험할 수 있다.');
  }
  if (next.stats.행복도 >= 80 && next.flags.heesunDating) {
    lines.push('희선의 응원 덕분에 동하는 오늘도 기분 좋게 하루를 보냈다.');
  }

  if (next.flags.afraidOfBugs && Math.random() < 0.13) {
    next.stats.스트레스 = clamp(next.stats.스트레스 + 8);
    next.stats.체력 = clamp(next.stats.체력 - 2);
    lines.push('갑자기 벌레가 나타났다. 동하는 거의 공중부양하듯 놀랐다.');
    lines.push('추가 효과: 스트레스 +8, 체력 -2');
  }

  const weekLabel = getDateLabel(next);
  next.logs = [{ weekLabel, scheduleName: selected.name, lines }, ...next.logs].slice(0, 24);

  if (next.player.week >= 4) {
    next.player.week = 1;
    next.player.month += 1;
  } else {
    next.player.week += 1;
  }

  next.updatedAt = new Date().toISOString();

  return { state: next, summary: statusSummary(next.stats), resultLines: lines, scheduleName: selected.name };
}

export const SAVE_VERSION = 1;
export const validateState = (_s: GameState) => true;
export function applyActivity(s: GameState, id: string) {
  const map: Record<string, ScheduleId> = {
    math: 'study', english: 'study', exam: 'study',
    coding: 'coding', walk: 'workout', gym: 'workout',
    date: 'date', jjajang: 'jjajang', anpan: 'sweetBread',
  };
  const picked = map[id] ?? 'study';
  const r = runWeek(s, picked);
  return { state: r.state, activity: { name: schedules[picked].name, resultTexts: [r.resultLines.join(' / ')] }, event: null };
}
