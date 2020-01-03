import React from 'react';

type Props = {
  playing: boolean;
  level: number;
  score: number;
  pause: () => void;
};

function GameControls(props: Props) {
  return (
    <div id="gameControls">
      <ul>
        <li>LEFT / RIGHT: MOVE TETROMINO</li>
        <li>DOWN: SOFT DROP</li>
        <li>UP: HARD DROP</li>
        <li>Z: ROTATE LEFT</li>
        <li>X: ROTATE RIGHT</li>
      </ul>

      <button type="button" onClick={props.pause} disabled={!props.playing}>
        PAUSE
      </button>

      <p>CURRENT LEVEL: {props.level}</p>
      <p>CURRENT SCORE: {props.score}</p>
    </div>
  );
}

export default GameControls;