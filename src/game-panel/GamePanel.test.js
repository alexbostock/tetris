import Position from './Position';
import Tetromino from './Tetromino';
import GamePanel from './GamePanel';

describe('GamePanel', () => {
  test('detects when a tetromino has landed', () => {
    const panel = new GamePanel();

    panel.state.currentTetromino = new Tetromino('I');
    expect(panel.landed()).toBe(false);

    panel.state.staticBlocks = panel.state.staticBlocks
      .add(new Position(3, 2));
    expect(panel.landed()).toBe(false);

    panel.state.currentTetromino.pos.y = 1;
    expect(panel.landed()).toBe(true);

    panel.state.currentTetromino.pos.y = 19;
    expect(panel.landed()).toBe(true);

    panel.state.currentTetromino = new Tetromino('T');
    expect(panel.landed()).toBe(true);
  });
});