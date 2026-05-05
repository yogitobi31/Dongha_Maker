import { ACTIVITIES } from '../data/activities';
import { OrnatePanel } from './OrnatePanel';
import { RetroButton } from './RetroButton';

export function ActionPanel({ onPick, selected }: { onPick: (id: string) => void; selected: string }) {
  const selectedName = ACTIVITIES.find((activity) => activity.id === selected)?.name ?? selected;

  return <OrnatePanel title="행동 선택" className="action-panel">
    <div className="action-grid">{ACTIVITIES.map((activity) => <RetroButton key={activity.id} onClick={() => onPick(activity.id)}>{activity.name}</RetroButton>)}</div>
    <p className="action-selected">선택된 일정: {selectedName || '없음'}</p>
  </OrnatePanel>;
}
