// @flow

import React from 'react';

import Position from './Position';

type Props = {
  pos: Position,
  colour: string,
  opacity: number,
};

function Mino(props: Props) {
  if (props.pos.y < 0) {
    return null;
  }

  const style = {
    gridColumn: props.pos.x + 1,
    gridRow: props.pos.y + 1,
    backgroundColor: props.colour,
    opacity: props.opacity || 1,
  }

  return <div className="mino" style={style}></div>;
}

export default Mino;