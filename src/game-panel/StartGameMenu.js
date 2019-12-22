// @flow

import React from 'react';

type Props = {
  gameOver: boolean,
  startGame: () => void,
};

function StartGameMenu(props: Props) {
  const buttonText = props.gameOver ? 'PLAY AGAIN' : 'START GAME'
  return (
    <div id="startGameMenu">
      {props.gameOver ? <h2>GAME OVER</h2> : null}
      <button type="button" onClick={props.startGame}>{buttonText}</button>
    </div>
  );
}

export default StartGameMenu;