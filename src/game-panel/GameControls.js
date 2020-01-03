import React from 'react';

type Props = {
  playing: boolean;
  level: number;
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

      <span>CURRENT LEVEL: {props.level}</span>
    </div>
  );
}

export default GameControls;