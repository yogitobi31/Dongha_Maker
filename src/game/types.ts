export type StatKey = 'study'|'stamina'|'mental'|'humor'|'gaming'|'emotion'|'social'|'focus'|'romance'|'esteem';
export type HiddenKey = 'heeseon'|'juwon'|'reputation'|'fatigue'|'stress'|'anpan';

export type StatName = '체력'|'스트레스'|'지능'|'감성'|'매력'|'운동'|'도덕성'|'창의력'|'코딩력'|'행복도';
export type Stats = Record<StatName, number> & Partial<Record<StatKey, number>>;

export type Flags = { heesunDating:boolean; afraidOfBugs:boolean; likesRedPepperJjajang:boolean; likesSweetRedBeanBread:boolean; };
export type ScheduleId = 'study'|'coding'|'workout'|'draw'|'date'|'jjajang'|'sweetBread';
export type GameLog = { weekLabel:string; scheduleName:string; lines:string[] };

export type GameState = {
  player:{name:string;age:number;month:number;week:number;money:number};
  stats: Stats;
  flags: Flags;
  logs: GameLog[];
  updatedAt: string;
  saveVersion?:number;month?:number;period?:1|2|3;hidden?:Record<HiddenKey,number>;schedule?:string[];ended?:boolean;endingId?:string;endingsUnlocked?:string[];seenEvents?:string[];memoryAlbum?:any[];activityCounts?:Record<string,number>;characterState?:'neutral'|'happy'|'tired'|'stressed'|'proud'|'shy'|'focused';lastActivityId?:string;
};
