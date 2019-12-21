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
      <div id="gamePanel">
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
      statics = tet.occupiedCells()
        .reduce((acc, cell) => acc.add(cell), statics);
      
      tet = tetrominoGenerator.next();

      while (tet.occupiedCells().intersect(statics).count() > 0) {
        gameOver = true;
        tet.pos = tet.pos.upOne();
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

  landed() {
    const lowestRow = this.state.currentTetromino.occupiedCells()
      .reduce((acc: number, cell: Position) => Math.max(acc, cell.y), -1);
    if (lowestRow === 19) {
      return true;
    }

    const overlapAfterOneTick = this.state.currentTetromino.advance().occupiedCells()
      .intersect(this.state.staticBlocks);

    return overlapAfterOneTick.count() > 0;
  }
}

export default GamePanel;