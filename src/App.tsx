import { useState } from 'react';
import { GameShell } from './components/GameShell';
import { OrnatePanel } from './components/OrnatePanel';
import { RetroButton } from './components/RetroButton';
import { PrologueScene } from './components/PrologueScene';
import { TitleScene } from './components/TitleScene';
import { ACTIVITIES } from './data/activities';
import { ENDINGS } from './data/endings';
import { applyActivity, createInitialState } from './game/engine';
import { loadGame, saveGame } from './game/storage';
import type { GameState } from './game/types';

type Scene = 'title' | 'prologue' | 'game' | 'memoryAlbum' | 'endingAlbum' | 'settings';

const SAVE_KEY = 'dongha-save';

function RetroPlaceholder({ title, text, onBack }: { title: string; text: string; onBack: () => void }) {
  return (
    <div className="game-wrap">
      <div className="game-shell scene-shell">
        <header className="game-title">{title}</header>
        <div className="scene-shell__content">
          <OrnatePanel title={title}>
            <p className="scene-shell__text">{text}</p>
            <RetroButton onClick={onBack}>타이틀로 돌아가기</RetroButton>
          </OrnatePanel>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scene, setScene] = useState<Scene>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [screen, setScreen] = useState<'schedule' | 'result' | 'event' | 'ending'>('schedule');
  const [selectedAction, setSelectedAction] = useState<string>('schedule');
  const [dialogue, setDialogue] = useState('새로운 1년이 시작됩니다. 오늘의 선택이 동하의 내일을 조금씩 바꿔 갈 거예요.');
  const [titleMessage, setTitleMessage] = useState('');

  const onPick = (id: string) => {
    setSelectedAction(id);
    const result = applyActivity(state, id);
    setState(result.state);
    saveGame(result.state);

    if (result.state.ended) {
      const ending = ENDINGS.find((e) => e.id === result.state.endingId);
      setDialogue(ending?.summary ?? '동하의 1년이 마무리되었습니다.');
      setScreen('ending');
      return;
    }

    if (result.event) {
      setDialogue(result.event.title);
      setScreen('event');
      return;
    }

    const pickedActivity = (result as { activity?: { resultTexts: string[]; name: string } }).activity;
    const activityText = pickedActivity ? pickedActivity.resultTexts[0] ?? `${pickedActivity.name}을(를) 진행했습니다.` : '일정을 진행했습니다.';
    setDialogue(activityText);
    setScreen('result');
  };

  const handleTitleSelect = (action: 'newGame' | 'continue' | 'memoryAlbum' | 'endingAlbum' | 'settings') => {
    if (action === 'newGame') {
      const hasSave = Boolean(localStorage.getItem(SAVE_KEY));
      if (hasSave && !window.confirm('기존 저장 기록이 있습니다. 새 게임을 시작할까요?')) return;
      const initial = createInitialState();
      setState(initial);
      saveGame(initial);
      setDialogue('새로운 1년이 시작됩니다. 오늘의 선택이 동하의 내일을 조금씩 바꿔 갈 거예요.');
      setScreen('schedule');
      setScene('prologue');
      setTitleMessage('');
      return;
    }

    if (action === 'continue') {
      const hasSave = Boolean(localStorage.getItem(SAVE_KEY));
      if (!hasSave) {
        setTitleMessage('저장된 게임이 없습니다.');
        return;
      }
      const loaded = loadGame();
      setState(loaded);
      setDialogue('저장된 기록을 불러왔습니다.');
      setScreen('schedule');
      setScene('game');
      setTitleMessage('');
      return;
    }

    setScene(action);
    setTitleMessage('');
  };

  if (scene === 'title') return <TitleScene onSelect={handleTitleSelect} message={titleMessage} />;
  if (scene === 'prologue') return <PrologueScene onStart={() => setScene('game')} />;
  if (scene === 'memoryAlbum') return <RetroPlaceholder title="추억 앨범" text="아직 기록된 추억이 없습니다." onBack={() => setScene('title')} />;
  if (scene === 'endingAlbum') return <RetroPlaceholder title="엔딩 앨범" text="아직 해금된 엔딩이 없습니다." onBack={() => setScene('title')} />;
  if (scene === 'settings') return <RetroPlaceholder title="설정" text="사운드, 텍스트 속도, 저장 데이터 초기화 메뉴는 추후 제공됩니다." onBack={() => setScene('title')} />;

  return <GameShell state={state} screen={screen} selectedAction={selectedAction} dialogue={dialogue} onPick={onPick} onStart={() => { const loaded = loadGame(); setState(loaded); setDialogue('저장된 기록에서 다음 일정을 준비합니다.'); }} onNew={() => { setState(createInitialState()); setSelectedAction('schedule'); setDialogue('새로운 1년이 시작됩니다. 오늘의 선택이 동하의 내일을 조금씩 바꿔 갈 거예요.'); }} onNext={() => setScreen('schedule')} />;
}
