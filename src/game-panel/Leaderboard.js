// @flow

import React from 'react';
import type { Node } from 'react';
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
  const button = <button type="button" onClick={props.hideLeaderboard}>Go Back</button>;

  return (
    <div id="leaderboard">
      {!props.data || props.data.count() === 0 ?
        <>
          No Data Available
          <br /> {button}
        </>
        : table(props.data, button)}
    </div>
  );
}

function table(data: List<LeaderboardItem>, button: Node) {
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
          <th colSpan="2">
            <div>
              {button}
              <span>Nickname</span>
            </div>
          </th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default Leaderboard;