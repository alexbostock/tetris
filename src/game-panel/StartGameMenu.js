// @flow

import React from 'react';

import type { GameState } from './GamePanel';
import LeaderboardForm from './LeaderboardForm';

type Props = {
  gameState: GameState;
  startGame: () => void;
  score: number;
}

function StartGameMenu(props: Props) {
  const buttonText = chooseButtonText(props.gameState)

  return (
    <div id="startGameMenu">
      {props.gameState === 'gameOver' ? <h2>GAME OVER</h2> : null}
      <button type="button" onClick={props.startGame}>{buttonText}</button>

      <button type="button">VIEW LEADERBOARD</button>

      {props.gameState === 'gameOver' ? <LeaderboardForm score={props.score} /> : null}
    </div>
  );
}

function chooseButtonText(gameState) {
  switch (gameState) {
    case 'preStart': return 'START GAME';
    case 'paused': return 'RESUME';
    case 'gameOver': return 'PLAY AGAIN';
    case 'playing': return '';
    default:
      console.error(`Unexpected game state: ${gameState}`);
      return '';
  }
}

export default StartGameMenu;