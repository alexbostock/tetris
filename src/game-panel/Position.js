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
}

export default Position;