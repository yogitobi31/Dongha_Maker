import { ACTIVITIES } from '../data/activities';
import { ENDINGS } from '../data/endings';
import { selectEventForPeriod } from './events';
import type { GameState } from './types';
export const SAVE_VERSION=2; const clamp=(v:number)=>Math.max(0,Math.min(100,v));
export function createInitialState():GameState{const stats:any={study:25,stamina:25,mental:25,humor:25,gaming:25,emotion:25,social:25,focus:25,romance:25,esteem:25};const hidden:any={heeseon:0,juwon:0,reputation:0,fatigue:10,stress:10,anpan:0};return{saveVersion:SAVE_VERSION,month:1,period:1,stats,hidden,schedule:[],logs:['동하의 1년이 시작되었다.'],ended:false,endingsUnlocked:[],seenEvents:[],memoryAlbum:[],activityCounts:{},characterState:'neutral'};}
export function getDateLabel(s:GameState){const p=['초순','중순','하순'][s.period-1];return `1년차 ${s.month}월 ${p}`}
export function applyActivity(s:GameState,id:string){const a=ACTIVITIES.find(x=>x.id===id); if(!a||s.ended)return {state:s}; const n=structuredClone(s); n.lastActivityId=id; n.schedule.push(id); n.activityCounts[id]=(n.activityCounts[id]??0)+1; for(const[k,v]of Object.entries(a.baseEffects)){if((n.stats as any)[k]!=null)(n.stats as any)[k]=clamp((n.stats as any)[k]+v);} n.hidden.stress=clamp(n.hidden.stress+a.stressEffect); n.hidden.fatigue=clamp(n.hidden.fatigue+a.fatigueEffect); if(id==='date'||id==='walk')n.hidden.heeseon=clamp(n.hidden.heeseon+5); if(id==='counsel')n.hidden.juwon=clamp(n.hidden.juwon+5);
 const ev=selectEventForPeriod(n,id); if(ev){n.seenEvents.push(ev.id); n.memoryAlbum.push({dateLabel:getDateLabel(n),eventId:ev.id,title:ev.title,character:ev.character,location:ev.location,memoryTag:ev.memoryTag,note:'특별한 하루였다.',illustrationId:ev.illustrationId});}
 if(n.hidden.stress>70)n.characterState='stressed'; else if(n.hidden.fatigue>70)n.characterState='tired'; else if(id==='date')n.characterState='shy'; else if(id==='english'||id==='exam'||id==='math')n.characterState='focused'; else n.characterState='happy';
 if(n.period<3)n.period=(n.period+1) as any; else {n.period=1;n.month+=1;} if(n.month>12){n.ended=true;const e=ENDINGS.find(x=>x.condition(n))??ENDINGS[ENDINGS.length-1];n.endingId=e.id;n.endingsUnlocked=[...new Set([...n.endingsUnlocked,e.id])];}
 return {state:n,activity:a,event:ev};}
export const validateState=(s:GameState)=>s.saveVersion===SAVE_VERSION;
