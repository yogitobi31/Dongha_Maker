import { useEffect, useMemo, useState } from 'react';
import { createAndSaveInitialGame, hasSaveData, loadGame, saveGame } from './game/storage';
import { advanceWeek, createInitialState, getDateLabel, getDominantTraits, getEndingCandidates, runWeek, schedules } from './game/engine';
import type { GameState, ScheduleId, StatName } from './game/types';

type Scene = 'title' | 'intro' | 'main';

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
const emotionLabelMap: Record<string, string> = { calm: '편안함', happy: '밝음', tired: '피곤함', stressed: '예민함', sick: '기운 없음', curious: '호기심 가득', dreaming: '몽상 중' };

export default function App() {
  const [scene, setScene] = useState<Scene>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [selected, setSelected] = useState<ScheduleId>('speech');
  const [message, setMessage] = useState('');
  const [statusLine, setStatusLine] = useState('동하는 아직 말을 잘하지 못하지만, 눈빛은 반짝입니다.');
  const [visibleLines, setVisibleLines] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const isDev = Boolean((import.meta as any).env?.DEV);

  const sortedLogs = useMemo(() => state.logs.slice(0, 5), [state.logs]);
  const memoryPreview = useMemo(() => state.memories.slice(-3).reverse(), [state.memories]);
  const endingPreview = useMemo(() => getEndingCandidates(state), [state]);
  const dominantTraits = useMemo(() => getDominantTraits(state), [state]);

  useEffect(() => {
    if (scene !== 'intro') return;
    if (visibleLines >= introLines.length) return;
    const t = window.setTimeout(() => setVisibleLines((prev) => prev + 1), 1100);
    return () => window.clearTimeout(t);
  }, [scene, visibleLines]);

  const startNewGame = () => {
    if (hasSaveData() && !window.confirm('기존 저장 데이터를 덮어쓰고 새 게임을 시작할까요?')) return;
    const initial = createAndSaveInitialGame();
    setState(initial);
    setVisibleLines(0);
    setScene('intro');
    setMessage('');
  };

  const continueGame = () => {
    const loaded = loadGame();
    if (!loaded) {
      setMessage('아직 저장된 기록이 없습니다.');
      return;
    }
    setState(loaded);
    setScene('main');
    setMessage('기록을 불러왔습니다.');
  };

  const runSelectedWeek = () => {
    const result = runWeek(state, selected);
    if (result.state === state) {
      setMessage('행동 횟수를 모두 사용했습니다. 이번 주를 마무리해 주세요.');
      return;
    }
    setState(result.state);
    setStatusLine(result.summary);
    setMessage(`${result.resultSceneText}\n${result.resultLines.join(' / ')}`);
    saveGame(result.state);
  };

  const finishWeek = () => {
    const next = advanceWeek(state);
    setState(next);
    saveGame(next);
    setMessage(next.weeklyReflections[0] ?? '동하는 자기 속도로 한 주를 건넜습니다.');
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
      <section className="top-card">
        <div>
          <p className="date">{getDateLabel(state)}</p>
          <h2>최동하</h2>
        </div>
      </section>

      <section className="summary-card">
        <p>이번 주 남은 행동: <strong>{state.actionsLeft} / {state.actionsPerWeek}</strong></p>
        <p>피로도: <strong>{state.fatigue}</strong></p>
        <p>스트레스: <strong>{state.stress}</strong></p>
        <p>현재 상태: <strong>{emotionLabelMap[state.emotionState]}</strong></p>
      </section>

      <section className="stats-grid">
        {statOrder.map((key) => (<article key={key} className="stat-card"><div className="stat-head"><span>{key}</span><strong>{state.stats[key]}</strong></div><div className="bar"><i style={{ width: `${state.stats[key]}%` }} /></div></article>))}
      </section>

      <section className="summary-card">{statusLine}</section>

      
      <section className="schedule-card">
        <h3>이번 주 행동 선택</h3>
        <div className="schedule-list">
          {(Object.keys(schedules) as ScheduleId[]).map((id) => (
            <button key={id} disabled={state.actionsLeft === 0} className={selected === id ? 'schedule-item selected' : 'schedule-item'} onClick={() => setSelected(id)}>
              <strong>{schedules[id].name}</strong>
              <span>{schedules[id].description}</span>
            </button>
          ))}
        </div>
        <button className="run-button" onClick={runSelectedWeek} disabled={state.actionsLeft === 0}>행동 실행</button>
        <div className="action-buttons">
          <button className={state.actionsLeft === 0 ? 'run-button finish emphasize' : 'run-button finish'} onClick={finishWeek}>이번 주를 마무리하기</button>
          <button className="run-button preview-button" onClick={() => setShowPreview((v) => !v)}>성장 방향 미리보기</button>
        </div>
      </section>

      {showPreview ? <section className="summary-card"><h3>현재 성장 방향</h3><p>현재 동하는 이런 방향으로 자라고 있습니다.</p><ol>{endingPreview.map((e, i) => <li key={e.id}>{i+1}. {endingLabelMap[e.id] ?? '아직 이름 붙이기 어려운 방향'}</li>)}</ol><p>동하는 {endingLabelMap[endingPreview[0]?.id ?? 'indieGameCreator']} 쪽으로 조금씩 기울고 있습니다.</p></section> : null}

      <section className="log-card"><h3>동하의 기억</h3>{memoryPreview.length===0 ? <p>아직 특별한 기억이 쌓이지 않았습니다.</p> : memoryPreview.map((m)=><article key={m.id}><p>[{m.age}살 · {m.season}]</p><strong>{m.title}</strong><p>{m.text}</p></article>)}</section>
      {isDev ? <section className="log-card"><h3>개발자 디버그 패널</h3><p>Hidden Traits: {dominantTraits.map(([k,v])=>`${k}:${v.toFixed(1)}`).join(', ')}</p><p>Ending Seeds: {endingPreview.map((x)=>`${x.id}:${x.score}`).join(', ')}</p></section> : null}
<section className="log-card">
        <h3>최근 일지</h3>
        {sortedLogs.length === 0 ? <p>아직 기록이 없습니다.</p> : sortedLogs.map((log, i) => <p key={`${log.weekLabel}-${i}`}>[{log.weekLabel}] {log.scheduleName} · {log.lines.join(' / ')}</p>)}
      </section>

      {message ? <p className="toast">{message}</p> : null}
    </main>
  );
}
