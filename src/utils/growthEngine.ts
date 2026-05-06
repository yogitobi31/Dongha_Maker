import { ACTION_CARDS } from '../data/actionCards';
import { EVENT_CARDS } from '../data/eventCards';
import { GROWTH_COMBOS } from '../data/growthCombos';
import { GROWTH_DIRECTIONS } from '../data/growthDirections';
import { MILESTONES } from '../data/milestones';
import type { GameState } from '../game/types';

export const MINI_PILUP_MEMBERS = ['경민', '현준', '찬영', '효원', '동하', '희선', '소은', '주원쌤'] as const;
const miniPilupSet = new Set<string>(MINI_PILUP_MEMBERS);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function validatePilupCharacters(names: string[], source: string) {
  const invalid = names.filter((name) => !miniPilupSet.has(name));
  if (import.meta.env.DEV && invalid.length > 0) {
    invalid.forEach((name) => console.warn('[WorldRule] 필업이들 이벤트에 허용되지 않은 인물이 포함됨:', name, source));
  }
  return names.filter((name) => miniPilupSet.has(name));
}

export function pickWeeklyCards(directionId?: string) {
  const direction = GROWTH_DIRECTIONS.find((d) => d.id === directionId);
  const weighted = ACTION_CARDS.flatMap((c) => (direction && c.tags.some((t) => direction.boostedTags.includes(t)) ? [c, c, c] : [c]));
  const result = [] as typeof ACTION_CARDS;
  for (let i = 0; i < 40 && result.length < 3; i += 1) {
    const c = pick(weighted);
    if (!result.find((v) => v.id === c.id)) result.push(c);
  }
  return result.length >= 3 ? result : ACTION_CARDS.slice(0, 3);
}

export function maybeEvent(directionId?: string) {
  const direction = GROWTH_DIRECTIONS.find((d) => d.id === directionId);
  let p = 0.4;
  if (direction?.id === 'freeSoul') p += 0.05;
  if (Math.random() > p) return null;
  const weighted = EVENT_CARDS.flatMap((e) => (direction && e.tags.some((t) => direction.eventBias.includes(t)) ? [e, e] : [e]));
  return pick(weighted);
}

export const detectCombos = (tags: string[]) =>
  GROWTH_COMBOS.filter((combo) => {
    const pool = [...tags];
    return combo.requiredTags.every((t) => {
      const i = pool.indexOf(t);
      if (i === -1) return false;
      pool.splice(i, 1);
      return true;
    });
  });

export function getMainCta(state: GameState) {
  if (!state.flags.introSeen) return { id: 'start', label: '동하 키우기 시작하기' };
  if ((state.pendingMilestones?.length ?? 0) > 0) return { id: 'milestone', label: '특별한 성장 순간 보기' };
  if (state.pendingMonthlyReport) return { id: 'monthly-report', label: '이번 달 성장 돌아보기' };
  if (!state.selectedGrowthDirection) return { id: 'direction', label: '이번 달 어떻게 키울지 정하기' };
  if (state.actionsLeft === state.actionsPerWeek) return { id: 'weekly-action', label: '이번 주 함께할 일 고르기' };
  if (state.pendingEvent) return { id: 'event', label: '뜻밖의 순간 확인하기' };
  return { id: 'next-week', label: '다음 주로 진행하기' };
}

export function checkMilestones(state: GameState) {
  return MILESTONES.filter((m) => m.month <= state.ageInMonths && !state.milestoneHistory.includes(m.title));
}
