import { useMemo, useState } from 'react';
import { ACTIVITIES, ENDINGS } from '../data/gameData';
import { applyActivity, createInitialState, getMonthlyLogs } from '../game/engine';
import { loadGame, saveGame } from '../game/storage';
import type { GameState } from '../game/types';

const card: React.CSSProperties = { background: '#fffdf7', borderRadius: 16, padding: 20, boxShadow: '0 10px 30px rgba(10,10,25,.08)', marginBottom: 16 };

export function GameApp() {
  const [screen, setScreen] = useState<'title'|'status'|'schedule'|'result'|'event'|'report'|'ending'|'album'>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [lastResult, setLastResult] = useState('');

  const ending = useMemo(() => ENDINGS.find((e) => e.id === state.endingId), [state.endingId]);

  const start = () => { const s = loadGame(); setState(s); setScreen('status'); };
  const pick = (id: string) => {
    const next = applyActivity(state, id);
    saveGame(next);
    setState(next);
    setLastResult(`${id} 활동 완료.`);
    setScreen(next.ended ? 'ending' : next.slot === 1 ? 'report' : 'result');
  };

  return <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'Pretendard, -apple-system, sans-serif', color: '#1f2a44', background: '#f4f2eb', minHeight: '100vh' }}>
    {screen === 'title' && <section style={card}><h1>《동하키우기》</h1><p>12개월 다이어리 육성 시뮬레이션</p><button onClick={start}>이어하기/시작하기</button></section>}
    {screen === 'status' && <section style={card}><h2>{state.month}월 상태</h2><p>슬롯: {state.slot}/3</p><button onClick={() => setScreen('schedule')}>일정 선택</button><button onClick={() => {setState(createInitialState()); saveGame(createInitialState());}}>새 게임</button></section>}
    {screen === 'schedule' && <section style={card}><h2>월간 일정 선택</h2>{ACTIVITIES.map(a => <button key={a.id} onClick={() => pick(a.id)} style={{display:'block', margin:'8px 0'}}>{a.name}</button>)}</section>}
    {screen === 'result' && <section style={card}><h2>활동 결과</h2><p>{lastResult}</p><button onClick={() => setScreen('event')}>이벤트 확인</button></section>}
    {screen === 'event' && <section style={card}><h2>이벤트</h2><p>{state.hidden.fatigue > 70 ? '피곤함이 몰려옵니다. 잠시 쉬어가세요.' : '잔잔한 하루가 지나갑니다.'}</p><button onClick={() => setScreen('status')}>상태로</button></section>}
    {screen === 'report' && <section style={card}><h2>{state.month - 1}월 리포트</h2><ul>{getMonthlyLogs(state, state.month - 1).map((l, i) => <li key={i}>{l}</li>)}</ul><button onClick={() => setScreen('status')}>다음 달</button></section>}
    {screen === 'ending' && <section style={card}><h2>엔딩 화면</h2><p>{ending?.name}</p><button onClick={() => setScreen('album')}>엔딩 앨범</button></section>}
    {screen === 'album' && <section style={card}><h2>엔딩 앨범</h2><ul>{state.endingsUnlocked.map((e)=> <li key={e}>{ENDINGS.find(x=>x.id===e)?.name}</li>)}</ul><button onClick={() => setScreen('title')}>타이틀로</button></section>}
  </div>;
}
