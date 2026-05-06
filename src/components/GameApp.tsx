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
  const eventLine = weekNumber % 12 === 0 ? '특별한 성장 순간이 찾아왔다.' : weekNumber % 4 === 0 ? '작은 이벤트가 살짝 스쳐 갔다.' : null;

  const pick = (id: ScheduleId) => {
    const result = applyActivity({ ...state, actionsLeft: 1 }, id);
    const advanced = endWeek({ ...result.state, actionsLeft: 0 });
    advanced.selectedGrowthDirection = growthDirectionText(advanced);
    saveGame(advanced);
    setState(advanced);
    setLast({ ...result, chosenId: id, eventLine });
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
        <h3>행동 선택지 3개</h3>
        <div className='schedule-list'>
          {weeklyOptions.map((id) => {
            const label = ACTION_VARIANTS[id][(weekNumber + id.length) % ACTION_VARIANTS[id].length];
            return <button className='schedule-item' key={id} onClick={() => pick(id)}><strong>{label}</strong><span>{id}</span></button>;
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
        <ul>{last.resultLines.slice(0, 4).map((d: string, i: number) => <li key={i}>{d}</li>)}</ul>
        <p><strong>성장 해석:</strong> 동하는 {growthDirectionText(state)} 쪽으로 조금 가까워졌다.</p>
        {last.eventLine && <p className='new-memory'>{last.eventLine}</p>}
      </section>
      <button className='run-button' onClick={() => setScreen('schedule')}>다음 주로</button>
    </main>;
  }

  if (screen === 'album') return <div><MemoryAlbum items={state.memoryAlbum} /><button onClick={() => setScreen('schedule')}>돌아가기</button></div>;

  return <div><h1>{ending?.title ?? '성장 엔딩'}</h1><p>{ending?.summary}</p><button onClick={() => setState(createInitialState())}>다시 키우기</button></div>;
}
