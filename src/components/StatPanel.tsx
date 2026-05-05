import type { GameState } from '../game/types';
import { OrnatePanel } from './OrnatePanel';

const statMap: Array<{ label: string; key: keyof GameState['stats']; blue?: boolean }> = [
  { label: '체력', key: 'stamina' }, { label: '공부력', key: 'study' }, { label: '멘탈', key: 'mental' },
  { label: '게임력', key: 'gaming' }, { label: '감성', key: 'emotion' }, { label: '사회성', key: 'social' },
  { label: '집중력', key: 'focus' }, { label: '자존감', key: 'esteem' }, { label: '희선호감도', key: 'romance' },
  { label: '스트레스', key: 'mental', blue: true },
];

export function StatPanel({ state }: { state: GameState }) {
  return <OrnatePanel title="능력치" className="stat-panel">{statMap.map((s) => {
    const value = s.label === '스트레스' ? state.hidden.fatigue : state.stats[s.key];
    const segments = Math.max(1, Math.round(value / 10));
    return <div className="stat-row" key={s.label}><span>{s.label}</span><strong>{value}</strong><div className="stat-gauge">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < segments ? (s.blue ? 'on-blue' : 'on-red') : ''} />)}</div></div>;
  })}</OrnatePanel>;
}
