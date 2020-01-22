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
      <div>
        {props.gameState === 'gameOver' ? <h2>Game Over</h2> : null}

        <button type="button" onClick={props.startGame}>{buttonText}</button>

        <br/>

        <button type="button" onClick={props.showLeaderboard}>Show Leaderboard</button>
      </div>

      {props.gameState === 'gameOver' ? (
        <LeaderboardForm
          score={props.score}
          canSubmitScore={props.canSubmitScore}
          scoreSaved={props.scoreSaved}
          setCanSubmitScore={props.setCanSubmitScore}
          setScoreSaved={props.setScoreSaved}
        />
      ) : null}
    </div>
  );
}

function chooseButtonText(gameState) {
  switch (gameState) {
    case 'preStart': return 'Start Game';
    case 'paused': return 'Resume';
    case 'gameOver': return 'Play Again';
    case 'playing': return '';
    default:
      console.error(`Unexpected game state: ${gameState}`);
      return '';
  }
}

export default StartGameMenu;