import { useEffect, useMemo, useState } from 'react';
import { createAndSaveInitialGame, hasSaveData, loadGame, saveGame } from './game/storage';
import { advanceWeek, createInitialState, getDateLabel, getEndingCandidates, runWeek, schedules } from './game/engine';
import type { GameState, ScheduleId, StatName } from './game/types';
import { emotionLabelMap, emotionNarrativeMap, getDonghaPortraitPath, getMemoryVisualClass, seasonVisualMeta, type EventIllustrationKey } from './game/visuals';
import { GROWTH_DIRECTIONS } from './data/growthDirections';
import { MILESTONES } from './data/milestones';
import { pickWeeklyCards, maybeEvent, detectCombos } from './utils/growthEngine';

type Scene = 'title' | 'intro' | 'main';
type ActivityModal = { sceneText: string; resultLines: string[]; newMemories: GameState['memories']; scheduleName: string; eventIllustrationKey?: EventIllustrationKey;};
type WeeklyModal = { reflection: string; newMemory?: GameState['memories'][number];};
const statOrder: StatName[] = ['체력', '지능', '창의력', '감수성', '사회성', '호기심', '집중력', '자존감'];

const onboardingCards = [
  { title:'동하는 아직 아주 작은 아이입니다.', body:'매주 작은 선택을 통해 동하의 성향과 관계가 자라납니다.' },
  { title:'정답은 없습니다.', body:'공부만 시키는 아이, 자유롭게 노는 아이, 섬세한 아이 모두 다른 이야기로 자랍니다.' },
  { title:'먼 목표보다 작은 순간을 따라가세요.', body:'첫 미소, 첫 옹알이, 첫 걸음처럼 특별한 성장 순간들이 기다리고 있습니다.' }
];
const tutorialByWeek: Record<number, string> = {
  1:'처음 한 달은 동하가 세상에 적응하는 시간이에요. 먼저 이번 달의 돌봄 방향을 정해볼까요?',
  2:'좋아요. 이제 매주 동하와 함께할 일을 하나씩 고르면 됩니다. 선택한 행동은 동하의 성향에 조금씩 영향을 줘요.',
  3:'가끔 예상 밖의 일이 생깁니다. 이때의 선택이 동하의 성격을 조금씩 만들어갑니다.',
  4:'한 달이 지나면 성장 리포트가 열립니다. 이번 달 동하가 어떻게 자랐는지 확인해보세요.'
};

const introLines = ['비가 아주 조금 내리던 날,','작은 아이 하나가 세상에 도착했다.','이름은 최동하.','아직 아무것도 정해지지 않은 아이.','이제부터, 당신은 동하의 시간을 함께 걷게 된다.','1살 봄','동하는 아직 말을 잘하지 못한다. 하지만 눈빛만큼은 이상하게 반짝인다.'];

const devImageTargets = import.meta.env.DEV ? [
  '/assets/dongha/seasons/spring-bg.png',
  '/assets/dongha/seasons/summer-bg.png',
  '/assets/dongha/seasons/autumn-bg.png',
  '/assets/dongha/seasons/winter-bg.png',
  '/assets/dongha/events/rainy_window.png',
  '/assets/dongha/events/tiny_ant.png',
  '/assets/dongha/events/creative_block_tower.png',
  '/assets/dongha/events/heeseon_seed.png',
  '/assets/dongha/events/long_nap.png',
  '/assets/dongha/events/strange_dog.png',
  '/assets/dongha/events/first_why.png',
  '/assets/dongha/events/parents_comfort.png',
  '/assets/dongha/events/walking_grandma.png',
  '/assets/dongha/events/neighborhood_child.png'
] : [];

