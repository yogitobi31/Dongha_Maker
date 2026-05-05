import { useMemo, useState } from 'react';
import { ENDINGS } from '../data/gameData';
import { applyActivity, createInitialState, getMonthlyLogs } from '../game/engine';
import { loadGame, saveGame } from '../game/storage';
import type { GameState } from '../game/types';
import { GameShell } from './GameShell';

export function GameApp() {
  const [screen, setScreen] = useState<'title'|'status'|'schedule'|'result'|'event'|'report'|'ending'|'album'>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [lastResult, setLastResult] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const ending = useMemo(() => ENDINGS.find((e) => e.id === state.endingId), [state.endingId]);

  const start = () => { const s = loadGame(); setState(s); setScreen('status'); };
  const reset = () => { const s = createInitialState(); setState(s); saveGame(s); setScreen('title'); };
  const pick = (id: string) => {
    setSelectedAction(id);
    const next = applyActivity(state, id);
    saveGame(next);
    setState(next);
    setLastResult(`${id} 활동 완료.`);
    setScreen(next.ended ? 'ending' : next.slot === 1 ? 'report' : 'result');
  };

  const dialogue =
    screen === 'title' ? '새로운 12개월 육성이 당신을 기다립니다.' :
    screen === 'status' ? `${state.month}월 ${state.slot}주차, 오늘의 계획을 정하세요.` :
    screen === 'schedule' ? '행동을 선택하면 즉시 결과가 반영됩니다.' :
    screen === 'result' ? lastResult :
    screen === 'event' ? (state.hidden.fatigue > 70 ? '피곤함이 몰려옵니다. 잠시 쉬어가세요.' : '잔잔한 하루가 지나갑니다.') :
    screen === 'report' ? `${state.month - 1}월 리포트: ${getMonthlyLogs(state, state.month - 1).join(' / ') || '기록 없음'}` :
    screen === 'ending' ? `엔딩 도달: ${ending?.name ?? ''}` :
    `엔딩 앨범: ${state.endingsUnlocked.map((e)=> ENDINGS.find((x)=>x.id===e)?.name).join(', ')}`;

  const next = () => {
    if (screen === 'title') setScreen('status');
    else if (screen === 'status') setScreen('schedule');
    else if (screen === 'result') setScreen('event');
    else if (screen === 'event') setScreen('status');
    else if (screen === 'report') setScreen('status');
    else if (screen === 'ending') setScreen('album');
    else if (screen === 'album') setScreen('title');
  };

  return <GameShell state={state} screen={screen} selectedAction={selectedAction} onPick={pick} onStart={start} onNew={reset} onNext={next} dialogue={dialogue} />;
}
