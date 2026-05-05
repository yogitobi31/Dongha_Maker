export type StatKey = 'study'|'stamina'|'mental'|'humor'|'gaming'|'emotion'|'social'|'focus'|'romance'|'esteem';
export type HiddenKey = 'heeseon'|'juwon'|'reputation'|'fatigue'|'stress'|'anpan';

export type GameState={saveVersion:number;month:number;period:1|2|3;stats:Record<StatKey,number>;hidden:Record<HiddenKey,number>;schedule:string[];logs:string[];ended:boolean;endingId?:string;endingsUnlocked:string[];seenEvents:string[];memoryAlbum:any[];activityCounts:Record<string,number>;characterState:'neutral'|'happy'|'tired'|'stressed'|'proud'|'shy'|'focused';lastActivityId?:string};
