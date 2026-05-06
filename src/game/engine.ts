import type { EndingSeedName, GameState, HiddenTraitName, MemoryFragment, ScheduleId, SeasonLabel, StatName, Stats } from './types';

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const SEASONS: SeasonLabel[] = ['봄', '여름', '가을', '겨울'];

const traitKeys: HiddenTraitName[] = ['dreamer','explorer','creator','leader','loner','empathetic','obsessive','rebellious','stable','anxious'];
const endingKeys: EndingSeedName[] = ['indieGameCreator','belovedGameDirector','natureDocumentaryMaker','quietNovelist','warmTeacher','lonelyGenius','lateBloomingOrdinaryLife','burnedOutProdigy'];

const mkTraits = () => Object.fromEntries(traitKeys.map((k) => [k, 0])) as Record<HiddenTraitName, number>;
const mkEndings = () => Object.fromEntries(endingKeys.map((k) => [k, 0])) as Record<EndingSeedName, number>;

export const schedules = {
  speech: { name:'말 배우기', effects:{지능:3,사회성:1,집중력:1}, fatigue:1, stress:0, description:'지능 +3 / 사회성 +1 / 집중력 +1 / 피로 +1', hiddenTraitEffects:{leader:1,anxious:0.2} },
  storybook: { name:'그림책 보기', effects:{지능:1,감수성:3,호기심:2}, fatigue:1, stress:-1, description:'감수성 +3 / 호기심 +2 / 스트레스 -1 / 피로 +1', hiddenTraitEffects:{dreamer:1,creator:1,empathetic:1} },
  blocks: { name:'블록 쌓기', effects:{창의력:3,집중력:2}, fatigue:1, stress:0, description:'창의력 +3 / 집중력 +2 / 피로 +1', hiddenTraitEffects:{creator:2,obsessive:1}, endingSeedEffects:{indieGameCreator:1,belovedGameDirector:0.5} },
  walk: { name:'산책하기', effects:{체력:2,감수성:1,호기심:1}, fatigue:1, stress:-2, description:'체력 +2 / 스트레스 -2 / 피로 +1', hiddenTraitEffects:{explorer:2,stable:1}, endingSeedEffects:{natureDocumentaryMaker:1,lateBloomingOrdinaryLife:0.5} },
  nap: { name:'낮잠 자기', effects:{체력:2,자존감:1}, fatigue:-3, stress:-2, description:'체력 +2 / 자존감 +1 / 피로 -3 / 스트레스 -2', hiddenTraitEffects:{stable:2} },
  toy: { name:'장난감 가지고 놀기', effects:{창의력:2,호기심:2,자존감:1}, fatigue:1, stress:-1, description:'창의력 +2 / 호기심 +2 / 자존감 +1 / 피로 +1', hiddenTraitEffects:{dreamer:1,creator:1} },
  family: { name:'엄마 아빠와 시간 보내기', effects:{사회성:2,감수성:2,자존감:2}, fatigue:0, stress:-2, description:'사회성 +2 / 감수성 +2 / 자존감 +2 / 스트레스 -2', hiddenTraitEffects:{empathetic:2,stable:1}, endingSeedEffects:{warmTeacher:1,lateBloomingOrdinaryLife:0.5} },
  daydream: { name:'멍하니 상상하기', effects:{창의력:3,감수성:2}, fatigue:-1, stress:-1, description:'창의력 +3 / 감수성 +2 / 피로 -1 / 스트레스 -1', hiddenTraitEffects:{dreamer:2,creator:1,loner:1}, endingSeedEffects:{indieGameCreator:1,quietNovelist:1,lonelyGenius:0.5} },
} as const;

const specialMemoryTemplates: Omit<MemoryFragment, 'age'|'season'|'week'>[] = [
  { id: 'first_why_sound_001', title: '처음 터진 "왜?" 같은 소리', text: '동하는 무언가를 궁금해하듯 짧은 소리를 냈다.', tags: ['language','curiosity','childhood'], emotionalTone: 'curious', importance: 3 },
  { id: 'rainy_window_001', title: '비 오는 날의 창문', text: '동하는 비 오는 창밖을 오래 바라보았다.', tags: ['dreamer','sensitivity','rain','childhood'], emotionalTone: 'quiet', importance: 2 },
  { id: 'creative_block_001', title: '이상한 블록 탑', text: '동하는 블록을 이상한 모양으로 쌓고 혼자 웃었다.', tags: ['creator','play','blocks','childhood'], emotionalTone: 'playful', importance: 2 },
  { id: 'tiny_ant_001', title: '작은 개미를 바라본 날', text: '동하는 산책길의 작은 개미를 오래 관찰했다.', tags: ['explorer','nature','observation','childhood'], emotionalTone: 'curious', importance: 2 },
  { id: 'sleepy_day_001', title: '하루 종일 잠만 잔 날', text: '동하는 아무것도 하지 않고 깊게 잠들어 있었다.', tags: ['rest','recovery','body','childhood'], emotionalTone: 'tired', importance: 1 },
  { id: 'busy_mind_001', title: '조용한데 바쁜 머릿속', text: '겉으로는 조용했지만 동하의 눈빛은 바쁘게 흔들렸다.', tags: ['dreamer','inner-world','loner','childhood'], emotionalTone: 'quiet', importance: 2 },
];

