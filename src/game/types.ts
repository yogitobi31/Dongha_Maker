export type StatName = '체력'|'지능'|'창의력'|'감수성'|'사회성'|'호기심'|'집중력'|'자존감';
export type Stats = Record<StatName, number>;
export type HiddenTraitName = 'dreamer'|'explorer'|'creator'|'leader'|'loner'|'empathetic'|'obsessive'|'rebellious'|'stable'|'anxious';
export type EndingSeedName = 'indieGameCreator'|'belovedGameDirector'|'natureDocumentaryMaker'|'quietNovelist'|'warmTeacher'|'lonelyGenius'|'lateBloomingOrdinaryLife'|'burnedOutProdigy';
export type MemoryTone = 'quiet'|'warm'|'curious'|'playful'|'tired'|'intense';
export type SeasonLabel = '봄'|'여름'|'가을'|'겨울';

export type MemoryFragment = { id:string; age:number; season:SeasonLabel; week:number; title:string; text:string; tags:string[]; emotionalTone:MemoryTone; importance:number; };
export type RelationshipMetric = 'intimacy'|'trust'|'curiosity'|'comfort';
export type RelationshipType = 'family'|'friend'|'neighbor'|'animal'|'nature'|'seed';
export type Relationship = { id:string; name:string; type:RelationshipType; description:string; note:string; metrics: Partial<Record<RelationshipMetric, number>>; memories:string[] };

export type GrowthProfile = { hiddenTraits: Record<HiddenTraitName, number>; eventFlags: Record<string, boolean>; relationshipScores: Record<string, number>; endingSeeds: Record<EndingSeedName, number>; };
export type Flags = { introSeen:boolean };
export type ScheduleId = 'speech'|'storybook'|'blocks'|'walk'|'nap'|'toy'|'family'|'daydream';
export type GameLog = { weekLabel:string; scheduleName:string; lines:string[] };

export type MonthlyReport = { week:number; title:string; summary:string; topStats:string[]; stressDelta:number; discoveredComboIds:string[]; eventTitles:string[]; milestoneTitles:string[]; recommendation:string };
export type EmotionState = 'calm'|'happy'|'tired'|'stressed'|'sick'|'curious'|'dreaming';

export type GameState = {
  player:{name:string;age:number;season:number;week:number;money:number};
  stats: Stats; fatigue:number; stress:number; actionsLeft:number; actionsPerWeek:number;
  flags: Flags; logs: GameLog[]; memories: MemoryFragment[]; growthProfile: GrowthProfile;
  relationships: Record<string, Relationship>; relationshipEventFlags: Record<string, boolean>; seasonEventHistory: string[];
  weeklyActivityHistory: ScheduleId[]; recentConsecutiveActiveWeeks:number; weeklyReflections:string[]; emotionState:EmotionState; updatedAt:string;
  currentWeek:number; currentMonth:number; ageInMonths:number; selectedGrowthDirection:string|null; recentActionTags:string[]; recentActions:string[]; discoveredCombos:string[]; growthHistory:string[]; milestoneHistory:string[]; pendingMilestones:string[]; seenMilestoneIds:string[]; monthlyReports: MonthlyReport[]; pendingMonthlyReport: MonthlyReport | null; eventHistory:string[]; pendingEvent: string | null; saveVersion:number; lastMonthlyReportWeek:number;
};
