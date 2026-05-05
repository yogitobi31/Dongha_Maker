export const STAT_KEYS = [
  'study', 'stamina', 'mental', 'humor', 'gaming', 'emotion', 'social', 'focus', 'romance', 'esteem',
] as const;

export const HIDDEN_KEYS = ['heeseon', 'juwon', 'reputation', 'fatigue', 'darkness', 'anpan'] as const;

export type StatKey = (typeof STAT_KEYS)[number];
export type HiddenKey = (typeof HIDDEN_KEYS)[number];

export const ACTIVITIES = [
  { id: 'english', name: '영어 공부', effects: { study: 8, focus: 6, fatigue: 5, juwon: 2 } },
  { id: 'gaming', name: '게임하기', effects: { gaming: 9, humor: 2, fatigue: 4, darkness: 1 } },
  { id: 'heeseon', name: '희선이 만나기', effects: { romance: 7, social: 4, heeseon: 6, fatigue: 2 } },
  { id: 'exercise', name: '운동하기', effects: { stamina: 9, mental: 4, fatigue: 3, esteem: 2 } },
  { id: 'anpan', name: '단팥빵 먹기', effects: { emotion: 5, anpan: 7, fatigue: -2, darkness: -1 } },
  { id: 'friends', name: '친구들과 놀기', effects: { social: 8, humor: 5, reputation: 6, fatigue: 3 } },
  { id: 'coding', name: '코딩/언리얼 하기', effects: { focus: 7, gaming: 4, study: 5, fatigue: 6 } },
  { id: 'rest', name: '쉬기', effects: { fatigue: -8, mental: 5, emotion: 4, darkness: -2 } },
] as const;

export const CHARACTERS = ['동하', '희선', '주원쌤', '경민', '현준', '찬영', '효원', '소은'] as const;

export const ENDINGS = [
  { id: 'proud_bf', name: '희선이의 자랑스러운 남자친구 엔딩', when: (s: any) => s.stats.romance >= 70 && s.hidden.heeseon >= 75 },
  { id: 'game_genius', name: '게임 천재 동하 엔딩', when: (s: any) => s.stats.gaming >= 85 },
  { id: 'unreal_dev', name: '언리얼 개발자 동하 엔딩', when: (s: any) => s.stats.focus >= 75 && s.stats.study >= 70 },
  { id: 'anpan_master', name: '단팥빵 장인 엔딩', when: (s: any) => s.hidden.anpan >= 80 },
  { id: 'popular', name: '인기남 동하 엔딩', when: (s: any) => s.stats.social >= 75 && s.hidden.reputation >= 70 },
  { id: 'study_awaken', name: '공부 각성 동하 엔딩', when: (s: any) => s.stats.study >= 90 },
  { id: 'stamina_king', name: '체력왕 동하 엔딩', when: (s: any) => s.stats.stamina >= 90 },
  { id: 'philosophy', name: '철학에 빠진 동하 엔딩', when: (s: any) => s.stats.emotion >= 75 && s.stats.mental >= 75 },
  { id: 'juwon_star', name: '주원쌤의 애제자 엔딩', when: (s: any) => s.hidden.juwon >= 80 && s.stats.study >= 70 },
  { id: 'happy_idle', name: '아무것도 안 하고 행복한 동하 엔딩', when: (_: any) => true },
] as const;
