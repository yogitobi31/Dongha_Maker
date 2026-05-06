export type StatName = '체력'|'지능'|'창의력'|'감수성'|'사회성'|'호기심'|'집중력'|'자존감';
export type Stats = Record<StatName, number>;

export type Flags = { introSeen:boolean };
export type ScheduleId =
  | 'speech'
  | 'storybook'
  | 'blocks'
  | 'walk'
  | 'nap'
  | 'toy'
  | 'family'
  | 'daydream';
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
  updatedAt: string;
};
