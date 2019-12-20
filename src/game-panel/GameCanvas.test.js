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

  const canvas = renderer.create(
    <GameCanvas
      tetromino={tet}
      staticBlocks={staticBlocks}
      addStaticBlock={x => x}
    />
  );

  expect(canvas.toJSON()).toMatchSnapshot();
});
