// @flow

import React from 'react';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino from './Tetromino';

type Props = {
  tetromino: Tetromino,
  staticBlocks: Set<Position>,
};

function GameCanvas(props: Props) {
  const height = 20;
  const width = 10;

  return (
    <div
      id="gameCanvas"
      style={{
        height: height + 'em',
        width: width + 'em',
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {props.tetromino.occupiedCells().map(pos => Mino(pos, props.tetromino.color()))}
      {props.staticBlocks.map(pos => Mino(pos, 'grey'))}
    </div>
  );
}

function Mino(pos: Position, colour: string) {
  if (pos.y < 0) {
    return null;
  }

  const style = {
    gridColumn: pos.x + 1,
    gridRow: pos.y + 1,
    backgroundColor: colour,
  };

  return <div key={pos.x + ',' + pos.y} className="mino" style={style}></div>;
}

export default GameCanvas;