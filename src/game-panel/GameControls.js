// @flow

import React from 'react';

import HeldTetromino from './HeldTetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  playing: boolean;
  heldTetromino: ?TetrominoType;
  holdTetromino: () => void,
  pause: () => void;

  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
  softDrop: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
};

function GameControls(props: Props) {
  return (
    <div id="gameControls">
      <HeldTetromino type={props.heldTetromino} action={props.holdTetromino} />

      <button type="button" onClick={props.pause} disabled={!props.playing}>
        PAUSE
      </button>

      <div id="touchControls">
        <button type="button" onClick={props.moveLeft}>&lt;</button>
        <button type="button" onClick={props.softDrop}>v</button>
        <button type="button" onClick={props.moveRight}>&gt;</button>
        <button type="button" onClick={props.rotateLeft}>i</button>
        <button type="button" onClick={props.hardDrop}>V</button>
        <button type="button" onClick={props.rotateRight}>-i</button>
      </div>
    </div>
  );
}

export default GameControls;