// @flow

import React from 'react'

type Props = {
  level: number;
  score: number;
  highscore: number;
};

function GameInfo(props: Props) {
  return (
    <div id="gameInfo">
      <h2>CONTROLS</h2>

      <ul>
        <li>LEFT / RIGHT: MOVE TETROMINO</li>
        <li>DOWN: SOFT DROP</li>
        <li>UP: HARD DROP</li>
        <li>Z: ROTATE LEFT</li>
        <li>X: ROTATE RIGHT</li>
        <li>SPACE: SWAP HELD TETROMINO</li>
        <li>P: PAUSE / RESUME</li>
      </ul>

      <p>CURRENT LEVEL: {props.level}</p>
      <p>CURRENT SCORE: {props.score}</p>
      <p>HIGHSCORE: {props.highscore}</p>
    </div>
  )
}

export default GameInfo;