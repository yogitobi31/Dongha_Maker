import type { GameState } from '../game/types';
import { ActionPanel } from './ActionPanel';
import { CalendarPanel } from './CalendarPanel';
import { CharacterStage } from './CharacterStage';
import { DialogueBox } from './DialogueBox';
import { EventWindow } from './EventWindow';
import { OrnatePanel } from './OrnatePanel';
import { RetroButton } from './RetroButton';
import { StatPanel } from './StatPanel';

export function GameShell({ state, screen, selectedAction, onPick, onStart, onNew, onNext, dialogue }: {
  state: GameState; screen: string; selectedAction: string; onPick: (id: string) => void; onStart: () => void; onNew: () => void; onNext: () => void; dialogue: string;
}) {
  return <div className="game-wrap"><div className="game-shell"><header className="game-title">동하키우기</header>
    <div className="shell-left"><CalendarPanel month={state.month} slot={state.period} selectedAction={selectedAction} />{screen === 'schedule' && <ActionPanel onPick={onPick} selected={selectedAction} />}
      <OrnatePanel title="시스템"><RetroButton onClick={onStart}>불러오기/시작</RetroButton><RetroButton onClick={onNew}>새 게임</RetroButton><RetroButton onClick={onNext}>진행</RetroButton></OrnatePanel></div>
    <div className="shell-center"><CharacterStage action={selectedAction} />{(screen === 'event' || screen === 'result') && <EventWindow text={dialogue} />}</div>
    <div className="shell-right"><StatPanel state={state} /><OrnatePanel title="상태 요약" className="mini-panels"><p>용돈: {state.stats.social + 10}G</p><p>행복도: {state.stats.emotion}</p><p>랭크: {state.month > 8 ? '상급생' : '수련생'}</p><p>컨디션: {state.hidden.fatigue > 70 ? '피로' : '양호'}</p><p>최근 기록: {state.logs.length > 0 ? state.logs[state.logs.length - 1] : undefined}</p><p>현재 상태: {screen}</p></OrnatePanel></div>
    <div className="shell-bottom"><DialogueBox speaker="안내" text={dialogue} /></div>
  </div></div>;
}
