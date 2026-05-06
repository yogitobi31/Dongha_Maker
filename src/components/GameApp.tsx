import { useMemo, useState } from 'react';
import { ENDINGS } from '../data/endings';
import { applyActivity, createInitialState, endWeek, getDateLabel } from '../game/engine';
import { loadGame, saveGame } from '../game/storage';
import type { GameState, ScheduleId } from '../game/types';
import { MemoryAlbum } from './MemoryAlbum';

const ACTION_VARIANTS: Record<ScheduleId, string[]> = {
  speech: ['또박또박 말 흉내 내기', '새 단어 소리 내보기', '짧은 문장 따라 말하기'],
  storybook: ['조용히 책 읽기', '그림책 한 장 오래 보기', '영어 문장 분석하기'],
  blocks: ['블록으로 작은 탑 쌓기', '작은 게임 아이디어 적기', '퍼즐처럼 구조 만들기'],
  walk: ['친구와 수다 떨기', '산책길에서 관찰하기', '미니필업이들과 시간 보내기'],
  nap: ['깊게 한숨 쉬며 쉬기', '짧게 낮잠 자기', '조용히 눈 감고 회복하기'],
  toy: ['Unreal Engine 만져보기', '장난감으로 상상 실험하기', '이상한 상상 해보기'],
  family: ['희선과 이야기하기', '가족과 느긋한 시간 보내기', '따뜻한 말 듣기'],
  daydream: ['창밖 보며 멍 때리기', '떠오른 생각 한 줄 적기', '철학적 질문 떠올리기']
};

const WEEKLY_POOL: ScheduleId[] = ['storybook', 'blocks', 'walk', 'nap', 'toy', 'family', 'daydream', 'speech'];
const GROWTH_PATTERN_MAP: Record<string, { label: string; description: string }> = {
  exercise_social: { label: '함께 뛴 시간', description: '몸을 움직이며 사람들과 가까워진 성장의 흔적' },
  routine_focus: { label: '집중의 리듬', description: '반복되는 일상 속에서 차분히 집중력이 쌓인 순간' },
  creative_social: { label: '상상의 대화', description: '친구와 엉뚱한 생각을 나누며 창의성이 자란 순간' },
  observe_curiosity: { label: '관찰의 눈', description: '세상을 유심히 바라보며 호기심이 깊어진 순간' },
  study_rest: { label: '쉼표 공부', description: '쉬어가며 다시 공부 감각을 회복한 순간' },
  curiosity_study: { label: '궁금한 배움', description: '궁금해서 스스로 파고들며 배움이 깊어진 순간' },
  music_emotion: { label: '음악의 감정', description: '음악을 통해 마음의 결을 느끼고 표현한 순간' },
  rest_emotion: { label: '마음의 휴식', description: '쉬는 시간 속에서 감정이 차분히 정리된 순간' },
  emotion_bond: { label: '이어진 마음', description: '누군가와 마음이 가까워진 관계의 순간' }
};
const MINI_EVENTS = [
  '희선이 동하의 낙서를 보고 웃었다.',
  '현준이 뜬금없이 철학적인 질문을 던졌다.',
  '소은이 벌레 이야기를 하자 동하가 움찔했다.',
  '경민이 노래를 흥얼거리자 분위기가 부드러워졌다.',
  '효원이 장난스러운 표정으로 동하를 바라봤다.',
  '찬영이 조용히 동하를 응원해줬다.',
  '주원쌤이 동하에게 짧은 조언을 건넸다.'
] as const;

function pickWeeklyOptions(state: GameState): ScheduleId[] {
  const base = (state.player.week + state.player.season + state.player.age) % WEEKLY_POOL.length;
  return [WEEKLY_POOL[base], WEEKLY_POOL[(base + 2) % WEEKLY_POOL.length], WEEKLY_POOL[(base + 5) % WEEKLY_POOL.length]];
}

