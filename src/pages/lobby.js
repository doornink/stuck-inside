import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { auth, db } from '../services/firebase';

import { GAME_STATUSES } from '../helpers/constants';

import GamePreview from '../components/game-preview/game-preview';
import LoggedInLayout from '../components/logged-in-layout';

export default function Profile() {
  const history = useHistory();
  const user = auth().currentUser;
  const [readError, setReadError] = useState(null);
  const [writeError, setWriteError] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    try {
      db.ref('games').on('value', (snapshot) => {
        let games = [];
        snapshot.forEach((game) => {
          console.log(game);
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
    console.log(newGameKey);
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
    console.log(game.key);
    const players = game.players.concat([getPlayerObject()]);
    console.log(players);
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

  console.log(games);
  return (
    <LoggedInLayout title="Lobby" error={readError || writeError}>
      <div class="lobby">
        <div className="lobby-top">
          <button className="new-game-button" onClick={() => createNewGame()}>
            New Game
          </button>
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
              return (
                <GamePreview
                  game={game}
                  handleJoinGameClick={onJoinGameClick}
                />
              );
            })}
          </div>
        )}
        <div>{writeError}</div>
      </div>
    </LoggedInLayout>
  );
}
