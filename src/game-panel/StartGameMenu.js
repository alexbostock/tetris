// @flow

import React from 'react';

import type { GameState } from './GamePanel';
import LeaderboardForm from './LeaderboardForm';

type Props = {
  gameState: GameState;
  startGame: () => void;
  score: number;
  showLeaderboard: () => void;

  canSubmitScore: boolean;
  scoreSaved: boolean;
  setCanSubmitScore: boolean => void;
  setScoreSaved: boolean => void;
}

function StartGameMenu(props: Props) {
  const buttonText = chooseButtonText(props.gameState)

  return (
    <div id="startGameMenu">
      {props.gameState === 'gameOver' ? <h2>GAME OVER</h2> : null}
      <button type="button" onClick={props.startGame}>{buttonText}</button>

      {props.gameState === 'gameOver' ? (
        <LeaderboardForm
          score={props.score}
          canSubmitScore={props.canSubmitScore}
          scoreSaved={props.scoreSaved}
          setCanSubmitScore={props.setCanSubmitScore}
          setScoreSaved={props.setScoreSaved}
        />
      ) : null}

      <button type="button" onClick={props.showLeaderboard}>SHOW LEADERBOARD</button>
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