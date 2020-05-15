import React from 'react';

import './codenames.css';
import CardGridItem from './card-grid-item';

export default function CardGrid({ gameData, team, onClick, isSpymaster }) {
  return (
    <div className={`card-grid -${team}`}>
      {gameData.gridData.map((card) => {
        return (
          <CardGridItem
            key={card.id}
            card={card}
            onClick={onClick}
            isSpymaster={isSpymaster}
          />
        );
      })}
    </div>
  );
}
