import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { auth, db } from '../services/firebase';
import { GAME_STATUSES } from '../helpers/constants';

import WaitingRoom from './game/waiting-room';
import GameBoard from './game/board';

export default function Game() {
  const { id } = useParams();

  const user = auth().currentUser;
  const [readError, setReadError] = useState(null);
  const [writeError, setWriteError] = useState(null);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    try {
      db.ref(`games/${id}`).on('value', (snapshot) => {
        setGameData(snapshot.val());
      });
    } catch (error) {
      setReadError(error.message);
    }
  }, [id]);

  const updateGameData = async (updatedGameData) => {
    console.log(updatedGameData);

    setWriteError(null);
    try {
      await db.ref(`/games/${gameData.key}`).set({
        ...gameData,
        ...updatedGameData,
      });
    } catch (error) {
      setWriteError(error.message);
    }
  };

  console.log(gameData && gameData.status);

  return (
    <div>
      {gameData && (
        <div>
          {gameData.status === GAME_STATUSES.WAITING_TO_START && (
            <WaitingRoom
              error={readError || writeError}
              gameData={gameData}
              updateGameData={updateGameData}
            />
          )}

          {gameData.status === GAME_STATUSES.IN_PROGRESS && (
            <GameBoard
              error={readError || writeError}
              gameData={gameData}
              updateGameData={updateGameData}
            />
          )}

          {gameData.status === GAME_STATUSES.DONE && (
            <div>{gameData.status}</div>
          )}

          {gameData.status === GAME_STATUSES.CLOSED && (
            <div>{gameData.status}</div>
          )}
        </div>
      )}

      {writeError && <div className="error-message">{writeError}</div>}
    </div>
  );
}
