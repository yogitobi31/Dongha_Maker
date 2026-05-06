import { useMemo, useState } from 'react';
import { createAndSaveInitialGame, hasSaveData, loadGame, saveGame } from './game/storage';
import { createInitialState, getDateLabel, runWeek, schedules } from './game/engine';
import type { GameState, ScheduleId, StatName } from './game/types';

type Scene = 'title' | 'main';

const statOrder: StatName[] = ['체력', '스트레스', '지능', '감성', '매력', '운동', '도덕성', '창의력', '코딩력', '행복도'];

export default function App() {
  const [scene, setScene] = useState<Scene>('title');
  const [state, setState] = useState<GameState>(createInitialState());
  const [selected, setSelected] = useState<ScheduleId>('study');
  const [message, setMessage] = useState('');
  const [statusLine, setStatusLine] = useState('오늘도 차분하게 하루를 준비하고 있습니다.');

  const sortedLogs = useMemo(() => state.logs.slice(0, 5), [state.logs]);

  const startNewGame = () => {
    if (hasSaveData() && !window.confirm('기존 저장 데이터를 덮어쓰고 새 게임을 시작할까요?')) return;
    const initial = createAndSaveInitialGame();
    setState(initial);
    setScene('main');
    setMessage('새로운 기록을 시작했습니다.');
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
    setState(result.state);
    setStatusLine(result.summary);
    setMessage(`${result.scheduleName} 실행: ${result.resultLines.join(' / ')}`);
    saveGame(result.state);
  };

  if (scene === 'title') {
    return (
      <main className="title-page">
        <section className="title-card">
          <p className="eyebrow">RAISING DIARY</p>
          <h1>동하키우기</h1>
          <p className="subtitle">호기심 많은 하루들의 기록</p>
          <div className="menu-list">
            <button onClick={startNewGame}>새 게임</button>
            <button onClick={continueGame}>이어하기</button>
            <button onClick={() => setMessage('앨범은 준비 중입니다.')}>앨범</button>
            <button onClick={() => setMessage('설정은 준비 중입니다.')}>설정</button>
          </div>
          {message ? <p className="title-message">{message}</p> : null}
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
        <p className="money">₩ {state.player.money.toLocaleString()}</p>
      </section>

      <section className="stats-grid">
        {statOrder.map((key) => (
          <article key={key} className="stat-card">
            <div className="stat-head"><span>{key}</span><strong>{state.stats[key]}</strong></div>
            <div className="bar"><i style={{ width: `${state.stats[key]}%` }} /></div>
          </article>
        ))}
      </section>

      <section className="summary-card">{statusLine}</section>

      <section className="schedule-card">
        <h3>주간 스케줄 선택</h3>
        <div className="schedule-list">
          {(Object.keys(schedules) as ScheduleId[]).map((id) => (
            <button key={id} className={selected === id ? 'schedule-item selected' : 'schedule-item'} onClick={() => setSelected(id)}>
              <strong>{schedules[id].name}</strong>
              <span>{schedules[id].description}</span>
            </button>
          ))}
        </div>
        <button className="run-button" onClick={runSelectedWeek}>이번 주 실행</button>
      </section>

      <section className="footer-actions">
        <button onClick={() => setMessage('일지는 아래에서 확인할 수 있습니다.')}>일지</button>
        <button onClick={() => { saveGame(state); setMessage('저장 완료'); }}>저장</button>
        <button onClick={() => setScene('title')}>타이틀로 돌아가기</button>
      </section>

      <section className="log-card">
        <h3>최근 일지</h3>
        {sortedLogs.length === 0 ? <p>아직 기록이 없습니다.</p> : sortedLogs.map((log, i) => <p key={`${log.weekLabel}-${i}`}>[{log.weekLabel}] {log.scheduleName} · {log.lines.join(' / ')}</p>)}
      </section>

      {message ? <p className="toast">{message}</p> : null}
    </main>
  );
}
