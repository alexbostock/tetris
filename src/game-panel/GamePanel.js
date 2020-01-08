import React from 'react';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino, { tetrominoGenerator } from './Tetromino';
import type { TetrominoType } from './Tetromino';
import GameCanvas from './GameCanvas';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
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
  heldTetromino: ?TetrominoType,
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
  state = {
    currentTetromino: tetrominoGenerator.next(),
    staticBlocks: Set(),
    gameState: 'preStart',
    currentLevel: 1,
    currentScore: 0,
    heldTetromino: null,
    linesClearedSinceLastLevelUp: 0,
    timer: null,
  };

  render() {
    return (
      <div
        id="gamePanel"
      >
        <GameInfo
          level={this.state.currentLevel}
          score={this.state.currentScore}
        />

        <GameCanvas
          tetromino={this.state.currentTetromino}
          staticBlocks={this.state.staticBlocks}
          shadow={this.shadow()}
          gameState={this.state.gameState}
          startGame={this.startGame}
        />

        <GameControls
          playing={this.state.gameState === 'playing'}
          heldTetromino={this.state.heldTetromino}
          holdTetromino={this.holdTetromino}
          pause={this.pause}

          moveLeft={this.moveLeft}
          moveRight={this.moveRight}
          hardDrop={this.hardDrop}
          softDrop={this.softDrop}
          rotateLeft={this.rotateLeft}
          rotateRight={this.rotateRight}
        />
      </div>
    );
  }

  setTimer(level: number = this.state.currentLevel) {
    this.stopTimer();

    const speed = gravityTable[level - 1];  // ticks / second
    const interval = 1000 / speed;          // milliseconds / tick
    const timer = setInterval(this.tick, interval);

    this.setState({timer: timer});
  }

  stopTimer() {
    clearInterval(this.state.timer);

    this.setState({timer: null});
  }

  startGame = () => {
    const gameOver = this.state.gameState === 'gameOver';

    const level = gameOver ? 1 : this.state.currentLevel;
    this.setTimer(level);

    this.setState({
      currentTetromino: gameOver ? tetrominoGenerator.next() : this.state.currentTetromino,
      staticBlocks: gameOver ? Set() : this.state.staticBlocks,
      gameState: 'playing',
      currentLevel: level,
      currentScore: gameOver ? 0 : this.state.currentScore,
      heldTetromino: gameOver ? null : this.state.heldTetromino,
    });
  }

  pause = () => {
    this.stopTimer();

    this.setState({
      gameState: 'paused',
    });
  }

  componentDidMount() {
    document.body.addEventListener('keydown', event => {
      this.handleKey(event.key);
    });
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }

  tick = (tet: Tetromino = this.state.currentTetromino) => {
    let statics = this.state.staticBlocks;
    let gameOver = false
    if (this.landed(tet)) {
      statics = statics.union(tet.occupiedCells());
      statics = this.clearRows(statics);
      
      tet = tetrominoGenerator.next();
      while (overlap(tet, statics)) {
        gameOver = true;
        tet = tet.upOne();
        this.stopTimer();
      }
    } else {
      tet = this.state.currentTetromino.advance();
    }

    this.setState({
      currentTetromino: tet,
      staticBlocks: statics,
      gameState: gameOver ? 'gameOver' : 'playing',
    });
  }

  advanceLevel(numLevels: number) {
    if (this.state.gameState === 'gameOver') {
      return;
    }

    if (this.state.currentLevel + 1 === gravityTable.length) {
      return;
    }

    if (numLevels === 0) {
      return;
    }

    const level = Math.min(this.state.currentLevel + numLevels, gravityTable.length - 1);

    this.setTimer(level);

    this.setState({
      currentLevel: level,
    })
  }

  handleKey = (key: string) => {
    if (this.state.gameState !== 'playing') {
      return;
    }

    switch (key) {
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
        this.softDrop();
        break;
      
      case ' ':
        this.holdTetromino();
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

    return lowestRow === 19 || overlap(tet.advance(), this.state.staticBlocks);
  }

  softDrop = () => {
    if (this.state.gameState !== 'playing') {
      return;
    }

    this.tick();

    // Reset timer to avoid two ticks very close to each other when a hard drop
    // input conincides with a normal clock tick.
    this.setTimer();
  }

  moveRight = () => {
    const tet = this.state.currentTetromino.rightOne();
    if (withinBounds(tet) && !overlap(tet, this.state.staticBlocks)) {
      this.setState({ currentTetromino: tet });
    }
  }

  moveLeft = () => {
    const tet = this.state.currentTetromino.leftOne();
    if (withinBounds(tet) && !overlap(tet, this.state.staticBlocks)) {
      this.setState({ currentTetromino: tet });
    }
  }

  hardDrop = () => {
    const tet = this.shadow();

    this.tick(tet);
  }

  rotateLeft = () => {
    const tet = this.state.currentTetromino.rotateLeft();

    const fromOrientation = this.state.currentTetromino.orientation;
    const toOrientation = tet.orientation;

    this.wallKick(tet, fromOrientation, toOrientation);
  }

  rotateRight = () => {
    const tet = this.state.currentTetromino.rotateRight();

    const fromOrientation = this.state.currentTetromino.orientation;
    const toOrientation = tet.orientation;

    this.wallKick(tet, fromOrientation, toOrientation);
  }

  wallKick(tet: Tetromino, from: number, to: number) {
    // tet should be a tetromino after basic rotation around its centre.
    // wallKicks.js defines a set of translations for each type of rotation.
    // Try each translation in order and select the first one which results in
    // a valid tetromino position. A valid position has the tetromino within
    // bounds, and not overlapping any obstacle. If no valid translation exists,
    // make no changes (abort the rotation).

    let transformations;
    switch (tet.type) {
      case 'O':
        // The O tetromino has order 4 rotational symmetry, so rotation is a NOP.
        transformations = [new Position(0, 0)];
        break;
      case 'I':
        transformations = wallKicks.getIn(['I', from, to]);
        break;
      default:
        transformations = wallKicks.getIn(['others', from, to]);
        break;
    }

    const valid = (tet: Tetromino) => {
      return !overlap(tet, this.state.staticBlocks) && withinBounds(tet);
    };

    for (const t of transformations) {
      const transformed = tet.translate(t);
      if (valid(transformed)) {
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

  holdTetromino = () => {
    const held = this.state.heldTetromino;

    const tet = held ? new Tetromino(held) : tetrominoGenerator.next();

    this.setState({
      currentTetromino: tet,
      heldTetromino: this.state.currentTetromino.type,
    });
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