import React from 'react';
import ReactDOM from 'react-dom/client';
import { GameApp } from './components/GameApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameApp />
  </React.StrictMode>,
);
