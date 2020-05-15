import React from 'react';

import './codenames.css';

export default function CardGridItem({ card, onClick, isSpymaster }) {
  const clickable = !!onClick;

  return (
    <div
      role={clickable ? 'button' : 'presentation'}
      className={`card-grid-item card${card.id} ${
        clickable ? '-clickable' : ''
      } ${isSpymaster ? `-spymaster-view -${card.agentType}-agent` : ''}
      ${card.flipped ? `-flipped -${card.agentType}-agent` : ''}`}
      onClick={() => onClick && onClick(card)}
    >
      {card.word}
    </div>
  );
}
