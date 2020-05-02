import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './lobby.css';

import { auth, db } from '../../services/firebase';

import { GAME_STATUSES } from '../../helpers/constants';

import GamePreview from '../../components/game-preview/game-preview';
import LoggedInLayout from '../../components/logged-in-layout';
import Button from '../../components/button/button';

export default function Profile() {
  const history = useHistory();
  const user = auth().currentUser;
  const [readError, setReadError] = useState(null);
  const [writeError, setWriteError] = useState(null);
  const [games, setGames] = useState([]);

  // observe games for changes
  useEffect(() => {
    try {
      db.ref('games').on('value', (snapshot) => {
        let games = [];
        snapshot.forEach((game) => {
          games.push({ ...game.val(), key: game.key });
        });
        setGames(games);
      });
    } catch (error) {
      setReadError(error.message);
    }
  }, []);

  const getPlayerObject = () => {
    return {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  };

  const createNewGame = async () => {
    setWriteError(null);
    var newGameKey = db.ref('games').push().key;

    try {
      await db.ref(`/games/${newGameKey}`).set({
        players: [getPlayerObject()],
        timestamp: Date.now(),
        status: GAME_STATUSES.WAITING_TO_START,
      });
    } catch (error) {
      setWriteError(error.message);
    } finally {
      history.push(`/game/${newGameKey}`);
    }
  };

  const onJoinGameClick = async (game) => {
    setWriteError(null);

    // TODO - double check that player isn't already in the list
    const players = game.players.concat([getPlayerObject()]);

    try {
      await db.ref(`/games/${game.key}`).set({
        ...game,
        players,
      });
    } catch (error) {
      setWriteError(error.message);
    }

    history.push(`/game/${game.key}`);
  };

  const gamesWaitingToStart = games.filter(
    (game) => game.status === GAME_STATUSES.WAITING_TO_START
  );

  const gamesInProgress = games.filter(
    (game) => game.status === GAME_STATUSES.IN_PROGRESS
  );

  return (
    <LoggedInLayout title="Lobby" error={readError || writeError}>
      <div className="lobby">
        <div className="lobby-top">
          <Button onClick={() => createNewGame()}>New Game</Button>
        </div>
        {gamesWaitingToStart.length > 0 && (
          <div className="games-list starting-games">
            <h2>Games about to start</h2>
            {gamesWaitingToStart.map((game) => {
              return (
                <GamePreview
                  game={game}
                  handleJoinGameClick={onJoinGameClick}
                />
              );
            })}
          </div>
        )}

        {gamesInProgress.length > 0 && (
          <div className="games-list in-progress-games">
            <h2>Games in progress</h2>
            {gamesInProgress.map((game) => {
              return <GamePreview game={game} />;
            })}
          </div>
        )}
        <div>{writeError}</div>
      </div>
    </LoggedInLayout>
  );
}
