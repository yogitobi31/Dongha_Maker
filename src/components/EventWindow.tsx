import { OrnatePanel } from './OrnatePanel';

export function EventWindow({ title, location, description }: { title: string; location: string; description: string }) {
  return (
    <OrnatePanel title="이번 주 장면" className="event-window">
      <div className="event-window__image" />
      <p className="event-window__title">{title}</p>
      <p className="event-window__meta">{location}</p>
      <p>{description}</p>
    </OrnatePanel>
  );
}
