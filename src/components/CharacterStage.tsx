import { ACTIVITIES } from '../data/activities';
import { CharacterArtwork } from './CharacterArtwork';

const ACTION_LABELS: Record<string, string> = {
  schedule: '일정 선택 중',
  idle: '대기 중'
};

export function CharacterStage({ action }: { action: string }) {
  const actionLabel = ACTION_LABELS[action] ?? ACTIVITIES.find((activity) => activity.id === action)?.name ?? '대기 중';
  const locationLabel = action === 'pcbang' ? 'PC방' : action === 'english' ? '동하의 방' : '학원 교실';

  return (
    <section className="character-stage">
      <div className="character-stage__bg" />
      <div className="character-stage__window" />
      <div className="character-stage__desk" />
      <CharacterArtwork characterId="dongha" mood={action === 'english' ? 'focused' : 'neutral'} variant="standing" className="character-stage__art" label="현재 모습" />
      <div className="character-stage__nameplate">◆ 동하</div>
      <div className="character-stage__status">
        <p>컨디션: 안정적인 집중 상태</p>
        <p>현재 행동: {actionLabel}</p>
        <p>오늘의 일정: {action === 'schedule' ? '아직 선택하지 않음' : actionLabel}</p>
        <p>장소 분위기: {locationLabel}</p>
      </div>
    </section>
  );
}
