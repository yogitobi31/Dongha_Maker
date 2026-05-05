export function DialogueBox({ speaker, text }: { speaker: string; text: string }) {
  return <section className="dialogue-box">
    <div className="dialogue-box__portrait">◈</div>
    <div className="dialogue-box__content"><p className="dialogue-box__name">{speaker}</p><p>{text}</p></div>
    <div className="dialogue-box__next">▶</div>
  </section>;
}
