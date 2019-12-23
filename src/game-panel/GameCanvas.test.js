import React from 'react';
import renderer from 'react-test-renderer';
import { Set } from 'immutable';

import Position from './Position';
import Tetromino from './Tetromino';
import GameCanvas from './GameCanvas';

test('correctly renders minos described by props', () => {
  const tet = new Tetromino('I', new Position(4, 0));
  const staticBlocks = Set([
    new Position(3, 10),
    new Position(4, 10),
    new Position(5, 10),
  ]);

  let canvas = renderer.create(
    <GameCanvas
      tetromino={tet}
      staticBlocks={staticBlocks}
      gameState={'preStart'}
    />
  );

  expect(canvas.toJSON()).toMatchSnapshot();

  canvas = renderer.create(
    <GameCanvas
      tetromino={tet}
      staticBlocks={staticBlocks}
      gameState={'gameOver'}
    />
  );

  expect(canvas.toJSON()).toMatchSnapshot();

  canvas = renderer.create(
    <GameCanvas
      tetromino={tet}
      staticBlocks={staticBlocks}
      gameState={'playing'}
    />
  );

  expect(canvas.toJSON()).toMatchSnapshot();
});