const endingLabelMap: Record<string, string> = {indieGameCreator:'자기만의 세계를 만드는 아이',belovedGameDirector:'사람들과 함께 무언가를 만드는 아이',natureDocumentaryMaker:'작은 것들을 오래 바라보는 아이',quietNovelist:'조용히 이야기를 품는 아이',warmTeacher:'누군가의 마음을 잘 살피는 아이',lonelyGenius:'혼자만의 방에서 빛나는 아이',lateBloomingOrdinaryLife:'천천히 자기 속도로 피어나는 아이',burnedOutProdigy:'너무 일찍 많은 것을 짊어진 아이'};
const eventKeyFromMemory = (memory?: GameState['memories'][number]): EventIllustrationKey | undefined => {
  if (!memory) return undefined;

  const { title, tags } = memory;

  if (title.includes('품 안에서') || tags.includes('family') || tags.includes('comfort') || tags.includes('warm')) return 'parents_comfort';
  if (title.includes('할머니') || tags.includes('grandma') || tags.includes('walkingGrandma')) return 'walking_grandma';
  if (title.includes('동네 아이') || title.includes('놀이터에서 마주친 아이') || tags.includes('friend') || tags.includes('neighborhoodChild')) return 'neighborhood_child';
  if (title.includes('강아지') || tags.includes('animal') || tags.includes('strangeDog')) return 'strange_dog';
  if (tags.includes('rain') || title.includes('비 오는')) return 'rainy_window';
  if (tags.includes('firstBugEncounter') || tags.includes('bug') || tags.includes('nature') || title.includes('벌레') || title.includes('개미')) return 'tiny_ant';
  if (tags.includes('creator') || tags.includes('blocks') || title.includes('블록')) return 'creative_block_tower';
  if (tags.includes('heeseonSeed') || title.includes('또렷한 눈빛')) return 'heeseon_seed';
  if (tags.includes('rest') || title.includes('낮잠') || title.includes('잠')) return 'long_nap';
  if (title.includes('왜') || tags.includes('language')) return 'first_why';

  return undefined;
};

