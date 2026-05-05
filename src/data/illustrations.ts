export type Illustration={id:string;type:'activity'|'event'|'ending'|'character'|'background';src:string;fallbackType:'gradient'|'portrait'|'scene';alt:string};
export const ILLUSTRATIONS:Illustration[]=[];
export const getIllustration=(id:string):Illustration=>ILLUSTRATIONS.find(i=>i.id===id)??{id,type:'event',src:`/assets/events/${id}.png`,fallbackType:'scene',alt:id};
