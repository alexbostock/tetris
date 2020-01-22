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
      <h3>Submit to Leaderboard</h3>

      <label>
        Nickname:
        <input value={nickname} onChange={updateNickname} />
      </label>

      <br />
      
      <button onClick={submitForm} disabled={!props.canSubmitScore}>Submit</button>
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
    return 'Saved';
  }

  if (!canSubmit) {
    return 'Saving';
  }

  return null;
}

export default LeaderboardForm;