export function createInitialState(): GameState { return { player:{name:'동하',age:1,season:0,week:1,money:0}, stats:{체력:30,지능:20,창의력:20,감수성:25,사회성:20,호기심:30,집중력:15,자존감:25}, fatigue:0, stress:0, actionsLeft:3, actionsPerWeek:3, flags:{introSeen:false}, logs:[], memories:[], growthProfile:{hiddenTraits:mkTraits(),eventFlags:{firstWordLikeWhy:false,firstCreativeBlockTower:false,staredAtRainForLong:false,noticedTinyAnt:false,firstBurnout:false,firstCold:false},relationshipScores:{parents:0},endingSeeds:mkEndings()}, weeklyActivityHistory:[], recentConsecutiveActiveWeeks:0, weeklyReflections:[], updatedAt:new Date().toISOString() }; }

export function getDateLabel(state: GameState) { return `동하 ${state.player.age}살 · ${SEASONS[state.player.season]} · ${state.player.week}주차`; }

function addMemory(state: GameState, seed: Omit<MemoryFragment, 'age'|'season'|'week'>) {
  const m: MemoryFragment = { ...seed, age: state.player.age, season: SEASONS[state.player.season], week: state.player.week };
  state.memories = [...state.memories, m].slice(-80);
}
function bumpTraits(state: GameState, effects: Partial<Record<HiddenTraitName, number>>) { Object.entries(effects).forEach(([k,v]) => { if (!v) return; state.growthProfile.hiddenTraits[k as HiddenTraitName] += v; }); }
function bumpSeeds(state: GameState, effects: Partial<Record<EndingSeedName, number>>) { Object.entries(effects).forEach(([k,v]) => { if (!v) return; state.growthProfile.endingSeeds[k as EndingSeedName] += v; }); }

export function applyStatEffects(state: GameState, scheduleId: ScheduleId, lines: string[]) {
  const selected = schedules[scheduleId] as any;
  Object.entries(selected.effects as Record<string, number>).forEach(([key, rawDelta]) => { const delta = Number(rawDelta); const statKey = key as StatName; state.stats[statKey] = clamp(state.stats[statKey] + delta); lines.push(`${statKey} ${delta > 0 ? '+' : ''}${delta}`); });
  state.fatigue = clamp(state.fatigue + selected.fatigue); state.stress = clamp(state.stress + selected.stress); lines.push(`피로도 ${selected.fatigue >= 0 ? '+' : ''}${selected.fatigue}`); lines.push(`스트레스 ${selected.stress >= 0 ? '+' : ''}${selected.stress}`);
}
export function applyHiddenTraitEffects(state: GameState, scheduleId: ScheduleId) { const selected = schedules[scheduleId] as any; bumpTraits(state, selected.hiddenTraitEffects ?? {}); bumpSeeds(state, selected.endingSeedEffects ?? {}); }

export function checkEventFlags(state: GameState, scheduleId: ScheduleId) {
  const flags = state.growthProfile.eventFlags;
  if (scheduleId === 'speech' && state.stats.지능 >= 24 && !flags.firstWordLikeWhy) { flags.firstWordLikeWhy = true; addMemory(state, specialMemoryTemplates[0]); }
  if (scheduleId === 'blocks' && !flags.firstCreativeBlockTower) { flags.firstCreativeBlockTower = true; addMemory(state, specialMemoryTemplates[2]); }
  if (scheduleId === 'daydream' && !flags.staredAtRainForLong) { flags.staredAtRainForLong = true; addMemory(state, specialMemoryTemplates[1]); }
  if (scheduleId === 'walk' && !flags.noticedTinyAnt) { flags.noticedTinyAnt = true; addMemory(state, specialMemoryTemplates[3]); }
  if (state.fatigue >= 90 && !flags.firstBurnout) { flags.firstBurnout = true; }
}

export function checkMemoryTriggers(state: GameState, scheduleId: ScheduleId) {
  const count = state.weeklyActivityHistory.filter((id) => id === scheduleId).length;
  if (scheduleId === 'nap' && count >= 2) addMemory(state, specialMemoryTemplates[4]);
  if (scheduleId === 'daydream' && count >= 2) addMemory(state, specialMemoryTemplates[5]);
}

export function updateEndingSeeds(state: GameState) {
  const t = state.growthProfile.hiddenTraits;
  if (t.empathetic >= 8 && state.stats.사회성 >= 35) bumpSeeds(state, { belovedGameDirector: 1, warmTeacher: 1 });
  if (state.stats.창의력 >= 35 && t.dreamer >= 8 && t.loner >= 4) bumpSeeds(state, { indieGameCreator: 1, quietNovelist: 1, lonelyGenius: 1 });
  if (state.fatigue >= 90) bumpSeeds(state, { burnedOutProdigy: 1, lonelyGenius: 0.5 });
  if (state.growthProfile.eventFlags.staredAtRainForLong && t.dreamer >= 6) bumpSeeds(state, { quietNovelist: 0.5 });
  if (state.growthProfile.eventFlags.noticedTinyAnt && t.explorer >= 6) bumpSeeds(state, { natureDocumentaryMaker: 0.5 });
  if (state.growthProfile.eventFlags.firstBurnout && t.obsessive >= 6) bumpSeeds(state, { burnedOutProdigy: 0.5 });
}

