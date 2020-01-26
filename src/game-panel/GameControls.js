// @flow

import React, { useEffect } from 'react';

import HeldTetromino from './HeldTetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  playing: boolean;
  heldTetromino: ?TetrominoType;
  holdTetromino: () => void,
  pause: () => void;
  keyHandler: KeyboardEventListener,
};

function GameControls(props: Props) {
  useEffect(() => {
    if (document.body !== null) {
      if (props.playing) {
        document.body.addEventListener('keydown', props.keyHandler);
      } else {
        document.body.removeEventListener('keydown', props.keyHandler);
      }
    }

  }, [props.playing, props.keyHandler]);

  return (
    <div id="gameControls">
      <HeldTetromino type={props.heldTetromino} action={props.holdTetromino} />

      <button type="button" onClick={props.pause} disabled={!props.playing}>
        Pause
      </button>
    </div>
  );
}

export default GameControls;