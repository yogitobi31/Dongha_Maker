import { useEffect, useMemo, useState } from 'react';
import { createAndSaveInitialGame, hasSaveData, loadGame, saveGame } from './game/storage';
import { advanceWeek, createInitialState, getDateLabel, getEndingCandidates, runWeek, schedules } from './game/engine';
import type { GameState, ScheduleId, StatName } from './game/types';

type Scene = 'title' | 'intro' | 'main';

type ActivityModal = {
  sceneText: string;
  resultLines: string[];
  newMemories: GameState['memories'];
  scheduleName: string;
};

type WeeklyModal = {
  reflection: string;
  newMemory?: GameState['memories'][number];
};

const statOrder: StatName[] = ['체력', '지능', '창의력', '감수성', '사회성', '호기심', '집중력', '자존감'];
const introLines = [
  '비가 아주 조금 내리던 날,',
  '작은 아이 하나가 세상에 도착했다.',
  '이름은 최동하.',
  '아직 아무것도 정해지지 않은 아이.',
  '이제부터, 당신은 동하의 시간을 함께 걷게 된다.',
  '1살 봄',
  '동하는 아직 말을 잘하지 못한다. 하지만 눈빛만큼은 이상하게 반짝인다.',
];

const endingLabelMap: Record<string, string> = {
  indieGameCreator: '자기만의 세계를 만드는 아이',
  belovedGameDirector: '사람들과 함께 무언가를 만드는 아이',
  natureDocumentaryMaker: '작은 것들을 오래 바라보는 아이',
  quietNovelist: '조용히 이야기를 품는 아이',
  warmTeacher: '누군가의 마음을 잘 살피는 아이',
  lonelyGenius: '혼자만의 방에서 빛나는 아이',
  lateBloomingOrdinaryLife: '천천히 자기 속도로 피어나는 아이',
  burnedOutProdigy: '너무 일찍 많은 것을 짊어진 아이'
};

const emotionLabelMap: Record<string, string> = {
  calm: '편안함',
  happy: '들뜸',
  tired: '피곤함',
  stressed: '불편함',
  sick: '아픔',
  curious: '궁금함',
  dreaming: '몽상 중'
};

const scheduleSceneHint: Record<ScheduleId, string> = {
  speech: '입술을 오물거리며 소리를 만들고 있다.',
  storybook: '한 페이지를 오래 보며 그림 속에 잠긴다.',
  blocks: '정답 없는 모양으로 블록을 다시 쌓는다.',
  walk: '작은 돌멩이 하나에도 발걸음이 멈춘다.',
  nap: '품 안에서 숨을 고르고 느리게 잠든다.',
  toy: '정해진 사용법 대신 자기 규칙으로 논다.',
  family: '가까운 사람의 온기에서 안정된다.',
  daydream: '아무것도 하지 않는 듯 보여도 머릿속은 바쁘다.'
};

const scheduleTags: Record<ScheduleId, string> = {
  speech: '언어 · 표현 · 자신감',
  storybook: '상상 · 감수성 · 호기심',
  blocks: '창의력 · 몰입 · 구성',
  walk: '호기심 · 탐험 · 안정',
  nap: '회복 · 안정 · 휴식',
  toy: '놀이 · 창의력 · 몰입',
  family: '애착 · 공감 · 정서',
  daydream: '창의력 · 감수성 · 몽상'
};

const statusNarratives = [
  '동하는 아무것도 없는 곳을 보며 혼자 웃었다.',
  '동하는 오늘도 작은 소리에 고개를 돌린다.',
  '동하는 품 안에 있을 때 훨씬 편안해 보인다.',
  '동하는 멈춰 서서 바람 소리를 오래 듣고 있다.'
];

