import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GAME_STATUSES } from '../../helpers/constants';
import PlayerCard from '../player-card/player-card';
import './game-preview.css';

export default function GamePreview({ game, handleJoinGameClick }) {
  const history = useHistory();

  const joinGame = () => {
    handleJoinGameClick(game);
  };

  const watchGame = () => {
    history.push(`/game/${game.key}`);
  };

  return (
    <div className="game-preview">
      <h3>{game.players[0].displayName}’s New Game</h3>

      <div className="players-list">
        {game.players.map((player) => {
          return <PlayerCard size="small" player={player} />;
        })}
      </div>

      <div className="preview-bottom">
        {game.status === GAME_STATUSES.WAITING_TO_START && (
          <React.Fragment>
            <div className="status-message">
              This game will be starting soon
            </div>
            <button onClick={() => joinGame()}>Join</button>
          </React.Fragment>
        )}

        {game.status === GAME_STATUSES.IN_PROGRESS && (
          <React.Fragment>
            <div className="status-message">This game is in progress</div>
            <button onClick={() => watchGame()}>Watch</button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
