import React from 'react';
import { useHistory } from 'react-router-dom';

import './game-over.css';

import { getGameWinner } from '../../../helpers/utilities/catchphrase-utilities';

import LoggedInLayout from '../../../components/logged-in-layout';
import PlayerCard from '../../../components/player-card/player-card';
import Button from '../../../components/button/button';

export default function GameOver({ gameData }) {
  const history = useHistory();
  const winningTeam = getGameWinner(gameData);
  return (
    <LoggedInLayout>
      <div className="game-over">
        <h1>Congrats {winningTeam}!</h1>

        <div className="space-large">
          {gameData[winningTeam] && (
            <div className="player-list">
              {gameData[winningTeam].players.map((player) => {
                return <PlayerCard key={player.uid} player={player} />;
              })}
            </div>
          )}
        </div>

        <Button onClick={() => history.push('/lobby')}>Back to Lobby</Button>
      </div>
    </LoggedInLayout>
  );
}
