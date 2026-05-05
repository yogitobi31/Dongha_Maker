import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ACTIVITIES } from '../data/activities';
import { ENDINGS } from '../data/endings';
import { applyActivity, createInitialState } from './engine';
import { loadGame, saveGame } from './storage';
import type { GameState } from './types';
import type { Activity } from '../data/activities';

type Screen = 'schedule' | 'result' | 'event' | 'ending';

type GameContextValue = {
  state: GameState;
  screen: Screen;
  selectedAction: string;
  dialogue: string;
  onPick: (id: string) => void;
  onStart: () => void;
  onNew: () => void;
  onNext: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState());
  const [screen, setScreen] = useState<Screen>('schedule');
  const [selectedAction, setSelectedAction] = useState<string>(ACTIVITIES[0]?.id ?? '');
  const [dialogue, setDialogue] = useState('동하의 하루를 계획해 주세요.');

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

    const activity = result.activity as Activity;
    if (result.event) {
      setDialogue(result.event.title);
      setScreen('event');
      return;
    }

    setDialogue(activity.resultTexts[0] ?? `${activity.name}을(를) 진행했습니다.`);
    setScreen('result');
  };

  const onStart = () => {
    const loaded = loadGame();
    setState(loaded);
    setDialogue('저장된 기록을 불러왔습니다.');
    setScreen('schedule');
  };

  const onNew = () => {
    setState(createInitialState());
    setDialogue('새로운 1년을 시작합니다.');
    setScreen('schedule');
  };

  const onNext = () => {
    if (screen === 'ending') {
      onNew();
      return;
    }
    setDialogue('다음 일정을 선택해 주세요.');
    setScreen('schedule');
  };

  const value = useMemo(
    () => ({ state, screen, selectedAction, dialogue, onPick, onStart, onNew, onNext }),
    [state, screen, selectedAction, dialogue],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
