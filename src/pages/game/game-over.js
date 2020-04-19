import React from 'react';
import { useHistory } from 'react-router-dom';

import { getGameWinner } from '../../helpers/utilities';

import LoggedInLayout from '../../components/logged-in-layout';
import PlayerCard from '../../components/player-card/player-card';

export default function GameOver({ gameData }) {
  const history = useHistory();
  const winningTeam = getGameWinner(gameData);
  return (
    <LoggedInLayout>
      <div className="game-over-screen">
        <h1>Congrats {winningTeam}!</h1>

        {gameData[winningTeam] &&
          gameData[winningTeam].players.map((player) => {
            return <PlayerCard player={player} />;
          })}
      </div>

      <button onClick={() => history.push('/lobby')}>Back to Lobby</button>
    </LoggedInLayout>
  );
}
