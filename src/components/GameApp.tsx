import { useMemo, useState } from 'react';
import { ACTIVITIES } from '../data/activities';
import { ENDINGS } from '../data/endings';
import { applyActivity, createInitialState, getDateLabel } from '../game/engine';
import { loadGame, saveGame } from '../game/storage';
import type { GameState } from '../game/types';
import { ActivityResultScene } from './ActivityResultScene';
import { DialogueScene } from './DialogueScene';
import { EventCG } from './EventCG';
import { MemoryAlbum } from './MemoryAlbum';

export function GameApp(){const [state,setState]=useState<GameState>(createInitialState());const[screen,setScreen]=useState<'schedule'|'result'|'cg'|'dialogue'|'ending'|'album'>('schedule');const[last,setLast]=useState<any>(null);const[dIdx,setDIdx]=useState(0);
const ending=useMemo(()=>ENDINGS.find(e=>e.id===state.endingId),[state.endingId]);
const pick=(id:string)=>{const r=applyActivity(state,id);setState(r.state);saveGame(r.state);setLast(r); if(r.state.ended)setScreen('ending'); else if(r.event){setDIdx(0);setScreen('result');} else setScreen('result');};
const remainPeriods=(12-state.month)*3+(4-state.period);
if(screen==='schedule') return <div><h2>{getDateLabel(state)} / 남은 기간: {Math.floor((remainPeriods-1)/3)}개월 {((remainPeriods-1)%3)+1}기간</h2><button onClick={()=>{const s=loadGame();setState(s);}}>불러오기</button><button onClick={()=>{const s=createInitialState();setState(s);}}>새 게임</button><button onClick={()=>setScreen('album')}>추억 앨범</button>{ACTIVITIES.map(a=><button key={a.id} onClick={()=>pick(a.id)}>{a.name}</button>)}</div>;
if(screen==='result') return <div><ActivityResultScene activity={last.activity} resultText={last.activity.resultTexts[Math.floor(Math.random()*last.activity.resultTexts.length)]} delta={[`피로도 ${last.activity.fatigueEffect>=0?'+':''}${last.activity.fatigueEffect}`,`스트레스 ${last.activity.stressEffect>=0?'+':''}${last.activity.stressEffect}`]} event={last.event}/><button onClick={()=>setScreen(last.event?'cg':'schedule')}>다음</button></div>;
if(screen==='cg') return <div><EventCG event={last.event}/><button onClick={()=>setScreen('dialogue')}>대사 보기</button></div>;
if(screen==='dialogue') return <DialogueScene event={last.event} index={dIdx} onNext={()=>setDIdx(dIdx+1)} onChoose={()=>setScreen('schedule')}/>;
if(screen==='album') return <div><MemoryAlbum items={state.memoryAlbum}/><button onClick={()=>setScreen('schedule')}>돌아가기</button></div>;
return <div><h1>{ending?.title}</h1><p>{ending?.summary}</p><p>{ending?.donghaFinalLine}</p><p>{ending?.heeseonComment}</p><p>{ending?.teacherComment}</p><p>주요 추억: {state.memoryAlbum.slice(-3).map(m=>m.title).join(', ')}</p><button onClick={()=>setState(createInitialState())}>다시 키우기</button><button onClick={()=>setScreen('album')}>추억 앨범 보기</button></div>}