function growthDirectionText(state: GameState) {
  const s = state.stats;
  if (s.창의력 >= 40 && s.집중력 >= 32) return '몰입형 개발자';
  if (s.호기심 >= 38 && s.창의력 >= 34) return '탐구형 창작자';
  if (s.사회성 >= 34 && s.감수성 >= 34) return '따뜻한 리더';
  if (s.감수성 >= 38 && s.호기심 >= 34) return '철학적 사색가';
  return '장난기 많은 발명가';
}
function weeklyRecommendation(state: GameState) {
  if (state.fatigue >= 24) return '동하는 피로가 조금 쌓여 있어요. 이번 주는 무리한 몰입보다 감정 회복이나 가벼운 관계 장면이 좋아 보여요.';
  if (state.stats.호기심 >= 35) return '호기심이 높아진 상태예요. 새로운 관찰이나 배움 장면을 고르면 좋은 성장이 일어날 수 있어요.';
  if (state.stats.사회성 < 26) return '요즘은 혼자 있는 시간이 길었어요. 누군가와 연결되는 순간을 고르면 균형이 좋아질 거예요.';
  return '지금은 안정적인 흐름이에요. 집중과 휴식을 한 번씩 섞어 성장의 리듬을 만들어 보세요.';
}
function repeatNarrative(id: ScheduleId, count: number) {
  const family = id === 'speech' || id === 'storybook' || id === 'blocks' ? 'study' : id === 'walk' || id === 'family' ? 'social' : id === 'nap' ? 'rest' : 'creative';
  if (count <= 1) return family === 'study' ? '동하는 새로운 걸 배우는 게 재밌어 보였다.' : '동하는 오늘 장면에 금방 몰입했다.';
  if (count === 2) return family === 'study' ? '동하는 익숙한 흐름으로 해냈지만, 표정에 작은 피로가 스쳤다.' : '익숙해진 만큼 자연스러웠지만, 조금은 루틴처럼 느껴졌다.';
  return '오늘 동하는 잠깐 멈춰 창밖을 바라봤다. 다음 주에는 다른 결의 장면이 필요해 보인다.';
}

function statusTags(state: GameState) {
  const tags: string[] = [];
  if (state.stats.호기심 >= 35) tags.push('호기심이 높음');
  if (state.fatigue >= 25) tags.push('피로가 조금 쌓임');
  if (state.stats.창의력 >= 30) tags.push('창의성이 성장 중');
  if (state.stress >= 25) tags.push('마음이 예민해짐');
  if (tags.length === 0) tags.push('안정적으로 성장 중');
  return tags.slice(0, 3);
}

