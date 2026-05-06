import { ACTION_CARDS } from '../data/actionCards';
import { GROWTH_DIRECTIONS } from '../data/growthDirections';
import { EVENT_CARDS } from '../data/eventCards';
import { GROWTH_COMBOS } from '../data/growthCombos';
const pick = <T,>(arr:T[]) => arr[Math.floor(Math.random()*arr.length)];
export function pickWeeklyCards(directionId?:string){const direction=GROWTH_DIRECTIONS.find((d)=>d.id===directionId);const weighted=ACTION_CARDS.flatMap((c)=>direction&&c.tags.some((t)=>direction.boostedTags.includes(t))?[c,c,c]:[c]);const result=[] as typeof ACTION_CARDS;while(result.length<3){const c=pick(weighted);if(!result.find((v)=>v.id===c.id))result.push(c);}return result;}
export function maybeEvent(directionId?:string){const direction=GROWTH_DIRECTIONS.find((d)=>d.id===directionId);let p=0.4;if(direction?.id==='freeSoul')p+=0.05;if(Math.random()>p)return null;const weighted=EVENT_CARDS.flatMap((e)=>direction&&e.tags.some((t)=>direction.eventBias.includes(t))?[e,e]:[e]);return pick(weighted);}
export const detectCombos=(tags:string[])=>GROWTH_COMBOS.filter((combo)=>{const pool=[...tags];return combo.requiredTags.every((t)=>{const i=pool.indexOf(t);if(i===-1)return false;pool.splice(i,1);return true;});});