export function getDominantTraits(state: GameState) {
  return Object.entries(state.growthProfile.hiddenTraits).sort((a,b)=>b[1]-a[1]).slice(0,3);
}
export function getEndingCandidates(state: GameState) {
  return Object.entries(state.growthProfile.endingSeeds).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id,score])=>({id,score:Number(score.toFixed(1))}));
}

export function getWeeklyReflection(state: GameState) {
  const [top] = getDominantTraits(state);
  const lines: string[] = [];
  if (top?.[0] === 'dreamer') lines.push('동하는 오늘도 혼자 무언가를 상상하는 시간이 길었다.');
  if (top?.[0] === 'explorer') lines.push('동하는 산책길에서 작은 것들을 오래 바라보았다.');
  if (state.fatigue >= 70) lines.push('동하는 조금 지친 것 같다. 쉬는 시간이 필요해 보인다.');
  if (state.stats.사회성 + state.growthProfile.hiddenTraits.empathetic > 40) lines.push('동하는 누군가와 함께 있을 때 더 편안해 보였다.');
  return lines[0] ?? '동하는 천천히, 자기만의 속도로 한 주를 건넜다.';
}

export function applyActivity(state: GameState, scheduleId: ScheduleId) {
  if (state.actionsLeft <= 0) return { state, summary:'이번 주 행동을 모두 사용했습니다.', resultLines:['이번 주를 마무리해 주세요.'], scheduleName:'행동 불가' };
  const next = structuredClone(state); const lines: string[] = [];
  applyStatEffects(next, scheduleId, lines); applyHiddenTraitEffects(next, scheduleId);
  next.actionsLeft -= 1; next.weeklyActivityHistory.push(scheduleId);
  if (next.stress >= 70 && (scheduleId === 'speech' || scheduleId === 'blocks')) next.growthProfile.hiddenTraits.rebellious += 1;
  if (next.fatigue >= 80 && (scheduleId === 'speech' || scheduleId === 'blocks')) next.growthProfile.hiddenTraits.anxious += 1;
  checkEventFlags(next, scheduleId); checkMemoryTriggers(next, scheduleId); updateEndingSeeds(next);
  const weekLabel = getDateLabel(next);
  next.logs = [{ weekLabel, scheduleName: schedules[scheduleId].name, lines }, ...next.logs].slice(0, 24);
  next.updatedAt = new Date().toISOString();
  return { state: next, summary: getWeeklyReflection(next), resultLines: lines, scheduleName: schedules[scheduleId].name, newMemories: next.memories.slice(-2) };
}

export function endWeek(state: GameState) {
  const next = structuredClone(state);
  if (next.weeklyActivityHistory.length > 0) next.recentConsecutiveActiveWeeks += 1; else next.recentConsecutiveActiveWeeks = 0;
  if (next.recentConsecutiveActiveWeeks >= 3) { next.growthProfile.hiddenTraits.obsessive += 2; next.growthProfile.hiddenTraits.stable -= 1; }
  next.weeklyReflections = [getWeeklyReflection(next), ...next.weeklyReflections].slice(0, 12);
  return advanceTime(next);
}

export function advanceTime(state: GameState) {
  const next = structuredClone(state);
  const prevSeason = next.player.season; const prevAge = next.player.age;
  if (next.player.week >= 4) { next.player.week = 1; next.player.season = next.player.season >= 3 ? 0 : next.player.season + 1; if (next.player.season === 0) next.player.age += 1; } else next.player.week += 1;
  if (next.player.season !== prevSeason) addMemory(next, { id:`season_shift_${next.player.age}_${next.player.season}_${next.player.week}`, title:'계절이 바뀐 공기', text:'동하는 달라진 바람 냄새를 가만히 느꼈다.', tags:['season-change','growth','time'], emotionalTone:'quiet', importance:1 });
  if (next.player.age !== prevAge) addMemory(next, { id:`birthday_${next.player.age}`, title:`${next.player.age}살이 된 날`, text:'동하는 조금 더 자란 얼굴로 새로운 계절을 맞이했다.', tags:['age-change','milestone','growth'], emotionalTone:'warm', importance:2 });
  next.actionsLeft = next.actionsPerWeek; next.fatigue = Math.max(0, next.fatigue - 2); next.stress = Math.max(0, next.stress - 1); next.weeklyActivityHistory = []; next.updatedAt = new Date().toISOString();
  return next;
}

export const runWeek = applyActivity;
export const advanceWeek = endWeek;
export const SAVE_VERSION = 2;
export const validateState = (_s: GameState) => true;
