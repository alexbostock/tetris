// @flow

import React from 'react';

import HeldTetromino from './HeldTetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  moveLeft: () => void;
  moveRight: () => void;
  hardDrop: () => void;
  softDrop: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
};

function TouchControls(props: Props) {
  return (
    <div id="touchControls">
      <button type="button" onClick={props.moveLeft}>&lt;</button>
      <button type="button" onClick={props.softDrop}>v</button>
      <button type="button" onClick={props.moveRight}>&gt;</button>
      <button type="button" onClick={props.rotateLeft}>i</button>
      <button type="button" onClick={props.hardDrop}>V</button>
      <button type="button" onClick={props.rotateRight}>-i</button>
    </div>
  );
}

export default TouchControls;