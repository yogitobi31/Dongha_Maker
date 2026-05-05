import { RetroButton } from './RetroButton';

type TitleAction = 'newGame' | 'continue' | 'memoryAlbum' | 'endingAlbum' | 'settings';

export function TitleScene({ onSelect, message }: { onSelect: (action: TitleAction) => void; message?: string }) {
  return (
    <div className="title-wrap">
      <div className="title-scene">
        <div className="title-scene__sky" />
        <div className="title-scene__room" />
        <div className="title-scene__window" />
        <div className="title-scene__desk" />
        <div className="title-scene__album" />
        <div className="title-scene__standing" />

        <header className="title-header">
          <p className="title-header__eyebrow">CLASSIC TRAINING SIMULATION</p>
          <h1>동하키우기</h1>
          <p className="title-header__subtitle">희선이를 위한 1년의 성장 시뮬레이션</p>
        </header>

        <nav className="title-menu" aria-label="타이틀 메뉴">
          <RetroButton onClick={() => onSelect('newGame')}>새 게임</RetroButton>
          <RetroButton onClick={() => onSelect('continue')}>이어하기</RetroButton>
          <RetroButton onClick={() => onSelect('memoryAlbum')}>추억 앨범</RetroButton>
          <RetroButton onClick={() => onSelect('endingAlbum')}>엔딩 앨범</RetroButton>
          <RetroButton onClick={() => onSelect('settings')}>설정</RetroButton>
        </nav>

        <p className="title-footer">오늘의 선택이, 동하의 1년을 바꿉니다.</p>
        {message ? <p className="title-message">{message}</p> : null}
      </div>
    </div>
  );
}
