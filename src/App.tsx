import { GameShell } from './components/GameShell';
import { GameProvider, useGame } from './game/GameProvider';

function AppContent() {
  const { state, screen, selectedAction, dialogue, onPick, onStart, onNew, onNext } = useGame();

  return (
    <GameShell
      state={state}
      screen={screen}
      selectedAction={selectedAction}
      dialogue={dialogue}
      onPick={onPick}
      onStart={onStart}
      onNew={onNew}
      onNext={onNext}
    />
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
