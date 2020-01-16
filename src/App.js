// @flow

import React from 'react';

import GamePanel from './game-panel/GamePanel';

function App() {
  return (
    <div className="App" id="gamePanel">
      <GamePanel marathonMode={true} />
    </div>
  );
}

export default App;
