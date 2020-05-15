import React, { useState } from 'react';
import './waiting-room.css';

import { GAME_STATUSES, GAME_TYPES } from '../../../helpers/constants';
import { shufflePlayersIntoTeams } from '../../../helpers/utilities/catchphrase-utilities';

import {
  shuffleWords,
  ALL_WORDS,
  CODENAMES_ORIGINAL,
} from '../../../helpers/word-lists';
import LoggedInLayout from '../../../components/logged-in-layout';
import Button from '../../../components/button/button';
import PlayerCard from '../../../components/player-card/player-card';

export default function WaitingRoom({ gameData, updateGameData }) {
  const startGame = () => {
    let updatedGameData;
    if (gameData.gameType === GAME_TYPES.CODENAMES) {
      const [red, blue] = shufflePlayersIntoTeams(gameData.players);
      const wordList = shuffleWords(CODENAMES_ORIGINAL, 25);
      updatedGameData = {
        ...gameData,
        status: GAME_STATUSES.IN_PROGRESS,
        red: { score: 0, players: red, spymaster: null },
        blue: { score: 0, players: blue, spymaster: null },
        currentTurn: 1,
        currentRound: 1,
        settingUpGame: true,
        wordList,
      };
    } else if (gameData.gameType === GAME_TYPES.CATCHPHRASE) {
      const [team1, team2] = shufflePlayersIntoTeams(gameData.players);
      const wordList = shuffleWords(ALL_WORDS, 300);
      updatedGameData = {
        ...gameData,
        status: GAME_STATUSES.IN_PROGRESS,
        team1: { score: 0, players: team1 },
        team2: { score: 0, players: team2 },
        currentWord: wordList[0],
        currentTalker: { team: 'team1', talker: team1[0] },
        currentTurn: 1,
        currentRound: 1,
        betweenRounds: true,
        wordList,
      };
    }

    updateGameData(updatedGameData);
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const confrimStartGame = () => {
    setShowConfirmation(true);
  };

  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
  };

  const canStartGame = gameData.players.length >= 4;

  return (
    <LoggedInLayout title={gameData.gameType}>
      <div className="waiting-room">
        <div className="space-large">
          <h3>Waiting to play:</h3>
          <div className="player-list">
            {gameData.players.map((player) => {
              return <PlayerCard key={player.uid} player={player} />;
            })}
          </div>
        </div>
        <div className="button-message">
          {!canStartGame
            ? 'You need at least 4 players to start a game'
            : 'Make sure everyone is in a video or audio chat together before you start, or this will be quite hard to play.'}
        </div>
        <Button onClick={confrimStartGame} disabled={!canStartGame}>
          Start the game
        </Button>

        {showConfirmation && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Are you sure you want to start the game now?</h2>

              <h3 className="space-large">
                Make sure everyone that wants to play has joined this game
                before starting. Once the game has started they can no longer
                join.
              </h3>

              <div className="button-group">
                <Button onClick={handleConfirmationCancel}>Cancel</Button>
                <Button onClick={startGame}>Yep! Let's go!</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoggedInLayout>
  );
}