export function GameApp() {
  const [state, setState] = useState<GameState>(createInitialState());
  const [screen, setScreen] = useState<'schedule' | 'result' | 'ending' | 'album'>('schedule');
  const [showDetails, setShowDetails] = useState(false);
  const [last, setLast] = useState<any>(null);
  const ending = useMemo(() => ENDINGS.find((e) => e.id === state.endingId), [state.endingId]);

  const weeklyOptions = useMemo(() => pickWeeklyOptions(state), [state]);
  const weekNumber = (state.player.age - 1) * 16 + state.player.season * 4 + state.player.week;
  const eventLine = weekNumber % 4 === 0 ? MINI_EVENTS[(weekNumber / 4) % MINI_EVENTS.length] : null;

  const pick = (id: ScheduleId) => {
    const repeatCount = (state.recentActions ?? []).filter((v) => v === id).length + 1;
    const result = applyActivity({ ...state, actionsLeft: 1 }, id);
    const advanced = endWeek({ ...result.state, actionsLeft: 0 });
    advanced.selectedGrowthDirection = growthDirectionText(advanced);
    advanced.recentActions = [...(state.recentActions ?? []), id].slice(-8);
    saveGame(advanced);
    setState(advanced);
    const growthCode = (advanced.discoveredCombos ?? [])[advanced.discoveredCombos.length - 1];
    const mappedPattern = growthCode ? GROWTH_PATTERN_MAP[growthCode] : null;
    setLast({ ...result, chosenId: id, eventLine, mappedPattern, repeatLine: repeatNarrative(id, repeatCount), monthly: weekNumber % 4 === 0 });
    setScreen(advanced.ended ? 'ending' : 'result');
  };

  if (screen === 'schedule') {
    return <main className='main-page'>
      <section className='top-card status-hero'>
        <p className='date'>{getDateLabel(state)} · 이번 주 할 일 1개 선택</p>
        <h2>이번 주 동하 상태 카드</h2>
        {statusTags(state).map((t) => <p key={t} className='hero-line'>• {t}</p>)}
      </section>

      <section className='schedule-card'>
        <h3>이번 주, 어떤 순간을 함께할까?</h3>
        <p>{weeklyRecommendation(state)}</p>
        <div className='schedule-list'>
          {weeklyOptions.map((id) => {
            const label = ACTION_VARIANTS[id][(weekNumber + id.length) % ACTION_VARIANTS[id].length];
            return <button className='schedule-item' key={id} onClick={() => pick(id)}><strong>{label}</strong></button>;
          })}
        </div>
      </section>

      <section className='summary-card'>
        <p><strong>현재 성장 방향:</strong> {growthDirectionText(state)} 쪽으로 자라고 있어요.</p>
        <button onClick={() => setShowDetails((v) => !v)}>{showDetails ? '자세히 닫기' : '자세히 보기'}</button>
        {showDetails && <div className='stats-grid'>{Object.entries(state.stats).map(([k, v]) => <article key={k} className='stat-card'><div className='stat-head'><b>{k}</b><span>{v}</span></div></article>)}</div>}
      </section>

      <section className='log-card'>
        <button onClick={() => { const s = loadGame(); setState(s); }}>불러오기</button>
        <button onClick={() => { const s = createInitialState(); setState(s); }}>새 게임</button>
        <button onClick={() => setScreen('album')}>추억 앨범</button>
      </section>
    </main>;
  }

  if (screen === 'result' && last) {
    return <main className='main-page'>
      <section className='modal-card event'>
        <p className='modal-eyebrow'>결과 카드</p>
        <h4>{last.scheduleName}</h4>
        <p className='scene-text'>{last.resultSceneText}</p>
        <p>{last.summary}</p>
        <p>{last.repeatLine}</p>
        <ul>{last.resultLines.slice(0, 4).map((d: string, i: number) => <li key={i}>{d}</li>)}</ul>
        {last.mappedPattern && <div className='new-memory'>
          <strong>이번 주 성장의 흔적</strong>
          <p><b>{last.mappedPattern.label}</b></p>
          <p>{last.mappedPattern.description}</p>
        </div>}
        <p><strong>성장 해석:</strong> 동하는 {growthDirectionText(state)} 쪽으로 조금 가까워졌다.</p>
        {last.eventLine && <p className='new-memory'>{last.eventLine}</p>}
        {last.monthly && <div className='new-memory'>
          <strong>첫 달의 동하</strong>
          <p>동하는 이번 달 동안 작은 장면들을 통해 자기만의 리듬을 만들기 시작했다.</p>
          <p>무리하지 않는 선택일수록 다음 성장의 방향이 또렷해졌다.</p>
          <p><b>현재 성장 방향</b>: {growthDirectionText(state)}</p>
          <p><b>다음 달 추천</b>: {weeklyRecommendation(state)}</p>
        </div>}
      </section>
      <button className='run-button' onClick={() => setScreen('schedule')}>다음 주로</button>
    </main>;
  }

  if (screen === 'album') return <div><MemoryAlbum items={state.memoryAlbum} /><button onClick={() => setScreen('schedule')}>돌아가기</button></div>;

  return <div><h1>{ending?.title ?? '성장 엔딩'}</h1><p>{ending?.summary}</p><button onClick={() => setState(createInitialState())}>다시 키우기</button></div>;
}
