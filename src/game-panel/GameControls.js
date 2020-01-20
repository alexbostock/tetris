// @flow

import React from 'react';

import HeldTetromino from './HeldTetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  playing: boolean;
  heldTetromino: ?TetrominoType;
  holdTetromino: () => void,
  pause: () => void;
};

function GameControls(props: Props) {
  return (
    <div id="gameControls">
      <HeldTetromino type={props.heldTetromino} action={props.holdTetromino} />

      <button type="button" onClick={props.pause} disabled={!props.playing}>
        PAUSE
      </button>
    </div>
  );
}

export default GameControls;