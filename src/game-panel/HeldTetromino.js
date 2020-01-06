import React from 'react';

import type { TetrominoType } from './Tetromino';

type Props = {
  type: TetrominoType,
  action: () => void,
};

function HeldTetromino(props: Props) {
  return (
    <button
      type="button"
      onClick={props.action}
    >
      {props.type || 'X'}
    </button>
  );
}

export default HeldTetromino;