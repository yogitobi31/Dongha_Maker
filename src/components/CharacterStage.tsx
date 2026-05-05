export function CharacterStage({ action }: { action: string }) {
  return (
    <section className="character-stage">
      <div className="character-stage__bg" />
      <div className="character-stage__window" />
      <div className="character-stage__desk" />
      <div className="character-stage__avatar">
        <div className="character-stage__halo" />
        <div className="character-stage__hair" />
        <div className="character-stage__face" />
        <div className="character-stage__uniform" />
      </div>
      <div className="character-stage__nameplate">동하</div>
      <div className="character-stage__status">
        <p>컨디션: 안정</p>
        <p>현재 행동: {action || '대기 중'}</p>
      </div>
    </section>
  );
}
