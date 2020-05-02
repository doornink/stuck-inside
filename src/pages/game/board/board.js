import React, { Component } from 'react';
import './board.css';

import { auth } from '../../../services/firebase';
import {
  shouldShowClue,
  nextTurn,
  setTimer,
  getRoundWinner,
  canUserChallenge,
} from '../../../helpers/utilities';
import PlayerCard from '../../../components/player-card/player-card';
import LoggedInLayout from '../../../components/logged-in-layout';
import { GAME_STATUSES } from '../../../helpers/constants';
import Button from '../../../components/button/button';
import TimerWrapper from '../../../components/timer-wrapper/timer-wrapper';
import ChallengeModal from '../../../components/challenge-modal/challenge-modal';
import Score from '../../../components/score/score';

export default class GameBoard extends Component {
  state = {
    user: auth().currentUser,
    isUserCurrentTalker:
      auth().currentUser.uid === this.props.currentTalker.talker.uid,
    timeLeft: this.props.timerLength,
    throttleKey: false,
  };

  componentWillMount() {
    document.addEventListener('keydown', this.handleUserKeyPress, false);
    if (
      this.props.timerLength &&
      !this.props.betweenRounds &&
      !this.props.challengeInProgress
    ) {
      this.setState({ timeLeft: this.props.timerLength }, () => {
        this.tickTimer();
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleUserKeyPress, false);
  }

  componentWillReceiveProps(nextProps, prevState) {
    if (this.props.betweenRounds && !nextProps.betweenRounds) {
      this.setState({ timeLeft: nextProps.timerLength }, () => {
        this.tickTimer();
      });
    }

    if (
      nextProps.currentTalker.talker.uid !== this.props.currentTalker.talker.uid
    ) {
      this.setState({
        isUserCurrentTalker:
          this.state.user.uid === nextProps.currentTalker.talker.uid,
      });
    }

    if (!this.props.challengeInProgress && nextProps.challengeInProgress) {
      clearTimeout(this.timerTimeout);
    }

    if (this.props.challengeInProgress && !nextProps.challengeInProgress) {
      this.tickTimer(true);
    }
  }

  transitionToNextTurn = () => {
    const { gameData, updateGameData } = this.props;
    const newCurrentTurn = gameData.currentTurn + 1;

    const updatedGameData = {
      ...gameData,
      currentTalker: nextTurn(gameData),
      currentTurn: newCurrentTurn,
      currentWord: gameData.wordList[newCurrentTurn],
    };

    updateGameData(updatedGameData);
  };

  // do all the things to end the round and prep the next round
  transitionToNextRound = (
    lastRoundChallenged = false,
    noPointsAwarded = false
  ) => {
    const { betweenRounds, gameData, updateGameData } = this.props;
    const newCurrentTurn = gameData.currentTurn + 1;
    const newCurrentRound = gameData.currentRound + 1;

    // if round already ended before triggered here, don't repeat it
    if (betweenRounds) {
      return false;
    }

    // find out who should get a point
    const roundWinner = getRoundWinner(gameData);
    let newScore = gameData[roundWinner].score + 1;
    // if there was a challenge that was ignored the round changes with
    // no points awarded to either team
    if (noPointsAwarded) {
      newScore = newScore - 1;
    }

    const updatedGameData = {
      ...gameData,
      challengeInProgress: null,
      currentTalker: nextTurn(gameData),
      currentTurn: newCurrentTurn,
      currentRound: newCurrentRound,
      currentWord: gameData.wordList[newCurrentTurn],
      betweenRounds: true,
      [roundWinner]: {
        ...gameData[roundWinner],
        score: newScore,
      },
      status: newScore >= 7 ? GAME_STATUSES.DONE : GAME_STATUSES.IN_PROGRESS,
      wordList: newScore >= 7 ? [] : gameData.wordList,
      lastRoundChallenged: lastRoundChallenged,
    };

    updateGameData(updatedGameData);
  };

  transitionOutOfBetweenRoundChallenge = (wasChallengeIgnored) => {
    const { gameData, updateGameData } = this.props;
    let updatedGameData;
    if (!wasChallengeIgnored) {
      // the current talkers team should lose their point to the other team
      const pointLoser =
        gameData.currentTalker.team === 'team1' ? 'team1' : 'team2';
      const pointGainer =
        gameData.currentTalker.team === 'team1' ? 'team2' : 'team1';

      updatedGameData = {
        ...gameData,
        [pointLoser]: {
          ...gameData[pointLoser],
          score: gameData[pointLoser].score - 1,
        },
        [pointGainer]: {
          ...gameData[pointGainer],
          score: gameData[pointGainer].score + 1,
        },
        challengeInProgress: null,
        lastRoundChallenged: true,
      };
    } else {
      // no change, just end challenge
      updatedGameData = {
        ...gameData,
        challengeInProgress: null,
        lastRoundChallenged: true,
      };
    }

    updateGameData(updatedGameData);
  };

  startRound = () => {
    const { gameData, updateGameData } = this.props;

    const updatedGameData = {
      ...gameData,
      timer: setTimer(),
      betweenRounds: false,
      lastRoundChallenged: false,
    };

    updateGameData(updatedGameData);
  };

  handleUserKeyPress = (event) => {
    if (this.props.challengeInProgress || this.state.throttleKey) {
      return false;
    }
    this.setState({ throttleKey: true });

    if (this.state.isUserCurrentTalker) {
      if (this.props.gameData.betweenRounds) {
        // put a delay on this so people can challange and so people don't accidentally start a new round when trying to challenge
        this.startRound();
      } else {
        this.transitionToNextTurn();
      }
    } else if (canUserChallenge(this.props.gameData, this.state.user)) {
      this.challengeTheTurn(this.state.user.displayName);
    }
    setTimeout(() => {
      this.setState({ throttleKey: false });
    }, 1000);
  };

  challengeTheTurn = () => {
    const challenger = this.state.user.displayName;
    const { gameData, updateGameData } = this.props;

    const updatedGameData = {
      ...gameData,
      challengeInProgress: {
        challenger,
        accepts: [],
        ignores: [],
        unanswered: gameData.players,
      },
    };

    updateGameData(updatedGameData);
  };

  timerTimeout = null;
  tickTimer = (overrideChallenge = false) => {
    if (this.props.challengeInProgress && !overrideChallenge) {
      return;
    }
    const { timeLeft } = this.state;
    if (timeLeft === 0) {
      this.transitionToNextRound();
    } else if (!this.props.gameData.betweenRounds) {
      this.timerTimeout = setTimeout(() => {
        this.setState({ timeLeft: timeLeft - 1 });
        this.tickTimer();
      }, 1000);
    }
  };

  render() {
    const { gameData } = this.props;
    const { isUserCurrentTalker, user } = this.state;

    const showTheClue = shouldShowClue(gameData, user);

    return (
      <React.Fragment>
        <LoggedInLayout
          error={this.props.error}
          colorTheme={isUserCurrentTalker ? 'green' : 'dark'}
        >
          <div
            className={`game-board ${
              isUserCurrentTalker ? 'current-turn' : ''
            }`}
          >
            <div className="team-1">
              <Score score={gameData.team1.score} />
              <div className="team-name">Team 1</div>
              {gameData.team1.players.map((player) => {
                return (
                  <PlayerCard
                    player={player}
                    gameData={gameData}
                    highlighted={
                      gameData.currentTalker.talker.uid === player.uid
                    }
                  />
                );
              })}
            </div>
            <div className="board-main">
              <h1>Round {gameData.currentRound}</h1>
              <div className="first-to-7">(first team to 7 wins)</div>
              {isUserCurrentTalker ? (
                <div>
                  {gameData.betweenRounds ? (
                    <div className="on-the-clock">
                      <h3>You are up! Click below to start the round.</h3>
                      <Button onClick={() => this.startRound()}>
                        Start Round (Hit any key)
                      </Button>
                    </div>
                  ) : (
                    <React.Fragment>
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
                      <Button onClick={() => this.transitionToNextTurn()}>
                        Got it! (Hit any key)
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              ) : (
                <React.Fragment>
                  {gameData.betweenRounds ? (
                    <div className="on-the-clock">
                      <h3>
                        Waiting for {gameData.currentTalker.talker.displayName}{' '}
                        to start the next round
                      </h3>
                      {!gameData.lastRoundChallenged && (
                        <Button onClick={() => this.challengeTheTurn(true)}>
                          Challenge previous round
                        </Button>
                      )}
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
                        <React.Fragment>
                          <div className="clue">
                            <h3>The phrase is</h3>
                            <h1>{gameData.currentWord}</h1>
                          </div>
                          <div className="challenge-button">
                            <Button onClick={() => this.challengeTheTurn()}>
                              Challenge! (Hit any key)
                            </Button>
                          </div>
                        </React.Fragment>
                      ) : (
                        <div className="clue">
                          <h3>Guess the phrase!</h3>
                          <h1>???</h1>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {/* <div>
              There are three things you may not give as a clue: 1) A word that
              rhymes with the word. 2) The first letter of the word. 3) Part of
              the word (ie shoe for shoe horn)
            </div> */}
            </div>

            <div className="team-2">
              <Score score={gameData.team2.score} />
              <div className="team-name">Team 2</div>
              {gameData.team2.players.map((player) => {
                return (
                  <PlayerCard
                    player={player}
                    gameData={gameData}
                    highlighted={
                      gameData.currentTalker.talker.uid === player.uid
                    }
                    reversed
                  />
                );
              })}
            </div>
          </div>

          {this.props.challengeInProgress && (
            <ChallengeModal
              updateGameData={this.props.updateGameData}
              gameData={this.props.gameData}
              transitionToNextRound={this.transitionToNextRound}
              transitionOutOfBetweenRoundChallenge={
                this.transitionOutOfBetweenRoundChallenge
              }
            />
          )}
        </LoggedInLayout>

        <TimerWrapper
          timeLeft={this.state.timeLeft}
          timerLength={this.props.timerLength}
          timerPaused={gameData.betweenRounds || !!gameData.challengeInProgress}
        />
      </React.Fragment>
    );
  }
}
