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
};

class GamePanel extends React.PureComponent<Props, State> {
  state = {
    currentTetromino: tetrominoGenerator.next(),
    staticBlocks: Set<Position>(),
  };

  addStaticBlock(pos: Position) {
    this.setState({ staticBlocks: this.state.staticBlocks.add(pos) });
  }

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

  tick() {
    this.setState({
      currentTetromino: this.state.currentTetromino.advance(),
    }, () => {
      if (this.landed()) {
        for (let cell of this.state.currentTetromino.occupiedCells()) {
          this.addStaticBlock(cell);
        }

        this.setState({
          currentTetromino: tetrominoGenerator.next(),
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