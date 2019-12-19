import Tetromino from './Tetromino';

import { List, Set } from 'immutable';

import Position from './Position';

describe('tetromino', () => {
  beforeEach(() => {
    expect.extend({
      sameImSet(s1, s2) {
        const comp = (a, b) => a.x - b.x === 0 ? a.y - b.y : a.x - b.x;

        const l1 = List(s1).sort(comp);
        const l2 = List(s2).sort(comp);

        const ok =  s1.map(pos => pos.x).equals(s2.map(pos => pos.x))
          && s1.map(pos => pos.y).equals(s2.map(pos => pos.y));
        
        const printSet = s => s.map(pos => `(${pos.x}, ${pos.y})`);
        
        const got = `Got: ${printSet(s1)};`
        const expected = `Expected: ${printSet(s2)};`
        
        return {
          message: () => `Expected equal immutable sets\n${expected}\n${got}`,
          pass: ok,
        };
      }
    })
  });

  test('gives cells occupied by a tetromino', () => {
    const cube = new Tetromino('O', new Position(0, 0));
    const expCube = Set([0, 1, 2, 3]
      .map(i => new Position(Math.floor(i / 2), i % 2)));

    const i = new Tetromino('I');
    const expI = Set([3, 4, 5, 6]. map(x => new Position(x, 0)));

    const j = new Tetromino('J');
    const expJ = Set([3, 4, 5].map(x => new Position(x, 1)))
      .add(new Position(3, 0));

    const l = new Tetromino('L');
    const expL = Set([3, 4, 5].map(x => new Position(x, 1)))
      .add(new Position(5, 0));
    
    const s = new Tetromino('S', new Position(1, 0));
    const expS = Set([
      new Position(1, 0),
      new Position(2, 0),
      new Position(0, 0),
      new Position(0, 1),
    ]);

    const t = new Tetromino('T');
    const expT = Set([3, 4, 5].map(x => new Position(x, 1)))
      .add(new Position(4, 0));

    const z = new Tetromino('Z', new Position(1, 0));
    const expZ = Set([
      new Position(0, 0),
      new Position(1, 0),
      new Position(1, 1),
      new Position(2, 1),
    ]);

    expect(cube.occupiedCells()).sameImSet(expCube);
    expect(i.occupiedCells()).sameImSet(expI);
    expect(j.occupiedCells()).sameImSet(expJ);
    expect(l.occupiedCells()).sameImSet(expL);
    expect(s.occupiedCells()).sameImSet(expS);
    expect(t.occupiedCells()).sameImSet(expT);
    expect(z.occupiedCells()).sameImSet(expZ);
  });

  test('rotates tetrominoes', () => {
    const l = new Tetromino('L', new Position(1, 0));

    const o1 = Set([0, 1, 2].map(y => new Position(1, y)))
      .add(new Position(2, 2));
    
    const o2 = Set([0, 1, 2].map(x => new Position(x, 1)))
      .add(new Position(0, 2));
    
    const o3 = Set([0, 1, 2].map(y => new Position(1, y)))
      .add(new Position(0, 0));

    expect(l.rotateRight().occupiedCells())
      .sameImSet(o1);
    expect(l.rotateLeft().rotateLeft().occupiedCells())
      .sameImSet(o2);
    expect(l.rotateRight().rotateRight().occupiedCells())
      .sameImSet(o2);
    expect(l.rotateLeft().occupiedCells())
      .sameImSet(o3);
    expect(l.rotateRight().rotateRight().rotateRight().occupiedCells())
      .sameImSet(o3);
    
    const o = new Tetromino('O');
    expect(o.rotateRight().occupiedCells()).sameImSet(o.occupiedCells());

    const i = new Tetromino('I', new Position(1, 2));
    const i1 = Set([1, 2, 3, 4].map(y => new Position(2, y)));
    const i2 = Set([0, 1, 2, 3].map(x => new Position(x, 3)));
    const i3 = Set([1, 2, 3, 4].map(y => new Position(1, y)));

    expect(i.rotateRight().occupiedCells())
      .sameImSet(i1);
    expect(i.rotateRight().rotateRight().occupiedCells())
      .sameImSet(i2);
    expect(i.rotateLeft().occupiedCells())
      .sameImSet(i3);
    expect(i.rotateRight().rotateRight().rotateRight().occupiedCells())
      .sameImSet(i3);
  });
});