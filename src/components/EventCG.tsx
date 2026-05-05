import { useMemo, useState } from 'react';

type EventData = {
  title: string;
  location: string;
  character?: string;
  illustrationId?: string;
  description?: string;
};

const sceneByLocation = (location: string) => {
  if (location.includes('PC')) return 'pc';
  if (location.includes('빵')) return 'bakery';
  if (location.includes('강변') || location.includes('공원')) return 'sunset';
  return 'study';
};

export function EventCG({ event }: { event: EventData }) {
  const [imageError, setImageError] = useState(false);
  const src = `/assets/events/${event.illustrationId ?? 'prologue-room'}.png`;
  const sceneTone = useMemo(() => sceneByLocation(event.location), [event.location]);

  return (
    <div className="event-cg frame">
      <h3>{event.title}</h3>
      <p>{event.location}{event.character ? ` · ${event.character}` : ''}</p>
      <p className="event-cg__description">{event.description ?? '장면의 공기가 조용히 흘러간다.'}</p>
      {!imageError ? (
        <img src={src} alt={event.title} onError={() => setImageError(true)} />
      ) : (
        <div className={`cg-fallback cg-fallback--${sceneTone}`}>
          <div className="cg-fallback__light" />
          <div className="cg-fallback__prop" />
          <div className="cg-fallback__caption">그날의 장면</div>
        </div>
      )}
    </div>
  );
}
