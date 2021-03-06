import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { db } from '../../services/firebase';
import { GAME_STATUSES, GAME_TYPES } from '../../helpers/constants';

import WaitingRoom from './waiting-room/waiting-room';
import Catchphrase from './catchphrase/catchphrase';
import GameOver from './game-over/game-over';
import Codenames from './codenames/codenames';

export default function Game() {
  const { id } = useParams();

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
    // console.log(updatedGameData);

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

          {gameData.status === GAME_STATUSES.IN_PROGRESS &&
            gameData.gameType === GAME_TYPES.CATCHPHRASE && (
              <Catchphrase
                betweenRounds={gameData.betweenRounds}
                currentRound={gameData.currentRound}
                currentTalker={gameData.currentTalker}
                currentTurn={gameData.currentTurn}
                currentWord={gameData.currentWord}
                challengeInProgress={gameData.challengeInProgress}
                timerLength={gameData.timer}
                error={readError || writeError}
                gameData={gameData}
                updateGameData={updateGameData}
              />
            )}

          {(gameData.status === GAME_STATUSES.IN_PROGRESS ||
            gameData.status === GAME_STATUSES.DONE) &&
            gameData.gameType === GAME_TYPES.CODENAMES && (
              <Codenames
                error={readError || writeError}
                gameData={gameData}
                updateGameData={updateGameData}
              />
            )}

          {gameData.status === GAME_STATUSES.DONE &&
            gameData.gameType !== GAME_TYPES.CODENAMES && (
              <GameOver gameData={gameData} />
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
