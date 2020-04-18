import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { auth, db } from '../../services/firebase';
import { GAME_STATUSES } from '../../helpers/constants';
import { shufflePlayersIntoTeams, setTimer } from '../../helpers/utilities';

import { shuffleWords, ALL_WORDS } from '../../helpers/word-lists';
import LoggedInLayout from '../../components/logged-in-layout';

export default function WaitingRoom({ gameData, updateGameData }) {
  const user = auth().currentUser;

  const startGame = () => {
    const [team1, team2] = shufflePlayersIntoTeams(gameData.players);
    const wordList = shuffleWords(ALL_WORDS);
    const updatedGameData = {
      ...gameData,
      status: GAME_STATUSES.IN_PROGRESS,
      team1: { score: 0, players: team1 },
      team2: { score: 0, players: team2 },
      currentWord: wordList[0],
      currentTalker: { team: 'team1', talker: team1[0] },
      currentTurn: 0,
      currentRound: 1,
      timer: setTimer(),
      wordList,
    };

    updateGameData(updatedGameData);
  };

  const canStartGame = gameData.players.length >= 4;

  return (
    <LoggedInLayout>
      <div>Get ready for some wonderful fun.</div>
      <div>
        Players:
        <ul>
          {gameData.players.map((player) => {
            return <li key={player.uid}>{player.displayName}</li>;
          })}
        </ul>
      </div>

      {!canStartGame && <p>You need at least 4 players to start a game</p>}

      {canStartGame && (
        <p>
          Make sure everyone is in a video or audio chat together before you
          start, or this will be quite hard to play.
        </p>
      )}
      <button onClick={() => startGame()} disabled={!canStartGame}>
        Start
      </button>
    </LoggedInLayout>
  );
}
