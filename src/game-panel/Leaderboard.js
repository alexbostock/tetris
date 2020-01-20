// @flow

import React from 'react';
import { List } from 'immutable';

export type LeaderboardItem = {
  nickname: string,
  score: number,
}

type Props = {
  data: ?List<LeaderboardItem>,
  hideLeaderboard: () => void,
}

function Leaderboard(props: Props) {
  return (
    <div id="leaderboard">
      {!props.data || props.data.count() === 0 ? "NO DATA AVAILABLE" : table(props.data)}
      <button type="button" onClick={props.hideLeaderboard}>GO BACK</button>
    </div>
  );
}

function table(data: List<LeaderboardItem>) {
  const rows = data
    .sort((a, b) => b.score - a.score)
    .map((entry, i) => (
      <tr key={i + entry.nickname + entry.score}>
        <td>{i + 1}</td>
        <td>{entry.nickname}</td>
        <td>{entry.score}</td>
      </tr>
    ));
  
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2">NICKNAME</th><th>SCORE</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default Leaderboard;