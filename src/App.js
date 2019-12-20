// @flow

import React from 'react';

import GamePanel from './game-panel/GamePanel';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Tetris</h1>
      </header>
      <main>
        <GamePanel />
      </main>
    </div>
  );
}

export default App;
