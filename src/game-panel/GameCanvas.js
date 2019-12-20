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
        display: 'grid',
        gridTemplateColumns: width,
        gridTemplateRows: height,
      }}
    >
      {props.tetromino.occupiedCells().map(pos => Mino(pos, 'red'))}
      {props.staticBlocks.map(pos => Mino(pos, 'blue'))}
    </div>
  );
}

function Mino(pos: Position, colour: string) {
  const style = {
    gridColumn: pos.x + 1,
    gridRow: pos.y + 1,
    color: colour,
  };

  return <div key={pos.x + ',' + pos.y} className="mino" style={style}></div>;
}

export default GameCanvas;