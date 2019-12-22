import { List, Map } from 'immutable';

import Position from "./Position";

// Wall kick transformations for SRS
// https://tetris.wiki/Super_Rotation_System#Wall_Kicks

const wallKicks = Map()
  .set('others', Map()
    .set(0, Map()
      .set(1, '(0,0) (-1,0) (-1,-1) (0,+2) (-1,+2)')
      .set(3, '(0,0) (+1,0) (+1,-1) (0,+2) (+1,+2)'),
    )
    .set(1, Map()
      .set(0, '(0,0) (+1,0) (+1,+1) (0,-2) (+1,-2)')
      .set(2, '(0,0) (+1,0) (+1,+1) (0,-2) (+1,-2)'),
    )
    .set(2, Map()
      .set(1, '(0,0) (-1,0) (-1,-1) (0,+2) (-1,+2)')
      .set(3, '(0,0) (+1,0) (+1,-1) (0,+2) (+1,+2)'),
    )
    .set(3, Map()
      .set(0, '(0,0) (-1,0) (-1,+1) (0,-2) (-1,-2)')
      .set(2, '(0,0) (-1,0) (-1,+1) (0,-2) (-1,-2)'),
    )
  )
  .set('I', Map()
    .set(0, Map()
      .set(1, '(0,0) (-2,0) (+1,0) (-2,+1) (+1,-2)')
      .set(3, '(0,0) (-1,0) (+2,0) (-1,-2) (+2,+1)'),
    )
    .set(1, Map()
      .set(0, '(0,0) (+2,0) (-1,0) (+2,-1) (-1,+2)')
      .set(2, '(0,0) (-1,0) (+2,0) (-1,-2) (+2,+1)'),
    )
    .set(2, Map()
      .set(1, '(0,0) (+1,0) (-2,0) (+1,+2) (-2,-1)')
      .set(3, '(0,0) (+2,0) (-1,0) (+2,-1) (-1,+2)'),
    )
    .set(3, Map()
      .set(0, '(0,0) (+1,0) (-2,0) (+1,+2) (-2,-1)')
      .set(2, '(0,0) (-2,0) (+1,0) (-2,+1) (+1,-2)'),
    )
  )

  .map(a => a.map(b => b.map(c => {
    return List(c.split(' '))
      .map(s => {
        const c = s.slice(1, -1).split(',').map(s => parseInt(s));
        return new Position(c[0], c[1]);
      });
  })));

export default wallKicks;