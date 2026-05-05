import { ACTIVITIES } from '../data/gameData';
import { OrnatePanel } from './OrnatePanel';
import { RetroButton } from './RetroButton';

const labels = ['수업','외출','게임','희선과 데이트','친구들과 놀기','휴식','알바','일정확인'];

export function ActionPanel({ onPick, selected }: { onPick: (id: string) => void; selected: string }) {
  return <OrnatePanel title="행동 선택" className="action-panel">
    <div className="action-grid">{ACTIVITIES.map((a, i) => <RetroButton key={a.id} onClick={() => onPick(a.id)}>{labels[i] ?? a.name}</RetroButton>)}</div>
    <p className="action-selected">선택된 일정: {selected || '없음'}</p>
  </OrnatePanel>;
}
