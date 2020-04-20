import React from 'react';

import './player-card.css';

export default function PlayerCard({
  player,
  gameData,
  size,
  clear,
  reversed,
  onClick,
  highlighted,
}) {
  const clickable = !!onClick;

  return (
    <div
      role={clickable ? 'button' : 'presentation'}
      onClick={clickable ? onClick : () => {}}
      key={player.uid}
      className={`player-card 
        ${highlighted ? 'highlighted' : ''} 
        ${size === 'small' ? '-small' : ''} 
        ${clear ? '-clear' : ''}
        ${clickable ? '-clickable' : ''}
        ${reversed ? '-reversed' : ''}`}
    >
      {reversed ? (
        <React.Fragment>
          <h3 className="name">{player.displayName}</h3>
          <div className="image">
            {player.photoURL && (
              <img src={player.photoURL} alt={player.displayName} />
            )}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="image">
            {player.photoURL && (
              <img src={player.photoURL} alt={player.displayName} />
            )}
          </div>
          <h3 className="name">{player.displayName}</h3>
        </React.Fragment>
      )}
    </div>
  );
}
