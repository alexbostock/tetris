// @flow

import React from 'react';

import HeldTetromino from './HeldTetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  playing: boolean;
  level: number;
  score: number;
  heldTetromino: ?TetrominoType;
  holdTetromino: () => void,
  pause: () => void;
};

function GameControls(props: Props) {
  return (
    <div id="gameControls">
      <HeldTetromino type={props.heldTetromino} action={props.holdTetromino} />

      <ul>
        <li>LEFT / RIGHT: MOVE TETROMINO</li>
        <li>DOWN: SOFT DROP</li>
        <li>UP: HARD DROP</li>
        <li>Z: ROTATE LEFT</li>
        <li>X: ROTATE RIGHT</li>
        <li>BUTTON ABOVE: SWAP HELD TETROMINO</li>
      </ul>

      <button type="button" onClick={props.pause} disabled={!props.playing}>
        PAUSE
      </button>

      <p>CURRENT LEVEL: {props.level}</p>
      <p>CURRENT SCORE: {props.score}</p>
    </div>
  );
}

export default GameControls;