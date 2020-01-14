// @flow

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
  score: number;
};

function LeaderboardForm(props: Props) {
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [canSubmitScore, setCanSubmitScore] = useState(true);
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
        setSaved(true);
      })
      .catch(err => {
        setCanSubmitScore(true);
      });
    
    setCanSubmitScore(false);
  }

  const form = (
    <>
      <h3>SUBMIT TO LEADERBOARD</h3>

      <label>
        NICKNAME:
        <input value={nickname} onChange={updateNickname} />
        <button onClick={submitForm} disabled={!canSubmitScore}>SUBMIT</button>
      </label>
    </>
  );

  return (
    <form>
      {saved ? null : form}

      <p>{message(canSubmitScore, saved)}</p>
    </form>
  );
}

function message(canSubmit: boolean, saved: boolean) {
  if (saved) {
    return 'SAVED';
  }

  if (!canSubmit) {
    return 'SAVING';
  }

  return null;
}

export default LeaderboardForm;