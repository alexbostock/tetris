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
  timer?: IntervalID,
};

class GamePanel extends React.PureComponent<Props, State> {
  state = {
    currentTetromino: tetrominoGenerator.next(),
    staticBlocks: Set<Position>(),
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
    this.setState({
      currentTetromino: this.state.currentTetromino.advance(),
    }, () => {
      if (this.landed()) {
        let statics = this.state.staticBlocks;
        for (let cell of this.state.currentTetromino.occupiedCells()) {
          statics = statics.add(cell);
        }

        this.setState({
          currentTetromino: tetrominoGenerator.next(),
          staticBlocks: statics,
        });
      }
    });
  }

  landed() {
    for (let i = 0; i < 10; i++) {
      const lowest = this.state.currentTetromino.occupiedCells()
        .reduce((acc: number, cell: Position) => {
          return cell.x === i ? Math.max(acc, cell.y) : acc;
        }, -1);
      
      if (this.state.staticBlocks.has(new Position(i, lowest + 1))) {
        return true;
      }

      if (lowest === 19) {
        return true;
      }
    }

    return false;
  }
}

export default GamePanel;