export type StatName = '체력'|'지능'|'창의력'|'감수성'|'사회성'|'호기심'|'집중력'|'자존감';
export type Stats = Record<StatName, number>;

export type HiddenTraitName =
  | 'dreamer' | 'explorer' | 'creator' | 'leader' | 'loner'
  | 'empathetic' | 'obsessive' | 'rebellious' | 'stable' | 'anxious';

export type EndingSeedName =
  | 'indieGameCreator' | 'belovedGameDirector' | 'natureDocumentaryMaker' | 'quietNovelist'
  | 'warmTeacher' | 'lonelyGenius' | 'lateBloomingOrdinaryLife' | 'burnedOutProdigy';

export type MemoryTone = 'quiet'|'warm'|'curious'|'playful'|'tired'|'intense';
export type SeasonLabel = '봄'|'여름'|'가을'|'겨울';

export type MemoryFragment = {
  id: string;
  age: number;
  season: SeasonLabel;
  week: number;
  title: string;
  text: string;
  tags: string[];
  emotionalTone: MemoryTone;
  importance: number;
};

export type GrowthProfile = {
  hiddenTraits: Record<HiddenTraitName, number>;
  eventFlags: Record<string, boolean>;
  relationshipScores: Record<string, number>;
  endingSeeds: Record<EndingSeedName, number>;
};

export type Flags = { introSeen:boolean };
export type ScheduleId = 'speech'|'storybook'|'blocks'|'walk'|'nap'|'toy'|'family'|'daydream';
export type GameLog = { weekLabel:string; scheduleName:string; lines:string[] };

export type GameState = {
  player:{name:string;age:number;season:number;week:number;money:number};
  stats: Stats;
  fatigue:number;
  stress:number;
  actionsLeft:number;
  actionsPerWeek:number;
  flags: Flags;
  logs: GameLog[];
  memories: MemoryFragment[];
  growthProfile: GrowthProfile;
  weeklyActivityHistory: ScheduleId[];
  recentConsecutiveActiveWeeks: number;
  weeklyReflections: string[];
  emotionState: EmotionState;
  updatedAt: string;
};

export type EmotionState = 'calm'|'happy'|'tired'|'stressed'|'sick'|'curious'|'dreaming';
