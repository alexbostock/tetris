// @flow

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
  score: number;
  canSubmitScore: boolean;
  scoreSaved: boolean;
  setCanSubmitScore: boolean => void;
  setScoreSaved: boolean => void;
};

function LeaderboardForm(props: Props) {
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');

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
        props.setScoreSaved(true);
      })
      .catch(err => {
        props.setCanSubmitScore(true);
      });
    
    props.setCanSubmitScore(false);
  }

  const form = (
    <>
      <h3>SUBMIT TO LEADERBOARD</h3>

      <label>
        NICKNAME:
        <input value={nickname} onChange={updateNickname} />
        <button onClick={submitForm} disabled={!props.canSubmitScore}>SUBMIT</button>
      </label>
    </>
  );

  return (
    <form>
      {props.scoreSaved ? null : form}

      <p>{message(props.canSubmitScore, props.scoreSaved)}</p>
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