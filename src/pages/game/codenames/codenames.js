import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './codenames.css';
import '../board/board.css';

import { auth, db } from '../../../services/firebase';
// import {
//   setTimer,
// } from '../../../helpers/utilities/catchphrase-utilities';
import {
  getUsersTeamName,
  isUserSpymaster,
  isUserOnBlueTeam,
  isUserOnRedTeam,
  getTeamTurn,
  setInitialGridData,
  isThereAWinner,
  getTeamScore,
  getGameOutcome,
} from '../../../helpers/utilities/codenames-utilities';
import PlayerCard from '../../../components/player-card/player-card';
import LoggedInLayout from '../../../components/logged-in-layout';
import Button from '../../../components/button/button';
import Score from '../../../components/score/score';
import CardGrid from './card-grid';
import { GAME_STATUSES, GAME_TYPES } from '../../../helpers/constants';
import CodenamesRules from './rules';

class Codenames extends Component {
  state = {
    user: auth().currentUser,
    showRules: false,
  };

  componentWillReceiveProps(nextProps, prevState) {}

  transitionToNextTurn = () => {
    const { gameData, updateGameData } = this.props;
    const newCurrentTurn = gameData.currentTurn + 1;

    const updatedGameData = {
      ...gameData,
      currentTurn: newCurrentTurn,
    };

    updateGameData(updatedGameData);
  };

  selectSpymaster = (player) => {
    const { gameData, updateGameData } = this.props;

    const teamToUpdate = isUserOnRedTeam(gameData, player) ? 'red' : 'blue';

    const updatedGameData = {
      ...gameData,
      [teamToUpdate]: {
        ...gameData[teamToUpdate],
        spymaster: player,
      },
    };

    updateGameData(updatedGameData);
  };

  startGame = () => {
    const { gameData, updateGameData } = this.props;

    const updatedGameData = {
      ...gameData,
      settingUpGame: false,
      gridData: setInitialGridData(gameData.wordList),
    };

    updateGameData(updatedGameData);
  };

  selectCard = (card) => {
    if (!card.flipped) {
      const { gameData, updateGameData } = this.props;

      const { gridData } = gameData;

      gridData[card.id].flipped = true;

      const winner = isThereAWinner(gameData);

      const updatedGameData = {
        ...gameData,
        gridData,
        winner,
      };

      updateGameData(updatedGameData);
    }
  };

  handleBackToLobbyClick = () => {
    this.props.history.push('/lobby');
  };

  handleRematch = async () => {
    var newGameKey = db.ref('games').push().key;

    try {
      await db.ref(`/games/${newGameKey}`).set({
        players: this.props.gameData.players,
        timestamp: Date.now(),
        status: GAME_STATUSES.WAITING_TO_START,
        gameType: GAME_TYPES.CODENAMES,
        key: newGameKey,
      });
    } catch (error) {
    } finally {
      this.props.history.push(`/game/${newGameKey}`);
    }
  };

  render() {
    const { gameData } = this.props;
    const { user } = this.state;

    const isSpymaster = isUserSpymaster(gameData, user);
    const canPlayTurn =
      !isSpymaster &&
      getTeamTurn(gameData) === getUsersTeamName(gameData, user);

    return (
      <LoggedInLayout error={this.props.error} logoTitle="Codenames!">
        <div className="game-board codenames">
          <div className="team-1">
            <Score score={getTeamScore(gameData, 'red')} color="red" />
            <div className="needs-score">
              <h5>Needs 9</h5>
            </div>
            <div className="team-name -red">Red Team</div>
            {gameData.red.players.map((player) => {
              return (
                <PlayerCard
                  key={player.uid}
                  player={player}
                  gameData={gameData}
                  highlighted={isUserSpymaster(gameData, player)}
                  onClick={
                    !!gameData.settingUpGame &&
                    !!isUserOnRedTeam(gameData, user)
                      ? () => this.selectSpymaster(player)
                      : null
                  }
                />
              );
            })}
          </div>
          <div className="board-main">
            {gameData.settingUpGame ? (
              <div className="setup-container">
                <h2>
                  Decide among your team which player will be the Spymaster for
                  this game and click on their name.
                </h2>
                {gameData.red.spymaster && (
                  <h2 className="-red space">
                    The Red Team has chosen{' '}
                    <strong>{gameData.red.spymaster.displayName}</strong> as
                    their Spymaster
                  </h2>
                )}
                {gameData.blue.spymaster && (
                  <h2 className="-blue space">
                    The Blue Team has chosen{' '}
                    {gameData.blue.spymaster.displayName} as their Spymaster
                  </h2>
                )}

                {gameData.red.spymaster && gameData.blue.spymaster && (
                  <Button onClick={() => this.startGame()}>
                    Click here when both teams are ready to start
                  </Button>
                )}

                <CodenamesRules />
              </div>
            ) : (
              <React.Fragment>
                <h5>Current Turn</h5>
                <h1 className={`-${getTeamTurn(gameData)}`}>
                  {getTeamTurn(gameData) === 'red' ? 'Red' : 'Blue'} Team
                </h1>

                {canPlayTurn && (
                  <Button
                    data-color={getUsersTeamName(gameData, user)}
                    onClick={() => this.transitionToNextTurn()}
                  >
                    Done with turn
                  </Button>
                )}

                <CardGrid
                  gameData={gameData}
                  team={getUsersTeamName(gameData, user)}
                  isSpymaster={isSpymaster}
                  onClick={canPlayTurn ? (tile) => this.selectCard(tile) : null}
                />
              </React.Fragment>
            )}
          </div>

          <div className="team-2">
            <Score score={getTeamScore(gameData, 'blue')} color="blue" />
            <div className="needs-score">
              <h5>Needs 8</h5>
            </div>
            <div className="team-name -blue">Blue Team</div>
            {gameData.blue.players.map((player) => {
              return (
                <PlayerCard
                  key={player.uid}
                  player={player}
                  gameData={gameData}
                  highlighted={isUserSpymaster(gameData, player)}
                  reversed
                  clickable={
                    !!gameData.settingUpGame &&
                    !!isUserOnBlueTeam(gameData, user)
                  }
                  onClick={
                    !!gameData.settingUpGame &&
                    !!isUserOnBlueTeam(gameData, user)
                      ? () => this.selectSpymaster(player)
                      : null
                  }
                />
              );
            })}
          </div>

          {gameData.winner && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className={`-${gameData.winner}`}>
                  Congratulations {gameData.winner === 'red' ? 'Red' : 'Blue'}{' '}
                  Team, you win!!
                </h2>

                <div className="space" />

                <div className="winners-circle">
                  {gameData[gameData.winner].players.map((player) => {
                    return (
                      <PlayerCard
                        key={player.uid}
                        player={player}
                        gameData={gameData}
                        onClick={
                          !!gameData.settingUpGame &&
                          !!isUserOnRedTeam(gameData, user)
                            ? () => this.selectSpymaster(player)
                            : null
                        }
                      />
                    );
                  })}
                </div>

                <div className="space-large" />

                <h3>{getGameOutcome(gameData)}</h3>

                <div className="button-group">
                  <Button onClick={this.handleBackToLobbyClick}>
                    Back to Lobby
                  </Button>
                  <Button onClick={this.handleRematch}>Rematch!</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </LoggedInLayout>
    );
  }
}

export default withRouter(Codenames);
