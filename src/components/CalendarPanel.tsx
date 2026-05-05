import { ACTIVITIES } from '../data/activities';
import { OrnatePanel } from './OrnatePanel';

export function CalendarPanel({ month, slot, selectedAction }: { month: number; slot: number; selectedAction: string }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const currentDay = (slot - 1) * 7 + 1;
  const selectedLabel = ACTIVITIES.find((activity) => activity.id === selectedAction)?.name ?? selectedAction;
  return (
    <OrnatePanel title="달력 / 일정" className="calendar-panel">
      <p className="calendar-panel__headline">{month}월 · {slot}주차</p>
      <p className="calendar-panel__remain">남은 기간: {Math.max(0, 12 - month + 1)}개월</p>
      <div className="calendar-grid">{days.map((d) => <div key={d} className={`calendar-cell ${d === currentDay ? 'is-today' : ''}`}>{d}</div>)}</div>
      <p className="calendar-panel__today">오늘의 일정: {selectedLabel || '미선택'}</p>
    </OrnatePanel>
  );
}
