import React from 'react';
import { Link } from 'react-router-dom';
import { GAME_STATUSES } from '../../helpers/constants';

import './player-card.css';

export default function PlayerCard({
  player,
  gameData,
  size,
  clear,
  reversed,
}) {
  const isPlayersTurn =
    gameData && gameData.currentTalker.talker.uid === player.uid;

  return (
    <div
      key={player.uid}
      className={`player-card 
        ${isPlayersTurn ? 'current-turn' : ''} 
        ${size === 'small' ? '-small' : ''} 
        ${clear ? '-clear' : ''}
        ${reversed ? '-reversed' : ''}`}
    >
      {reversed ? (
        <React.Fragment>
          <h3 className="name">{player.displayName}</h3>
          <div className="image">
            <img src={player.photoURL} alt={player.displayName} />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="image">
            <img src={player.photoURL} alt={player.displayName} />
          </div>
          <h3 className="name">{player.displayName}</h3>
        </React.Fragment>
      )}
    </div>
  );
}
