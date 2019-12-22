// @flow

import React from 'react';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino, { tetrominoGenerator } from './Tetromino';
import GameCanvas from './GameCanvas';

type Props = {

};

type State = {
  currentTetromino: Tetromino,
  staticBlocks: Set<Position>,
  gameOver: boolean,
  timer: ?IntervalID,
};

class GamePanel extends React.PureComponent<Props, State> {
  state = {
    currentTetromino: tetrominoGenerator.next(),
    staticBlocks: Set<Position>(),
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
        />
      </div>
    );
  }

  componentDidMount() {
    const interval = 500;
    const timer = setInterval(this.tick, interval);
    this.setState({ timer: timer });
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
      gameOver: gameOver,
      timer: gameOver ? null : this.state.timer,
    });
  }

  handleKey = (event: SyntheticKeyboardEvent<*>) => {
    if (this.state.gameOver) {
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
      case ' ':
        console.log('(space)');
        // TODO: rotate
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

    const statics = this.state.staticBlocks.union(tet.occupiedCells());
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
      gameOver: gameOver,
      timer: gameOver ? null : this.state.timer,
    });
  }
}

function withinBounds(tet: Tetromino) {
  for (let cell of tet.occupiedCells()) {
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