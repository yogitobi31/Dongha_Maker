import { OrnatePanel } from './OrnatePanel';

export function EventWindow({ text }: { text: string }) {
  return <OrnatePanel title="이번 주 장면" className="event-window"><div className="event-window__image" /><p>{text}</p></OrnatePanel>;
}
