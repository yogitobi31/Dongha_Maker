import type { GameState } from '../game/types';
import { ActionPanel } from './ActionPanel';
import { CalendarPanel } from './CalendarPanel';
import { CharacterStage } from './CharacterStage';
import { DialogueBox } from './DialogueBox';
import { EventWindow } from './EventWindow';
import { OrnatePanel } from './OrnatePanel';
import { RetroButton } from './RetroButton';
import { StatPanel } from './StatPanel';
import { StatusMiniPanels } from './StatusMiniPanels';

export function GameShell({ state, screen, selectedAction, onPick, onStart, onNew, onNext, dialogue }: {
  state: GameState; screen: string; selectedAction: string; onPick: (id: string) => void; onStart: () => void; onNew: () => void; onNext: () => void; dialogue: string;
}) {
  const eventTitle = selectedAction === 'schedule' ? '첫 번째 봄' : '이번 주 기록';
  const eventLocation = selectedAction === 'schedule' ? '동하의 방' : '활동 장소';
  const eventDescription = selectedAction === 'schedule'
    ? '책상 위에는 새 공책과 아직 쓰지 않은 계획표가 놓여 있다.'
    : dialogue;

  return <div className="game-wrap"><div className="game-shell"><header className="game-title">동하키우기</header>
    <div className="shell-left"><CalendarPanel month={state.month} slot={state.period} selectedAction={selectedAction} />{screen === 'schedule' && <ActionPanel onPick={onPick} selected={selectedAction} />}
      <OrnatePanel title="시스템"><RetroButton onClick={onStart}>불러오기/시작</RetroButton><RetroButton onClick={onNew}>새 게임</RetroButton><RetroButton onClick={onNext}>진행</RetroButton></OrnatePanel></div>
    <div className="shell-center"><CharacterStage action={selectedAction} /><EventWindow title={eventTitle} location={eventLocation} description={eventDescription} /></div>
    <div className="shell-right"><StatPanel state={state} /><StatusMiniPanels state={state} screen={screen} /></div>
    <div className="shell-bottom"><DialogueBox speaker="안내" text={dialogue} /></div>
  </div></div>;
}
