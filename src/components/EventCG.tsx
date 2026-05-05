import { useState } from 'react';
import { getIllustration } from '../data/illustrations';
export function EventCG({event}:{event:any}){const ill=getIllustration(event.illustrationId);const [err,setErr]=useState(false);return <div className='event-cg frame'><h3>{event.title}</h3><p>{event.location} · {event.character}</p>{!err?<img src={ill.src} alt={ill.alt} onError={()=>setErr(true)}/>:<div className='cg-fallback'>추억으로 기록됨</div>}</div>}
