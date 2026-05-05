export function CharacterStage({ action }: { action: string }) {
  return <section className="character-stage">
    <div className="character-stage__bg" />
    <div className="character-stage__window" />
    <div className="character-stage__desk" />
    <div className="character-stage__avatar">
      <div className="character-stage__silhouette" />
      <div className="character-stage__nameplate">동하</div>
      <p>컨디션: 안정</p>
      <p>현재 행동: {action || '대기 중'}</p>
    </div>
  </section>;
}
