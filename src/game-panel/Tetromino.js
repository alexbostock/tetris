// @flow

import { Set } from 'immutable';

import Position from './Position';

type TetrominoType =
  | 'I'
  | 'J'
  | 'L'
  | 'O'
  | 'S'
  | 'T'
  | 'Z';

class Tetromino {
  type: TetrominoType;
  pos: Position;
  // Use Super Rotation System (https://tetris.fandom.com/wiki/SRS).
  orientation: number;

  constructor(type: TetrominoType, pos: Position = new Position(4, 0)) {
    this.type = type;
    this.pos = pos;
    this.orientation = 0;
  }

  occupiedCells() {
    const cells = cellsOrientation0(this.type, this.pos);

    switch (this.type) {
      case 'I': return rotateI(cells, this.pos, this.orientation);
      case 'O': return cells;
      default: return rotate(cells, this.pos.downOne(), this.orientation);
    }
  }

  rotateLeft() {
    const t = new Tetromino(this.type, this.pos);
    t.orientation = (this.orientation + 3) % 4;
    return t;
  }

  rotateRight() {
    const t = new Tetromino(this.type, this.pos);
    t.orientation = (this.orientation + 1) % 4;
    return t;
  }
}

function cellsOrientation0(type: TetrominoType, centre: Position) {
  switch (type) {
    case 'I':
      return Set([
        centre,
        centre.leftOne(),
        centre.rightOne(),
        centre.rightOne().rightOne(),
      ]);
    case 'J':
      return Set([
        centre.leftOne(),
        centre.downOne().leftOne(),
        centre.downOne(),
        centre.downOne().rightOne(),
      ]);
    case 'L':
      return Set([
        centre.rightOne(),
        centre.downOne().leftOne(),
        centre.downOne(),
        centre.downOne().rightOne(),
      ]);
    case 'O':
      return Set([
        centre,
        centre.downOne(),
        centre.rightOne(),
        centre.downOne().rightOne(),
      ]);
    case 'S':
      return Set([
        centre,
        centre.rightOne(),
        centre.downOne(),
        centre.downOne().leftOne(),
      ]);
    case 'T':
      return Set([
        centre,
        centre.downOne().leftOne(),
        centre.downOne(),
        centre.downOne().rightOne(),
      ]);
    case 'Z':
      return Set([
        centre,
        centre.leftOne(),
        centre.downOne(),
        centre.downOne().rightOne(),
      ]);
    default:
      console.error(`Unexpected tetromino type: ${type}`);
      return Set();
  }
}

function rotate(points: Set<Position>, centre, numRotations) {
  let ps = points.map(p => new Position(p.x - centre.x, p.y - centre.y));

  for (let i = 0; i < numRotations; i++) {
    ps = ps.map(p => new Position(-p.y, p.x));
  }

  return ps.map(p => new Position(p.x + centre.x, p.y + centre.y));
}

function rotateI(points: Set<Position>, centre, orientation) {
  switch (orientation) {
    case 0: return points;
    case 2: return points.map(p => new Position(p.x, p.y + 1));
    case 1:
      centre = new Position(centre.x + 1, centre.y);
      // Fallthrough
    case 3:
      return Set([
        centre,
        centre.upOne(),
        centre.downOne(),
        centre.downOne().downOne(),
      ]);
    default:
      console.error(`Unexpected tetromino orientation: ${orientation}`);
        return Set();
  }
}

class Generator {
  // Use Random Generator (https://tetris.fandom.com/wiki/Random_Generator).
  
  bag: Array<TetrominoType> = [];

  next = () => {
    if (this.bag.length === 0) {
      this.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    }

    const index = Math.floor(Math.random() * this.bag.length);
    return new Tetromino(this.bag.splice(index, 1)[0]);
  }
}

export const tetrominoGenerator = new Generator();

export default Tetromino;