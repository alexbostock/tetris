// @flow

import React from 'react';
import { Set } from 'immutable';

import Mino from './Mino';
import Position from './Position';
import Tetromino from './Tetromino';
import StartGameMenu from './StartGameMenu';

import type { GameState } from './GamePanel';

type Props = {
  tetromino: Tetromino,
  staticBlocks: Set<Position>,
  shadow?: Tetromino,
  gameState: GameState,
  startGame: () => void,
  score: number,
  showLeaderboard: () => void,
};

function GameCanvas(props: Props) {
  const height = 20;
  const width = 10;

  const tet = props.tetromino.occupiedCells()
    .map(pos => mino(pos, props.tetromino.color()))

  const shadow = props.shadow ? props.shadow.occupiedCells()
    .map(pos => mino(pos, props.tetromino.color(), 0.4)) : null;

  return (
    <div
      id="gameCanvas"
      style={{
        height: height + 'em',
        width: width + 'em',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {shadow}
      {tet}
      {props.staticBlocks.map(pos => mino(pos, 'brown'))}
      {
        props.gameState === 'playing' ? null :
        <StartGameMenu
          gameState={props.gameState}
          startGame={props.startGame}
          score={props.score}
          showLeaderboard={props.showLeaderboard}
        />
      }
    </div>
  );
}

function mino(pos: Position, colour: string, opacity: number = 1) {
  return (
    <Mino
      key={pos.x + ',' + pos.y}
      pos={pos}
      colour={colour}
      opacity={opacity}
    />
  );
}

export default GameCanvas;