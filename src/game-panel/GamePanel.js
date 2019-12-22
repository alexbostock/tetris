// @flow

import React from 'react';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino, { tetrominoGenerator } from './Tetromino';
import GameCanvas from './GameCanvas';
import wallKicks from './wallKicks';

type Props = {

};

type State = {
  currentTetromino: Tetromino,
  staticBlocks: Set<Position>,
  playing: boolean,
  gameOver: boolean,
  timer: ?IntervalID,
};

class GamePanel extends React.PureComponent<Props, State> {
  state = {
    currentTetromino: tetrominoGenerator.next(),
    staticBlocks: Set<Position>(),
    playing: false,
    gameOver: false,
    timer: null,
  };

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
          playing={this.state.playing}
          gameOver={this.state.gameOver}
          startGame={this.startGame}
        />
      </div>
    );
  }

  startGame = () => {
    const interval = 500;
    const timer = setInterval(this.tick, interval);
    this.setState({
      currentTetromino: tetrominoGenerator.next(),
      staticBlocks: Set<Position>(),
      playing: true,
      gameOver: false,
      timer: timer,
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
      statics = clearRows(statics);
      
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
      playing: !gameOver,
      gameOver: gameOver,
      timer: gameOver ? null : this.state.timer,
    });
  }

  handleKey = (event: SyntheticKeyboardEvent<*>) => {
    if (!this.state.playing) {
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
    statics = clearRows(statics);

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
      playing: !gameOver,
      gameOver: gameOver,
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

function clearRows(cells: Set<Position>) {
  for (let rowNum = 0; rowNum < 20; rowNum++) {
    const row = cells.filter(pos => pos.y === rowNum);
    if (row.count() === 10) {
      cells = cells.subtract(row);
      cells = cells.map(pos => pos.y < rowNum ? pos.downOne() : pos);
    }
  }

  return cells;
}

export default GamePanel;