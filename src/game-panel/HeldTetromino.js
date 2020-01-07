// @flow

import React from 'react';

import Mino from './Mino';
import Position from './Position';
import Tetromino from './Tetromino';
import type { TetrominoType } from './Tetromino';

type Props = {
  type: ?TetrominoType,
  action: () => void,
};

function HeldTetromino(props: Props) {
  let height = 4
  let width = 5
  let minos = null;

  if (props.type) {
    let tetromino = new Tetromino(props.type, new Position(2, 1));
    switch (props.type) {
      case 'I':
        height = 3;
        width = 6;
        break;
      case 'O':
        tetromino = tetromino.leftOne();
        width = 4;
        break;
      default:
        // Do nothing.
    }

    minos = tetromino.occupiedCells()
      .map(cell => mino(cell, tetromino.color()));
  }

  return (
    <button
      type="button"
      id="heldTetrominoButton"
      onClick={props.action}
    >
      <div
        id="heldTetromino"
        style={{
          height: `${height}em`,
          width: `${width}em`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
      >
        {minos}
      </div>
    </button>
  );
}

function mino(pos: Position, colour: string) {
  return <Mino key={pos.x + ',' + pos.y} pos={pos} colour={colour} opacity={1} />;
}

export default HeldTetromino;