export default function App() {
const [scene,setScene]=useState<Scene>('title'); const [showOnboarding,setShowOnboarding]=useState(()=>localStorage.getItem('dongha.onboardingSeen')!=='true'); const [onboardingStep,setOnboardingStep]=useState(0); const [hideTutorial,setHideTutorial]=useState(()=>localStorage.getItem('dongha.hideTutorial')==='true'); const [state,setState]=useState<GameState>(createInitialState()); const [selected,setSelected]=useState<ScheduleId|null>(null); const [message,setMessage]=useState('');
const [showPreview,setShowPreview]=useState(false); const [activityModal,setActivityModal]=useState<ActivityModal|null>(null); const [weeklyModal,setWeeklyModal]=useState<WeeklyModal|null>(null);
const [portraitFailed,setPortraitFailed]=useState(false); const [seasonImageFailed,setSeasonImageFailed]=useState(false); const [eventImageFailed,setEventImageFailed]=useState(false); const [failedMemoryImages, setFailedMemoryImages] = useState<Record<string, boolean>>({});
const [devImageStatus, setDevImageStatus] = useState<Record<string, 'OK' | 'FAIL'>>({});
const [weeklyCards,setWeeklyCards]=useState(()=>pickWeeklyCards(state.selectedGrowthDirection??undefined)); const [pendingEvent,setPendingEvent]=useState<any|null>(null); const [reportText,setReportText]=useState('');
const memoryPreview=useMemo(()=>state.memories.slice(-6).reverse(),[state.memories]); const endingPreview=useMemo(()=>getEndingCandidates(state),[state]); const relationshipList=useMemo(()=>Object.values(state.relationships),[state.relationships]);
const currentSeason=(state.memories.length?state.memories[state.memories.length-1].season:['봄','여름','가을','겨울'][state.player.season]) as '봄'|'여름'|'가을'|'겨울'; const seasonMeta=seasonVisualMeta[currentSeason]; const statusLine=emotionNarrativeMap[state.emotionState];
const portraitPath=getDonghaPortraitPath(state.player.age,state.emotionState);
const currentMonth = state.ageInMonths;
const currentWeekInMonth = ((state.currentWeek-1)%4)+1;
const nextMilestone = MILESTONES.find((m)=>m.month>=currentMonth) ?? MILESTONES[MILESTONES.length-1];
const weeksToMilestone = Math.max(0, (nextMilestone.month-currentMonth)*4 + (4-currentWeekInMonth));
const starterDirectionIds = ['sensitive','curious','fit'];
const unlockedDirections = currentMonth <= 1 ? GROWTH_DIRECTIONS.filter((d)=>starterDirectionIds.includes(d.id)) : GROWTH_DIRECTIONS;
const lockedDirectionCount = GROWTH_DIRECTIONS.length - unlockedDirections.length;
const openMilestoneModal = state.milestoneHistory.length>0 && !reportText;
const showMonthlyReportCta = currentWeekInMonth===4 && state.actionsLeft===0;
const showEventCta = Boolean(pendingEvent);
const showWeeklyChoiceCta = Boolean(state.selectedGrowthDirection) && state.actionsLeft===state.actionsPerWeek;
const showDirectionCta = !state.selectedGrowthDirection;
const primaryCtaLabel = openMilestoneModal ? '특별한 성장 순간 보기' : showMonthlyReportCta ? '이번 달 성장 돌아보기' : showEventCta ? '뜻밖의 사건 확인하기' : showDirectionCta ? '이번 달 어떻게 키울지 정하기' : showWeeklyChoiceCta ? '이번 주 함께할 일 고르기' : '다음 주로 진행하기';
const tutorialMessage = !hideTutorial && currentMonth===1 ? tutorialByWeek[currentWeekInMonth] : '';
const recommendedCardId = (()=>{
  if (state.stress>=70) return weeklyCards.find((c:any)=>c.tags.includes('rest')||c.stressEffect<0)?.id;
  const lowStat = statOrder.slice().sort((a,b)=>state.stats[a]-state.stats[b])[0];
  const lowStatMap: Record<string,string[]> = { '체력':['exercise','rest'],'지능':['study','focus'],'창의력':['creative','art'],'감수성':['emotion','music'],'사회성':['social','bond'],'호기심':['curiosity','observe'],'집중력':['focus','routine'],'자존감':['bond','social'] };
  const byLow = weeklyCards.find((c:any)=>lowStatMap[lowStat]?.some((t)=>c.tags.includes(t)));
  if (byLow) return byLow.id;
  const byMilestone = weeklyCards.find((c:any)=>['emotion','bond','social'].some((t)=>c.tags.includes(t)));
  if (byMilestone) return byMilestone.id;
  return weeklyCards[0]?.id;
})();


useEffect(() => {
  if (!import.meta.env.DEV) return;
  devImageTargets.forEach((src) => {
    const img = new Image();
    img.onload = () => setDevImageStatus((prev) => ({ ...prev, [src]: 'OK' }));
    img.onerror = () => setDevImageStatus((prev) => ({ ...prev, [src]: 'FAIL' }));
    img.src = src;
  });
}, []);
const startNewGame=()=>{if(hasSaveData()&&!window.confirm('기존 저장 데이터를 덮어쓰고 새 게임을 시작할까요?'))return; const initial=createAndSaveInitialGame(); setState(initial); setSelected(null); setScene('intro'); setMessage(''); setShowOnboarding(localStorage.getItem('dongha.onboardingSeen')!=='true'); setOnboardingStep(0);};
const continueGame=()=>{const loaded=loadGame(); if(!loaded)return setMessage('아직 저장된 기록이 없습니다.'); setState(loaded); setScene('main'); setMessage('기록을 불러왔습니다.');};
const applyGrowthCard=(card:any, current:GameState)=>{
  const next=structuredClone(current);
  Object.entries(card.statEffects).forEach(([k,v])=>{
    if(k in next.stats) (next.stats as any)[k]=Math.min(100,Math.max(0,(next.stats as any)[k]+Number(v)));
  });
  next.stress=Math.max(0,Math.min(100,next.stress+card.stressEffect));
  next.recentActionTags=[...next.recentActionTags,...card.tags].slice(-12);
  next.recentActions=[...next.recentActions,card.id].slice(-8);
  const combos=detectCombos(next.recentActionTags.slice(-8)).filter((c)=>!next.discoveredCombos.includes(c.id));
  combos.forEach((c)=>{
    next.discoveredCombos.push(c.id);
    Object.entries(c.statEffects).forEach(([k,v])=>{
      if(k in next.stats) (next.stats as any)[k]=Math.min(100,Math.max(0,(next.stats as any)[k]+Number(v)));
    });
    next.growthHistory.unshift(`새로운 성장 패턴: ${c.name}`);
  });
  const ev=maybeEvent(next.selectedGrowthDirection??undefined);
  if(ev) next.eventHistory.unshift(ev.title);
  const milestone=MILESTONES.find((m)=>m.month<=next.ageInMonths&&!next.milestoneHistory.includes(m.title));
  if(milestone){
    next.milestoneHistory.unshift(milestone.title);
    Object.entries(milestone.rewardEffects).forEach(([k,v])=>{
      if(k in next.stats) (next.stats as any)[k]=Math.min(100,Math.max(0,(next.stats as any)[k]+Number(v)));
    });
  }
  return {next,ev};
};
const runSelectedWeek=()=>{if(!selected)return; const card=weeklyCards.find((c)=>c.id===recommendedCardId) ?? weeklyCards[0] ?? pickWeeklyCards(state.selectedGrowthDirection??undefined)[0]; const grown=applyGrowthCard(card,state); setPendingEvent(grown.ev); const prevMemories=grown.next.memories.length; const result=runWeek(grown.next,selected); if(result.state===state)return setMessage('행동 횟수를 모두 사용했습니다. 이번 주를 마무리해 주세요.'); setState(result.state); saveGame(result.state); const latest=result.state.memories.slice(prevMemories); const rare=latest.find((m)=>m.importance>=3) ?? latest[0]; const inferredKey=eventKeyFromMemory(rare); if (latest.length > 0 && !inferredKey) { console.warn('[event-illustration] key missing', { title: rare?.title, tags: rare?.tags }); } setEventImageFailed(false); setActivityModal({sceneText:result.resultSceneText??'동하는 오늘도 자기만의 시간을 보냈다.',resultLines:result.resultLines,scheduleName:result.scheduleName,newMemories:latest,eventIllustrationKey:inferredKey});};
const finishWeek=()=>{const prev=state.memories.length; const reflection=state.weeklyReflections[0]??'동하는 이번 주를 조용히 지나오며 자기만의 리듬을 만들었습니다.'; const next=advanceWeek(state); setState(next); saveGame(next); setWeeklyModal({reflection,newMemory:next.memories[prev]});};
if(scene==='title') return <main className="title-page"><section className="title-card"><p className="eyebrow">RAISING DIARY</p><h1>동하키우기</h1><p className="subtitle">시간의 압박 속에서 쌓이는 작은 기억들</p><div className="menu-list"><button onClick={startNewGame}>새 게임</button><button onClick={continueGame}>이어하기</button></div>{message?<p className="title-message">{message}</p>:null}</section></main>;
if(scene==='intro') return <main className="intro-page"><section className="intro-card">{showOnboarding?<><p className='eyebrow'>처음 만나는 동하</p><h3>{onboardingCards[onboardingStep].title}</h3><p>{onboardingCards[onboardingStep].body}</p><div className='intro-actions'>{onboardingStep<2?<button onClick={()=>setOnboardingStep((v)=>v+1)}>다음</button>:<button onClick={()=>{localStorage.setItem('dongha.onboardingSeen','true'); setShowOnboarding(false); setScene('main');}}>동하 키우기 시작하기</button>}</div></>:<>{introLines.map((line)=><p key={line} className='intro-line visible'>{line}</p>)}<div className='intro-actions'><button onClick={()=>setScene('main')}>시작하기</button></div></>}</section></main>;
return <main className='main-page'><section className={`top-card status-hero ${seasonMeta.className}`}>
{!seasonImageFailed?<img className='season-bg-image' src={seasonMeta.imagePath} alt='' onError={()=>setSeasonImageFailed(true)}/>:null}
<p className='date'>{getDateLabel(state)}</p><div className='hero-title-row'><h2>동하의 하루</h2><span className='emotion-badge'>{emotionLabelMap[state.emotionState]}</span></div>
<div className='hero-portrait-wrap'><article className='portrait-frame'>{!portraitFailed?<img src={portraitPath} alt={`동하 ${emotionLabelMap[state.emotionState]}`} onError={()=>setPortraitFailed(true)}/>:<div className='portrait-fallback'><small>동하</small><strong>{emotionLabelMap[state.emotionState]}</strong></div>}</article><div><p className='hero-line'>{statusLine}</p><p className='season-mood'>{seasonMeta.line}</p></div></div></section>
<section className='summary-card objective-card'><p className='eyebrow'>현재 목표</p><h3>생후 {currentMonth}개월 — {nextMilestone.title}를 향해</h3><p>동하가 세상에 조금씩 적응하고 있어요. 앞으로 {weeksToMilestone}주 동안 안정감과 애착을 키워주면 {nextMilestone.title} 이벤트를 만날 수 있습니다.</p><p>현재 나이: 생후 {currentMonth}개월 · 현재 주차: {currentWeekInMonth}주차 · 다음 특별한 성장 순간: {nextMilestone.title} · 남은 시간: {weeksToMilestone}주 · 추천 성장 요소: 안정감 / 애착 / 감성</p></section><section className='summary-card tutorial-card'>{tutorialMessage ? <><p>{tutorialMessage}</p><button className='run-button' onClick={()=>{localStorage.setItem('dongha.hideTutorial','true'); setHideTutorial(true);}}>다시 보지 않기</button></> : <p>지금 해야 할 일이 아래에 준비되어 있어요.</p>}</section><section className='schedule-card'><h3>지금 해야 할 일</h3><button className='run-button primary-cta'>{primaryCtaLabel}</button></section><section className='summary-card'>이번 주 남은 행동 <strong>{state.actionsLeft} / {state.actionsPerWeek}</strong> · 피로 <strong>{state.fatigue}</strong> · 스트레스 <strong>{state.stress}</strong></section>
<section className='summary-card'><h3>이번 달 돌봄 방향을 정해볼까요?</h3><div className='schedule-list'>{unlockedDirections.map((d)=><button key={d.id} className={state.selectedGrowthDirection===d.id?'schedule-item selected':'schedule-item'} onClick={()=>{const next={...state,selectedGrowthDirection:d.id};setState(next);saveGame(next);setWeeklyCards(pickWeeklyCards(d.id));}}><strong>{d.title}</strong><em>{d.description}</em></button>)}</div>{lockedDirectionCount>0?<p>동하가 조금 더 자라면 새로운 돌봄 방향이 열립니다.</p>:null}<p>선택 방향: {GROWTH_DIRECTIONS.find((d)=>d.id===state.selectedGrowthDirection)?.title ?? '미선택'}</p></section><section className='summary-card'><h3>이번 주 함께할 일</h3><div className='schedule-list'>{weeklyCards.map((c)=> <article key={c.id} className='schedule-item'><strong>{c.title} {c.id===recommendedCardId?<span>추천</span>:null}</strong><p>{c.description}</p><p>{c.id===recommendedCardId?(state.stress>=70?'지금은 스트레스를 낮추기 좋아요.':'이번 달 성장 방향과 잘 맞아요.'):' '}</p></article>)}</div></section><section className='stats-grid'>{statOrder.map((key)=><article key={key} className='stat-card'><div className='stat-head'><span>{key}</span><strong>{state.stats[key]}</strong></div><div className='bar'><i style={{width:`${state.stats[key]}%`}}/></div></article>)}</section>
<section className='schedule-card'><h3>이번 주 함께할 일 실행</h3><div className='schedule-list'>{(Object.keys(schedules) as ScheduleId[]).map((id)=><button key={id} disabled={state.actionsLeft===0} className={selected===id?'schedule-item selected':'schedule-item'} onClick={()=>setSelected(id)}><strong>{schedules[id].name}</strong><em>피로 {schedules[id].fatigue>=0?'+':''}{schedules[id].fatigue} / 스트레스 {schedules[id].stress>=0?'+':''}{schedules[id].stress}</em></button>)}</div><div className='action-buttons'><button className='run-button' onClick={runSelectedWeek} disabled={state.actionsLeft===0||!selected}>행동 실행</button><button className='run-button finish' onClick={finishWeek}>1주 진행</button>{state.ageInMonths>1 || state.monthlyReports.length>0 ? <button className='run-button' onClick={()=>{let sim=state;for(let i=0;i<4;i++){const auto=pickWeeklyCards(sim.selectedGrowthDirection??undefined)[0];const a=applyGrowthCard(auto,sim);sim=advanceWeek(runWeek(a.next,selected??'walk').state);} setState(sim); saveGame(sim); setReportText('지난 4주 동안 동하는 반복보다 리듬을 선택하며 차분히 성장했습니다.');}}>한 달 맡겨보기</button> : <small>이제 기본 흐름을 익혔어요. 다음부터는 한 달을 빠르게 진행할 수도 있습니다.</small>}<button className='run-button' onClick={()=>{let sim=state;while(sim.milestoneHistory.length===state.milestoneHistory.length){const auto=pickWeeklyCards(sim.selectedGrowthDirection??undefined)[0];const a=applyGrowthCard(auto,sim);sim=advanceWeek(runWeek(a.next,selected??'walk').state); if(sim.currentWeek-state.currentWeek>16) break;} setState(sim);saveGame(sim);}}>특별한 성장 순간까지</button><button className='run-button preview-button' onClick={()=>setShowPreview((v)=>!v)}>성장 방향 미리보기</button></div></section>
{showPreview?<section className='summary-card growth-preview'><h3>현재 성장 방향</h3><ol>{endingPreview.map((e,i)=><li key={e.id}>{i+1}. {endingLabelMap[e.id]??'아직 이름 붙이기 어려운 방향'}</li>)}</ol></section>:null}
<section className='log-card memory-notes'><h3>동하의 기억</h3>{memoryPreview.length===0?<p>아직 특별한 기억은 없습니다.</p>:memoryPreview.map((m)=>{const memoryEventKey = eventKeyFromMemory(m); const memoryImagePath = memoryEventKey ? `/assets/dongha/events/${memoryEventKey}.png` : undefined; const hasFailedMemoryImage = failedMemoryImages[m.id]; const showMemoryImage = Boolean(memoryImagePath && !hasFailedMemoryImage); return <article key={`${m.id}-${m.week}`}>{showMemoryImage?<div className='memory-thumb memory-thumb-image-wrap'><img src={memoryImagePath} alt={`${m.title} 삽화`} onError={()=>{setFailedMemoryImages((prev)=>({ ...prev, [m.id]: true })); console.warn('[DonghaMaker] Memory thumbnail failed:', memoryImagePath);}} /></div>:<div className={`memory-thumb ${getMemoryVisualClass(m)}`} />}<div><p>[{m.age}살 · {m.season}]</p><strong>{m.title}</strong><p>{m.text}</p></div></article>;})}</section>
{activityModal?<section className='modal-backdrop'><article className={`modal-card ${activityModal.newMemories.length>0?'event':''}`}><p className='modal-eyebrow'>{activityModal.newMemories.length>0?'작은 사건':'오늘의 장면'}</p><h4>{activityModal.scheduleName}</h4>{activityModal.newMemories.length>0?<div className='event-illustration'>{activityModal.eventIllustrationKey&&!eventImageFailed?<img src={`/assets/dongha/events/${activityModal.eventIllustrationKey}.png`} alt='' onError={(e)=>{const failedPath=(e.currentTarget as HTMLImageElement).src; console.warn('[event-illustration] failed to load', failedPath); setEventImageFailed(true);}}/>:<div className='event-fallback'><small>이벤트 삽화</small></div>}</div>:null}<p className='scene-text'>{activityModal.sceneText}</p>{activityModal.newMemories[0]?<p className='new-memory'>새로운 기억이 생겼습니다. “{activityModal.newMemories[0].title}”</p>:null}<button className='run-button' onClick={()=>setActivityModal(null)}>확인</button></article></section>:null}
{reportText?<section className='summary-card'><h3>지난 4주 성장 리포트</h3><p>{reportText}</p></section>:null}{state.milestoneHistory.length>0?<section className='summary-card'><h3>성장 기록</h3><p>{state.milestoneHistory.slice(0,3).join(' · ')}</p></section>:null}{state.discoveredCombos.length>0?<section className='summary-card'><h3>발견한 성장 패턴</h3><p>{state.discoveredCombos.join(', ')}</p></section>:null}{import.meta.env.DEV?<aside className='dev-image-panel'><strong>이미지 체크</strong><ul>{devImageTargets.map((src)=><li key={src}><span>{src.split('/').pop()}</span><em>{devImageStatus[src]??'...'}</em></li>)}</ul></aside>:null}
</main>;
}
