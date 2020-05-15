import React, { Component } from 'react';
import './codenames.css';
import '../board/board.css';
import Buzzer from '../../../sounds/buzzer.mp3';
import Ding from '../../../sounds/ding.mp3';

import { auth } from '../../../services/firebase';
import {
  nextTurn,
  setTimer,
} from '../../../helpers/utilities/catchphrase-utilities';
import {
  getUsersTeamName,
  isUserSpymaster,
  isUserOnBlueTeam,
  isUserOnRedTeam,
  getTeamTurn,
  setInitialGridData,
  isThereAWinner,
} from '../../../helpers/utilities/codenames-utilities';
import PlayerCard from '../../../components/player-card/player-card';
import LoggedInLayout from '../../../components/logged-in-layout';
import Button from '../../../components/button/button';
import Score from '../../../components/score/score';
import CardGrid from './card-grid';

export default class Codenames extends Component {
  state = {
    user: auth().currentUser,
    buzzer: new Audio(Buzzer),
    ding: new Audio(Ding),
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
    console.log('spymaster selected!', player);
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
    console.log('select tile', card);

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

  render() {
    const { gameData } = this.props;
    const { user } = this.state;

    const isSpymaster = isUserSpymaster(gameData, user);
    const canPlayTurn =
      !isSpymaster &&
      getTeamTurn(gameData) === getUsersTeamName(gameData, user);

    return (
      <LoggedInLayout error={this.props.error}>
        <div className="game-board codenames">
          <div className="team-1">
            <Score score={gameData.red.score} color="red" />
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
                <h3>
                  Decide among your team which player will be the Spymaster for
                  this game and click on their name.
                </h3>
                {gameData.red.spymaster && (
                  <h3 className="-red">
                    The Red Team has chosen {gameData.red.spymaster.displayName}{' '}
                    as their Spymaster
                  </h3>
                )}
                {gameData.blue.spymaster && (
                  <h3 className="-blue">
                    The Blue Team has chosen{' '}
                    {gameData.blue.spymaster.displayName} as their Spymaster
                  </h3>
                )}

                {gameData.red.spymaster && gameData.blue.spymaster && (
                  <Button onClick={() => this.startGame()}>
                    Click here when both teams are ready to start
                  </Button>
                )}
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
            <Score score={gameData.blue.score} color="blue" />
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
        </div>

        {gameData.winner && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{gameData.winner === 'red' ? 'Red' : 'Blue'} Team Wins!!</h2>

              {/* <h3 className="space-large">
                Make sure everyone that wants to play has joined this game
                before starting. Once the game has started they can no longer
                join.
              </h3>

              <div className="button-group">
                <Button onClick={handleConfirmationCancel}>Cancel</Button>
                <Button onClick={startGame}>Yep! Let's go!</Button>
              </div> */}
            </div>
          </div>
        )}
      </LoggedInLayout>
    );
  }
}
