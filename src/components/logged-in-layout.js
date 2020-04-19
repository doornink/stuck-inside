import React from 'react';
import { auth } from '../services/firebase';
import PlayerCard from './player-card/player-card';

export default function LoggedInLayout({
  children,
  error,
  title,
  showAlternateColors,
}) {
  const user = auth().currentUser;

  return (
    <div className={`main ${showAlternateColors ? 'dark-mode-colors' : ''}`}>
      <header>
        <div className="title">Catchphrase Yo!</div>
        <div className="username">
          <PlayerCard player={user} clear reversed />
        </div>
      </header>
      <div className="main-content">
        {title && <h1 className="content-title">{title}</h1>}
        {children}
      </div>

      {error && <div>{error}</div>}
      {/* TODO put a donate button in the footer if you put this out somewhere */}
    </div>
  );
}
