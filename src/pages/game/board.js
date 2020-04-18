import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { auth, db } from '../../services/firebase';
import { GAME_STATUSES } from '../../helpers/constants';
import {
  shufflePlayersIntoTeams,
  setTimer,
  shouldShowClue,
  nextTurn,
} from '../../helpers/utilities';
import PlayerCard from '../../components/player-card/player-card';
import LoggedInLayout from '../../components/logged-in-layout';
import { cleanup } from '@testing-library/react';

class ActionPanel extends React.Component {
  constructor(props) {
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }
  escFunction(event) {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }
  render() {
    return <input />;
  }
}

export default function GameBoard({ gameData, updateGameData, error }) {
  const user = auth().currentUser;

  const [isUserCurrentTalker, setIsUserCurrentTalker] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const transitionToNextTurn = useCallback(() => {
    const newCurrentTurn = gameData.currentTurn + 1;

    const updatedGameData = {
      ...gameData,
      currentTalker: nextTurn(gameData),
      currentTurn: newCurrentTurn,
      currentWord: gameData.wordList[newCurrentTurn],
    };

    updateGameData(updatedGameData);
  }, [gameData, updateGameData]);

  const handleUserKeyPress = useCallback(
    (event) => {
      if (event.keyCode === 32) {
        console.log(
          'handleUserKeyPress SPACE BAR, is Current Talker??',
          isUserCurrentTalker
        );
        if (isUserCurrentTalker) {
          transitionToNextTurn();
        }
      }
    },
    [isUserCurrentTalker, transitionToNextTurn]
  );

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    });
  }, [gameData.timer]);

  useEffect(() => {
    document.addEventListener('keydown', handleUserKeyPress, false);
    return function cleanup() {
      console.count('removeEventListener');
      document.removeEventListener('keydown', handleUserKeyPress, false);
    };
  });

  useEffect(() => {
    console.log('this runs too');
    setIsUserCurrentTalker(user.uid === gameData.currentTalker.talker.uid);
  }, [gameData]);

  const showTheClue = shouldShowClue(gameData, user);

  return (
    <LoggedInLayout error={error} showAlternateColors={!isUserCurrentTalker}>
      <div
        className={`game-board ${isUserCurrentTalker ? 'current-turn' : ''}`}
      >
        <div className="team-1">
          <div className="team-score">{gameData.team1.score}</div>
          <div className="team-name">Team 1</div>
          {gameData.team1.players.map((player) => {
            return <PlayerCard player={player} gameData={gameData} />;
          })}
        </div>
        <div className="board-main">
          <h1>Temp! {gameData.timer}</h1>
          <h1>Round {gameData.currentRound}</h1>
          {isUserCurrentTalker ? (
            <div>
              <div className="on-the-clock">
                <h3>YOU ARE ON THE CLOCK!</h3>
                <h1>
                  {gameData.currentTalker.talker.displayName} (
                  {gameData.currentTalker.team})
                </h1>
              </div>
              <div className="clue">
                <h3>Your phrase is</h3>
                <h1>{gameData.currentWord}</h1>
              </div>
              <button onClick={() => transitionToNextTurn()}>
                Got it! (Space button)
              </button>
            </div>
          ) : (
            <React.Fragment>
              <div className="on-the-clock">
                <h3>On the clock</h3>
                <h1>
                  {gameData.currentTalker.talker.displayName} (
                  {gameData.currentTalker.team})
                </h1>
              </div>
              {showTheClue ? (
                <div className="clue">
                  <h3>The phrase is</h3>
                  <h1>{gameData.currentWord}</h1>
                </div>
              ) : (
                <div className="clue">
                  <h3>Guess the phrase!</h3>
                  <h1>???</h1>
                </div>
              )}
            </React.Fragment>
          )}
        </div>

        <div className="team-2">
          <div className="team-score">{gameData.team2.score}</div>
          <div className="team-name">Team 2</div>
          {gameData.team2.players.map((player) => {
            return <PlayerCard player={player} gameData={gameData} reversed />;
          })}
        </div>
      </div>
    </LoggedInLayout>
  );
}
