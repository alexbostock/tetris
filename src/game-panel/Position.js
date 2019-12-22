// @flow

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  downOne() {
    return new Position(this.x, this.y + 1);
  }

  upOne() {
    return new Position(this.x, this.y - 1);
  }

  rightOne() {
    return new Position(this.x + 1, this.y);
  }

  leftOne() {
    return new Position(this.x - 1, this.y);
  }

  add(p: Position) {
    return new Position(this.x + p.x, this.y + p.y);
  }

  equals(other: Position) {
    return this.x === other.x && this.y === other.y;
  }

  hashCode() {
    return this.x + this.y | 0;
  }
}

export default Position;