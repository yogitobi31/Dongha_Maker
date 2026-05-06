import { useMemo, useState } from 'react';
import { createAndSaveInitialGame, loadGame, saveGame } from './game/storage';
import { advanceWeek, createInitialState, getDateLabel, runWeek, schedules } from './game/engine';
import type { GameState, ScheduleId, StatName } from './game/types';
import { detectCombos } from './utils/growthEngine';

type WeeklyCard = { id: string; title: string; description: string; tags: string[]; scheduleId: ScheduleId };

const PATTERN_DISPLAY_MAP: Record<string, string> = {
  music_emotion: '음악의 감정',
  exercise_social: '함께 뛴 시간',
  emotion_bond: '이어진 마음',
  creative_social: '상상의 대화',
  rest_emotion: '마음의 휴식',
  routine_focus: '집중의 리듬',
  observe_curiosity: '관찰의 눈',
  study_rest: '쉼표 공부',
  curiosity_study: '궁금한 배움'
};

const sceneBySchedule: Record<ScheduleId, { title: string; desc: string; tags: string[] }> = {
  speech: { title: '그림책 속 말을 따라해보기', desc: '동하는 들은 소리를 자기 방식으로 따라 해보려 한다.', tags: ['배움', '호기심'] },
  storybook: { title: '그림책 한 장을 오래 바라보기', desc: '장면 하나를 붙잡고 오래 상상하는 시간이 생긴다.', tags: ['관찰', '감수성'] },
  blocks: { title: '블록으로 이상한 성 만들기', desc: '동하는 자기만의 규칙으로 새로운 모양을 쌓아 올린다.', tags: ['창의성', '집중'] },
  walk: { title: '바깥 공기 속 천천히 걷기', desc: '주변의 소리와 표정을 보며 사람과 세상을 느낀다.', tags: ['사회성', '관찰'] },
  nap: { title: '따뜻한 낮잠으로 숨 고르기', desc: '잠깐 쉬며 마음과 몸의 긴장을 푼다.', tags: ['회복', '안정'] },
  toy: { title: '장난감으로 작은 실험하기', desc: '익숙한 놀잇감을 새롭게 바꿔보며 놀고 싶어 한다.', tags: ['창의성', '몰입'] },
  family: { title: '가족과 조용한 시간 보내기', desc: '익숙한 품 안에서 마음의 안전함을 다시 채운다.', tags: ['애착', '감정'] },
  daydream: { title: '창밖을 보며 오래 상상하기', desc: '아무 말 없이 생각 속으로 멀리 떠나는 순간이 찾아온다.', tags: ['상상', '감수성'] }
};


const WEEKLY_SCENES: WeeklyCard[] = [
  { id: 'scene_speech', scheduleId: 'speech', title: '그림책 속 동물을 따라 말해보기', description: '동하는 들은 소리를 자기 방식으로 따라 해보려 한다.', tags: ['배움', '호기심'] },
  { id: 'scene_storybook', scheduleId: 'storybook', title: '그림책 한 장을 오래 바라보기', description: '장면 하나를 붙잡고 오래 상상하는 시간이 생긴다.', tags: ['관찰', '감수성'] },
  { id: 'scene_blocks', scheduleId: 'blocks', title: '블록으로 이상한 성 만들기', description: '동하는 자기만의 규칙으로 새로운 모양을 쌓아 올린다.', tags: ['창의성', '집중'] },
  { id: 'scene_walk', scheduleId: 'walk', title: '바깥 공기 속 천천히 걷기', description: '주변의 소리와 표정을 보며 사람과 세상을 느낀다.', tags: ['사회성', '관찰'] },
  { id: 'scene_nap', scheduleId: 'nap', title: '따뜻한 낮잠으로 숨 고르기', description: '잠깐 쉬며 마음과 몸의 긴장을 푼다.', tags: ['회복', '안정'] },
  { id: 'scene_toy', scheduleId: 'toy', title: '장난감으로 작은 실험하기', description: '익숙한 놀잇감을 새롭게 바꿔보며 놀고 싶어 한다.', tags: ['창의성', '몰입'] },
  { id: 'scene_family', scheduleId: 'family', title: '가족과 조용한 시간 보내기', description: '익숙한 품 안에서 마음의 안전함을 다시 채운다.', tags: ['애착', '감정'] },
  { id: 'scene_daydream', scheduleId: 'daydream', title: '창밖을 보며 오래 상상하기', description: '아무 말 없이 생각 속으로 멀리 떠나는 순간이 찾아온다.', tags: ['상상', '감수성'] }
];

const statFocus: StatName[] = ['창의력', '집중력', '사회성'];

const getPatternDisplayName = (id: string) => PATTERN_DISPLAY_MAP[id] ?? '새로운 성장의 흔적';

