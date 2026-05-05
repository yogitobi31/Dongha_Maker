import { RetroButton } from './RetroButton';

export function PrologueScene({ onStart }: { onStart: () => void }) {
  return (
    <div className="prologue-wrap">
      <section className="prologue-scene" aria-label="프롤로그">
        <div className="prologue-scene__cg" />
        <div className="prologue-scene__vignette" />
        <div className="prologue-dialogue">
          <p>오늘부터 당신은 동하의 1년을 함께하게 됩니다.</p>
          <p>공부를 시킬 수도 있고, 쉬게 할 수도 있고, 친구들과 놀게 할 수도 있습니다.</p>
          <p>어떤 선택은 작은 추억이 되고, 어떤 선택은 동하의 미래를 바꿉니다.</p>
          <p>그리고 어쩌면, 희선이가 오래 기억할 동하의 모습이 만들어질지도 모릅니다.</p>
          <RetroButton onClick={onStart}>시작하기</RetroButton>
        </div>
      </section>
    </div>
  );
}
