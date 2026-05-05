import { ACTIVITIES } from '../data/activities';

export function CharacterStage({ action }: { action: string }) {
  const actionLabel = ACTIVITIES.find((activity) => activity.id === action)?.name ?? action;

  return (
    <section className="character-stage">
      <div className="character-stage__bg" />
      <div className="character-stage__window" />
      <div className="character-stage__desk" />
      <div className="character-stage__avatar">
        <div className="character-stage__halo" />
        <div className="character-stage__hair-back" />
        <div className="character-stage__head" />
        <div className="character-stage__hair-front" />
        <div className="character-stage__eye character-stage__eye--left" />
        <div className="character-stage__eye character-stage__eye--right" />
        <div className="character-stage__mouth" />
        <div className="character-stage__hood" />
        <div className="character-stage__uniform" />
        <div className="character-stage__arm character-stage__arm--left" />
        <div className="character-stage__arm character-stage__arm--right" />
      </div>
      <div className="character-stage__nameplate">◆ 동하</div>
      <div className="character-stage__status">
        <p>컨디션: 안정적인 집중 상태</p>
        <p>현재 행동: {actionLabel || '대기 중'}</p>
      </div>
    </section>
  );
}
