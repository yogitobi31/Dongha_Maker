import type { EmotionState, MemoryFragment, SeasonLabel } from './types';

export const emotionLabelMap: Record<EmotionState, string> = {
  calm: '편안함',
  happy: '기쁨',
  curious: '궁금함',
  dreaming: '몽상 중',
  tired: '피곤함',
  stressed: '불편함',
  sick: '아픔'
};

export const emotionNarrativeMap: Record<EmotionState, string> = {
  calm: '동하는 조용히 앉아 있지만, 머릿속은 꽤 바쁜 것 같다.',
  happy: '동하는 이름을 불러주면 금방 표정이 밝아진다.',
  curious: '동하는 작은 소리에도 고개를 돌린다.',
  dreaming: '동하는 아무것도 없는 곳을 보며 혼자 웃었다.',
  tired: '동하는 조금 멍한 얼굴로 앉아 있다.',
  stressed: '동하는 괜히 장난감을 만지작거리고 있다.',
  sick: '동하는 평소보다 기운이 없어 보인다.'
};

export const seasonVisualMeta: Record<SeasonLabel, { line: string; className: string; imagePath: string }> = {
  봄: { line: '창밖에는 연한 봄빛이 번지고 있습니다.', className: 'season-spring', imagePath: '/assets/dongha/seasons/spring-bg.png' },
  여름: { line: '긴 오후의 햇빛이 방 안에 머물고 있습니다.', className: 'season-summer', imagePath: '/assets/dongha/seasons/summer-bg.png' },
  가을: { line: '창밖 어딘가에서 낙엽이 조용히 떨어집니다.', className: 'season-autumn', imagePath: '/assets/dongha/seasons/autumn-bg.png' },
  겨울: { line: '차가운 바깥과 달리 방 안은 포근합니다.', className: 'season-winter', imagePath: '/assets/dongha/seasons/winter-bg.png' }
};

export const eventIllustrationKeys = ['rainy_window', 'tiny_ant', 'strange_dog', 'creative_block_tower', 'first_why', 'long_nap', 'heeseon_seed'] as const;
export type EventIllustrationKey = (typeof eventIllustrationKeys)[number];

export const getAgePortraitBucket = (age: number) => {
  if (age <= 3) return 'age-01-03';
  if (age <= 6) return 'age-04-06';
  if (age <= 9) return 'age-07-09';
  if (age <= 13) return 'age-10-13';
  if (age <= 16) return 'age-14-16';
  return 'age-17-20';
};

export const getDonghaPortraitPath = (age: number, emotionState: EmotionState) => {
  const ageFolder = age <= 3 ? 'age-01' : getAgePortraitBucket(age);
  return `/assets/dongha/portraits/${ageFolder}/${emotionState}.png`;
};

export const getMemoryVisualClass = (memory: MemoryFragment) => {
  const tags = memory.tags;
  if (tags.some((tag) => ['rain', 'spring'].includes(tag))) return 'memory-rain';
  if (tags.some((tag) => ['bug', 'nature', 'firstBugEncounter'].includes(tag))) return 'memory-ant';
  if (tags.some((tag) => ['blocks', 'creator'].includes(tag))) return 'memory-block';
  if (tags.some((tag) => ['family', 'comfort', 'warm'].includes(tag))) return 'memory-family';
  if (tags.some((tag) => ['heeseonSeed'].includes(tag))) return 'memory-heeseon';
  return 'memory-default';
};
