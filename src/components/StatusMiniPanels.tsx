import type { GameState } from '../game/types';
import { OrnatePanel } from './OrnatePanel';

export function StatusMiniPanels({ state, screen }: { state: GameState; screen: string }) {
  const lastLog = state.logs.length > 0 ? state.logs[state.logs.length - 1] : '기록 없음';
  const rank = state.month > 8 ? '상급생' : '수련생';
  const condition = state.hidden.fatigue > 70 ? '피로' : '양호';

  return (
    <OrnatePanel title="상태 요약" className="mini-panels">
      <p>용돈: {state.stats.social + 10}G</p>
      <p>행복도: {state.stats.emotion}</p>
      <p>랭크: {rank}</p>
      <p>컨디션: {condition}</p>
      <p>최근 기록: {lastLog}</p>
      <p>현재 상태: {screen}</p>
    </OrnatePanel>
  );
}
