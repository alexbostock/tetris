// @flow

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
  score: number;
};

function LeaderboardForm(props: Props) {
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [message, setMessage] = useState(null);
  const [saved, setSaved] = useState(false);

  const updateNickname = event => {
    setNickname(event.target.value);
    localStorage.setItem('nickname', event.target.value);
  }

  const submitForm = event => {
    event.preventDefault();

    if (nickname === '') {
      return;
    }

    axios.post('https://leaderboard.alexbostock.co.uk/scores', {
      nickname: nickname,
      score: props.score,
    })
      .then(res => {
        setMessage('SCORE SAVED TO LEADERBOARD');
        setSaved(true);
      })
      .catch(err => setMessage('FAILED TO SUBMIT TO LEADERBOARD'));
    
    setMessage('CONNECTING TO LEADERBOARD');
  }

  const form = (
    <>
      <h3>SUBMIT TO LEADERBOARD</h3>

      <label>
        NICKNAME:
        <input value={nickname} onChange={updateNickname} />
        <button onClick={submitForm}>SUBMIT</button>
      </label>
    </>
  );

  return (
    <form>
      {saved ? null : form}

      <p>{message}</p>
    </form>
  );
}

export default LeaderboardForm;