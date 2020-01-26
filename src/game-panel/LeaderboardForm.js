// @flow

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  if (props.scoreSaved) {
    return <p>Score Saved</p>;
  }

  const updateNickname = event => {
    event.preventDefault();
    setNickname(event.target.value);
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

  const msg = props.canSubmitScore ? 'Submit' : 'Saving';

  return (
    <form>
      <h3>Submit to Leaderboard</h3>

      <label>
        Nickname:
        <input value={nickname} onChange={updateNickname} />
      </label>

      <br />
      
      <button onClick={submitForm} disabled={!props.canSubmitScore}>{msg}</button>
    </form>
  );
}

export default LeaderboardForm;