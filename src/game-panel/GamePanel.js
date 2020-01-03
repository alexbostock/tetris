// @flow

import React from 'react';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino, { tetrominoGenerator } from './Tetromino';
import GameCanvas from './GameCanvas';
import GameControls from './GameControls';
import wallKicks from './wallKicks';

export type GameState = 'preStart' | 'paused' | 'gameOver' | 'playing';

type Props = {
  marathonMode: boolean,
};

type State = {
  currentTetromino: Tetromino,
  staticBlocks: Set<Position>,
  gameState: GameState,
  currentLevel: number,
  currentScore: number,
  linesClearedSinceLastLevelUp: number,
  timer: ?IntervalID,
};

// level -> ticks / second
const gravityTable = [
  1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6,
  1.6, 1.7, 1.8, 1.9, 2,
  2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.5, 5,
];

// numRowsCleared -> score
const scoreDeltaTable = [0, 100, 300, 500, 800];

class GamePanel extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentTetromino: tetrominoGenerator.next(),
      staticBlocks: Set<Position>(),
      gameState: 'preStart',
      currentLevel: 1,
      currentScore: 0,
      linesClearedSinceLastLevelUp: 0,
      timer: null,
    };
  }

  render() {
    return (
      <div
        id="gamePanel"
        tabIndex="0"
        onKeyDown={this.handleKey}
      >
        <GameCanvas
          tetromino={this.state.currentTetromino}
          staticBlocks={this.state.staticBlocks}
          shadow={this.shadow()}
          gameState={this.state.gameState}
          startGame={this.startGame}
        />

        <GameControls
          playing={this.state.gameState === 'playing'}
          level={this.state.currentLevel}
          score={this.state.currentScore}
          pause={this.pause}
        />
      </div>
    );
  }

  startGame = () => {
    const level = this.state.gameState === 'gameOver' ? 1 : this.state.currentLevel;
    const speed = gravityTable[level - 1];
    const interval = 1000 / speed;
    const timer = setInterval(this.tick, interval);

    let tet = this.state.currentTetromino;
    let statics = this.state.staticBlocks;
    if (this.state.gameState === 'gameOver') {
      tet = tetrominoGenerator.next();
      statics = Set<Position>();
    }

    this.setState({
      currentTetromino: tet,
      staticBlocks: statics,
      gameState: 'playing',
      currentLevel: level,
      currentScore: this.state.gameState === 'gameOver' ? 0 : this.state.currentScore,
      timer: timer,
    });
  }

  pause = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }

    this.setState({
      gameState: 'paused',
      timer: null,
    });
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }

  tick = () => {
    let tet = this.state.currentTetromino;
    let statics = this.state.staticBlocks;
    let gameOver = false
    if (this.landed()) {
      statics = statics.union(tet.occupiedCells());
      statics = this.clearRows(statics);
      
      tet = tetrominoGenerator.next();

      while (overlap(tet, statics)) {
        gameOver = true;
        tet = tet.upOne();
        if (this.state.timer) {
          clearInterval(this.state.timer);
        }
      }
    } else {
      tet = this.state.currentTetromino.advance();
    }

    this.setState({
      currentTetromino: tet,
      staticBlocks: statics,
      gameState: gameOver ? 'gameOver' : 'playing',
      timer: gameOver ? null : this.state.timer,
    });
  }

  advanceLevel(numLevels: number) {
    if (this.state.currentLevel + 1 === gravityTable.length) {
      return;
    }

    if (numLevels === 0) {
      return;
    }

    const level = Math.min(this.state.currentLevel + numLevels, gravityTable.length - 1);

    if (this.state.timer) {
      clearInterval(this.state.timer);
    }

    const speed = gravityTable[level - 1];
    const interval = 1000 / speed;
    const timer = setInterval(this.tick, interval);

    this.setState({
      currentLevel: level,
      timer: timer,
    })
  }

  handleKey = (event: SyntheticKeyboardEvent<*>) => {
    if (this.state.gameState !== 'playing') {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowUp':
        this.hardDrop();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.tick();
        break;
      
      // Rotate left: z key on QWERTY, or same keyboard position on Dvorak.
      case 'z':
      case ';':
        this.rotateLeft();
        break;
      
      // Rotate right: x key on QWERTY, or same keyboard position on Dvorak.
      case 'x':
      case 'q':
        this.rotateRight();
        break;
      
      default:
        // Ignore other keys.
        break;
    }
  }

  landed(tet: Tetromino = this.state.currentTetromino) {
    const lowestRow = tet.occupiedCells()
      .reduce((acc: number, cell: Position) => Math.max(acc, cell.y), -1);
    if (lowestRow === 19) {
      return true;
    }

    return overlap(tet.advance(), this.state.staticBlocks);
  }

  moveRight() {
    const tet = this.state.currentTetromino.rightOne();
    if (withinBounds(tet) && !overlap(tet, this.state.staticBlocks)) {
      this.setState({ currentTetromino: tet });
    }
  }

  moveLeft() {
    const tet = this.state.currentTetromino.leftOne();
    if (withinBounds(tet) && !overlap(tet, this.state.staticBlocks)) {
      this.setState({ currentTetromino: tet });
    }
  }

  hardDrop() {
    let tet = this.state.currentTetromino;
    while (!this.landed(tet)) {
      tet = tet.downOne();
    }

    let statics = this.state.staticBlocks.union(tet.occupiedCells());
    statics = this.clearRows(statics);

    tet = tetrominoGenerator.next();
    let gameOver = false;
    while (overlap(tet, statics)) {
      gameOver = true;
      tet = tet.upOne();
      if (this.state.timer) {
        clearInterval(this.state.timer);
      }
    }

    this.setState({
      currentTetromino: tet,
      staticBlocks: statics,
      gameState: gameOver ? 'gameOver' : 'playing',
      timer: gameOver ? null : this.state.timer,
    });
  }

  rotateLeft() {
    const fromOrientation = this.state.currentTetromino.orientation;
    const tet = this.state.currentTetromino.rotateLeft();
    const toOrientation = tet.orientation;

    this.wallKick(tet, fromOrientation, toOrientation);
  }

  rotateRight() {
    const fromOrientation = this.state.currentTetromino.orientation;
    const tet = this.state.currentTetromino.rotateRight();
    const toOrientation = tet.orientation;

    this.wallKick(tet, fromOrientation, toOrientation);
  }

  wallKick(tet: Tetromino, from: number, to: number) {
    let transformations;
    switch (tet.type) {
      case 'O':
        transformations = [new Position(0, 0)];
        break;
      case 'I':
        transformations = wallKicks.getIn(['I', from, to]);
        break;
      default:
        transformations = wallKicks.getIn(['others', from, to]);
        break;
    }

    const pred = (tet: Tetromino) => {
      return !overlap(tet, this.state.staticBlocks) && withinBounds(tet);
    };

    for (const t of transformations) {
      const transformed = tet.transform(t);
      if (pred(transformed)) {
        this.setState({ currentTetromino: transformed });
        return;
      }
    }
  }

  shadow() {
    let tet = this.state.currentTetromino;
    while(!this.landed(tet)) {
      tet = tet.downOne();
    }

    return tet;
  }

  clearRows(cells: Set<Position>) {
    let numCleared = 0;

    for (let rowNum = 0; rowNum < 20; rowNum++) {
      const row = cells.filter(pos => pos.y === rowNum);
      if (row.count() === 10) {
        cells = cells.subtract(row);
        cells = cells.map(pos => pos.y < rowNum ? pos.downOne() : pos);
        numCleared++;
      }
    }

    const score = scoreDeltaTable[numCleared];

    numCleared += this.state.linesClearedSinceLastLevelUp;
    const numLevelsUp = Math.floor(numCleared / 10);
    numCleared %= 10;

    this.advanceLevel(numLevelsUp);

    this.setState({
      currentScore: this.state.currentScore + score,
      linesClearedSinceLastLevelUp: numCleared,
    });

    return cells;
  }
}

function withinBounds(tet: Tetromino) {
  for (const cell of tet.occupiedCells()) {
    if (cell.x > 9 || cell.x < 0 || cell.y > 19 || cell.y < 0) {
      return false;
    }
  }

  return true;
}

function overlap(a: Tetromino, b: Set<Position>) {
  return a.occupiedCells().intersect(b).count() > 0;
}

export default GamePanel;