export default function App() {
  const [scene, setScene] = useState<Scene>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [selected, setSelected] = useState<ScheduleId | null>(null);
  const [message, setMessage] = useState('');
  const [visibleLines, setVisibleLines] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [activityModal, setActivityModal] = useState<ActivityModal | null>(null);
  const [weeklyModal, setWeeklyModal] = useState<WeeklyModal | null>(null);

  const memoryPreview = useMemo(() => state.memories.slice(-6).reverse(), [state.memories]);
  const endingPreview = useMemo(() => getEndingCandidates(state), [state]);
  const statusLine = useMemo(() => {
    const idx = (state.player.week + state.player.season + state.actionsLeft) % statusNarratives.length;
    return statusNarratives[idx];
  }, [state.player.week, state.player.season, state.actionsLeft]);

  useEffect(() => {
    if (scene !== 'intro' || visibleLines >= introLines.length) return;
    const t = window.setTimeout(() => setVisibleLines((prev) => prev + 1), 1100);
    return () => window.clearTimeout(t);
  }, [scene, visibleLines]);

  const startNewGame = () => {
    if (hasSaveData() && !window.confirm('기존 저장 데이터를 덮어쓰고 새 게임을 시작할까요?')) return;
    const initial = createAndSaveInitialGame();
    setState(initial);
    setSelected(null);
    setVisibleLines(0);
    setScene('intro');
    setMessage('');
  };

  const continueGame = () => {
    const loaded = loadGame();
    if (!loaded) return setMessage('아직 저장된 기록이 없습니다.');
    setState(loaded);
    setScene('main');
    setMessage('기록을 불러왔습니다.');
  };

  const runSelectedWeek = () => {
    if (!selected) return;
    const prevMemories = state.memories.length;
    const result = runWeek(state, selected);
    if (result.state === state) return setMessage('행동 횟수를 모두 사용했습니다. 이번 주를 마무리해 주세요.');
    setState(result.state);
    setMessage('');
    saveGame(result.state);

    const latestNewMemories = result.state.memories.slice(prevMemories);
    setActivityModal({
      sceneText: result.resultSceneText ?? '동하는 오늘도 자기만의 시간을 보냈다.',
      resultLines: result.resultLines,
      scheduleName: result.scheduleName,
      newMemories: latestNewMemories
    });
  };

  const finishWeek = () => {
    const prevMemories = state.memories.length;
    const reflection = state.weeklyReflections[0] ?? '동하는 이번 주를 조용히 지나오며 자기만의 리듬을 만들었습니다.';
    const next = advanceWeek(state);
    const newMemory = next.memories[prevMemories];
    setState(next);
    saveGame(next);
    setWeeklyModal({ reflection, newMemory });
  };

  if (scene === 'title') {
    return <main className="title-page"><section className="title-card"><p className="eyebrow">RAISING DIARY</p><h1>동하키우기</h1><p className="subtitle">시간의 압박 속에서 쌓이는 작은 기억들</p><div className="menu-list"><button onClick={startNewGame}>새 게임</button><button onClick={continueGame}>이어하기</button></div>{message ? <p className="title-message">{message}</p> : null}</section></main>;
  }

  if (scene === 'intro') {
    return (
      <main className="intro-page">
        <section className="intro-card">
          {introLines.map((line, i) => (
            <p key={line} className={visibleLines > i ? 'intro-line visible' : 'intro-line'}>{line}</p>
          ))}
          <div className="intro-actions">
            <button onClick={() => setScene('main')}>스킵</button>
            <button onClick={() => setScene('main')} disabled={visibleLines < introLines.length}>시작하기</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-page">
      <section className="top-card status-hero">
        <p className="date">{getDateLabel(state)}</p>
        <div className="hero-title-row"><h2>동하의 하루</h2><span className="emotion-badge">{emotionLabelMap[state.emotionState]}</span></div>
        <p className="hero-line">{statusLine}</p>
      </section>

      <section className="summary-card">이번 주 남은 행동 <strong>{state.actionsLeft} / {state.actionsPerWeek}</strong> · 피로 <strong>{state.fatigue}</strong> · 스트레스 <strong>{state.stress}</strong></section>

      <section className="stats-grid">
        {statOrder.map((key) => (<article key={key} className="stat-card"><div className="stat-head"><span>{key}</span><strong>{state.stats[key]}</strong></div><div className="bar"><i style={{ width: `${state.stats[key]}%` }} /></div></article>))}
      </section>

      <section className="schedule-card">
        <h3>이번 주 행동 선택</h3>
        <div className="schedule-list">
          {(Object.keys(schedules) as ScheduleId[]).map((id) => (
            <button key={id} disabled={state.actionsLeft === 0} className={selected === id ? 'schedule-item selected' : 'schedule-item'} onClick={() => setSelected(id)}>
              <strong>{schedules[id].name}</strong>
              <p>{scheduleSceneHint[id]}</p>
              <span>{scheduleTags[id]}</span>
              <em>피로 {schedules[id].fatigue >= 0 ? '+' : ''}{schedules[id].fatigue} / 스트레스 {schedules[id].stress >= 0 ? '+' : ''}{schedules[id].stress}</em>
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button className="run-button" onClick={runSelectedWeek} disabled={state.actionsLeft === 0 || !selected}>행동 실행</button>
          <button className="run-button finish" onClick={finishWeek}>이번 주를 마무리하기</button>
          <button className="run-button preview-button" onClick={() => setShowPreview((v) => !v)}>성장 방향 미리보기</button>
        </div>
      </section>

      {showPreview ? <section className="summary-card growth-preview"><h3>현재 성장 방향</h3><p>동하는 아직 아무것도 정해지지 않았습니다. 하지만 지금까지의 시간은 이런 흔적을 남기고 있습니다.</p><ol>{endingPreview.map((e, i) => <li key={e.id}>{i + 1}. {endingLabelMap[e.id] ?? '아직 이름 붙이기 어려운 방향'}</li>)}</ol><p>동하는 <strong>{endingLabelMap[endingPreview[0]?.id ?? 'lateBloomingOrdinaryLife']}</strong> 쪽으로 조금씩 기울고 있습니다.</p></section> : null}

      <section className="log-card memory-notes"><h3>동하의 기억</h3>{memoryPreview.length === 0 ? <p>아직 특별한 기억은 없습니다. 하지만 시간은 천천히 쌓이고 있습니다.</p> : memoryPreview.map((m) => <article key={`${m.id}-${m.week}`}><p>[{m.age}살 · {m.season}]</p><strong>{m.title}</strong><p>{m.text}</p></article>)}</section>

      {activityModal ? <section className="modal-backdrop"><article className={`modal-card ${activityModal.newMemories.length > 0 ? 'event' : ''}`}><p className="modal-eyebrow">{activityModal.newMemories.length > 0 ? '작은 사건' : '오늘의 장면'}</p><h4>{activityModal.scheduleName}</h4><p className="scene-text">{activityModal.sceneText}</p><ul>{activityModal.resultLines.map((line) => <li key={line}>{line}</li>)}</ul>{activityModal.newMemories[0] ? <p className="new-memory">새로운 기억이 생겼습니다. “{activityModal.newMemories[0].title}”</p> : null}<button className="run-button" onClick={() => setActivityModal(null)}>확인</button></article></section> : null}

      {weeklyModal ? <section className="modal-backdrop"><article className="modal-card"><p className="modal-eyebrow">이번 주의 동하</p><p className="scene-text">{weeklyModal.reflection}</p>{weeklyModal.newMemory ? <p className="new-memory">새로운 기억: {weeklyModal.newMemory.title}</p> : <p className="scene-text">이번 주는 조용했지만, 동하의 안쪽에서는 분명히 무언가 자라고 있습니다.</p>}<button className="run-button" onClick={() => setWeeklyModal(null)}>다음 주로</button></article></section> : null}
    </main>
  );
}
