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
      <h2>Controls</h2>

      <ul>
        <li>Left / Right: Move tetromino</li>
        <li>Down: Soft drop</li>
        <li>Up: Hard drop</li>
        <li>Z: Rotate left</li>
        <li>X: Rotate right</li>
        <li>Space: Swap held tetromino</li>
        <li>P: Pause / Resume</li>
      </ul>

      <p>Current Level: {props.level}</p>
      <p>Current Score: {props.score}</p>
      <p>Highscore: {props.highscore}</p>
    </div>
  )
}

export default GameInfo;