const dedupeMemories = (state: GameState) => {
  const seen = new Set<string>();
  return [...state.memories].reverse().filter((m) => {
    const key = `${m.id ?? ''}|${m.title}|${m.season}|${m.age}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const growthDirectionLine = (s: GameState) => {
  if (s.stats.창의력 >= 40 && s.stats.집중력 >= 36) return '동하는 자기만의 세계를 만드는 아이로 조금씩 자라고 있다.';
  if (s.stats.사회성 >= 34 && s.stats.감수성 >= 34) return '동하는 사람과 마음을 나누는 아이로 자라고 있다.';
  return '동하는 조용히 자기 리듬을 찾는 아이로 자라고 있다.';
};

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState());
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; lines: string[]; growth: string[]; sceneText: string } | null>(null);

  const weeklyCards = useMemo(() => { const i = (state.currentWeek + state.player.week + state.player.season) % WEEKLY_SCENES.length; return [WEEKLY_SCENES[i], WEEKLY_SCENES[(i+2)%WEEKLY_SCENES.length], WEEKLY_SCENES[(i+5)%WEEKLY_SCENES.length]]; }, [state.currentWeek, state.player.week, state.player.season]);
  const recentMemories = useMemo(() => dedupeMemories(state).slice(0, 3), [state.memories]);
  const recentPatterns = useMemo(() => [...new Set(state.discoveredCombos.slice(-6).map(getPatternDisplayName))].slice(-3), [state.discoveredCombos]);

  const pickScene = (card: WeeklyCard) => {
    const mapped = card.scheduleId;
    const run = runWeek(state, mapped);
    const grown = structuredClone(run.state);
    grown.recentActionTags = [...grown.recentActionTags, ...card.tags].slice(-12);
    const combos = detectCombos(grown.recentActionTags.slice(-8)).filter((c) => !grown.discoveredCombos.includes(c.id));
    combos.forEach((c) => grown.discoveredCombos.push(c.id));
    const advanced = advanceWeek(grown);
    saveGame(advanced);
    setState(advanced);
    setSelectedCardId(card.id);
    const growth = [...new Set((combos.length ? combos.map((c) => c.id) : advanced.discoveredCombos.slice(-2)).map(getPatternDisplayName))];
    setResult({
      title: sceneBySchedule[mapped].title,
      lines: run.resultLines.slice(0, 4),
      growth,
      sceneText: run.resultSceneText ?? '동하는 이번 주에도 작은 변화를 만들었다.'
    });
  };

  return <main className='main-page'>
    <section className='top-card status-hero'>
      <p className='date'>{getDateLabel(state)}</p>
      <h2>동하 현재 상태 카드</h2>
      <p>현재 분위기: {state.emotionState}</p>
      <p>{growthDirectionLine(state)}</p>
      <div className='stats-grid'>{statFocus.map((k) => <article key={k} className='stat-card'><div className='stat-head'><b>{k}</b><span>{state.stats[k]}</span></div></article>)}</div>
    </section>

    <section className='summary-card'><h3>이번 주 추천</h3><p>이번 주, 동하가 스스로 몰입할 수 있는 작은 장면 하나를 함께 골라주세요.</p></section>

    <section className='schedule-card'>
      <h3>이번 주, 어떤 순간을 함께할까?</h3>
      <div className='schedule-list'>{weeklyCards.map((card) => <button key={card.id} className={selectedCardId === card.id ? 'schedule-item selected' : 'schedule-item'} onClick={() => pickScene(card)}><strong>{card.title}</strong><p>{card.description}</p><em>{card.tags.slice(0, 2).join(' · ')}</em></button>)}</div>
    </section>

    <section className='modal-card event'>
      <h4>선택 결과 카드</h4>
      {!result ? <p>장면을 고르면 여기에서 이번 주 변화가 바로 나타납니다.</p> : <>
        <p><strong>이번 주 장면</strong> · {result.title}</p>
        <p>{result.sceneText}</p>
        <ul>{result.lines.map((line) => <li key={line}>{line}</li>)}</ul>
        <p><strong>이번 주 성장의 흔적</strong></p>
        <p>{result.growth.length ? result.growth.join(' · ') : '새로운 성장의 흔적'}</p>
        <p><strong>성장 방향</strong> {growthDirectionLine(state)}</p>
      </>}
    </section>

    <section className='log-card memory-notes'><h3>동하의 최근 기억</h3>{recentMemories.length === 0 ? <p>아직 특별한 기억은 없습니다.</p> : recentMemories.map((m, i) => <article key={`${m.id}-${m.week}`}><div><strong>{i + 1}. {m.title}</strong><p>{m.text}</p></div></article>)}</section>

    <section className='summary-card'><h3>최근 피어난 성장의 흔적</h3><p>{recentPatterns.length ? recentPatterns.join(' · ') : '새로운 성장의 흔적'}</p></section>

    <section className='summary-card'>
      <h3>보조 기능</h3>
      <div className='action-buttons'>
        <button className='run-button' onClick={() => { const s = loadGame(); setState(s); }}>저장 기록 불러오기</button>
        <button className='run-button' onClick={() => { const s = createAndSaveInitialGame(); setState(s); setResult(null); }}>새 게임 시작</button>
      </div>
    </section>
  </main>;
}
