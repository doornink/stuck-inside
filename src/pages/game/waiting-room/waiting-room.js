import React from 'react';
import './waiting-room.css';

import { GAME_STATUSES } from '../../../helpers/constants';
import { shufflePlayersIntoTeams } from '../../../helpers/utilities';

import { shuffleWords, ALL_WORDS } from '../../../helpers/word-lists';
import LoggedInLayout from '../../../components/logged-in-layout';
import Button from '../../../components/button/button';
import PlayerCard from '../../../components/player-card/player-card';

export default function WaitingRoom({ gameData, updateGameData }) {
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
      betweenRounds: true,
      wordList,
    };

    updateGameData(updatedGameData);
  };

  const canStartGame = gameData.players.length >= 4;

  return (
    <LoggedInLayout title="New Game">
      <div className="waiting-room">
        <div className="space-large">
          <h3>Waiting to play:</h3>
          <div className="player-list">
            {gameData.players.map((player) => {
              return <PlayerCard player={player} />;
            })}
          </div>
        </div>
        <div className="button-message">
          {!canStartGame
            ? 'You need at least 4 players to start a game'
            : 'Make sure everyone is in a video or audio chat together before you start, or this will be quite hard to play.'}
        </div>
        <Button onClick={() => startGame()} disabled={!canStartGame}>
          Start
        </Button>
      </div>
    </LoggedInLayout>
  );
}
