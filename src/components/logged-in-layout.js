import React from 'react';
import { auth } from '../services/firebase';
import PlayerCard from './player-card/player-card';
import { useHistory } from 'react-router-dom';
import Logo from './logo/logo';

export default function LoggedInLayout({
  children,
  error,
  title,
  showAlternateColors,
  colorTheme,
  logoTitle,
}) {
  const user = auth().currentUser;
  const history = useHistory();

  const handleProfileClick = () => {
    history.push('/profile');
  };

  if (!colorTheme) {
    colorTheme = 'regular';
  }

  return (
    <div
      className={`main ${colorTheme}-theme ${
        showAlternateColors ? 'dark-theme' : ''
      }`}
    >
      <header>
        <Logo title={logoTitle} />
        <div className="username">
          <PlayerCard
            onClick={handleProfileClick}
            player={user}
            clear
            reversed
          />
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
