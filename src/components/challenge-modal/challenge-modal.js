import React from 'react';

import './challenge-modal.css';
import Button from '../button/button';
import { auth } from 'firebase';

export default function ChallengeModal(props) {
  const user = auth().currentUser;
  const { gameData, updateGameData } = props;
  const challengeData = gameData.challengeInProgress;

  const handleChallengeAccept = () => {
    const accepts = gameData.challengeInProgress.accepts || [];

    const updatedGameData = {
      ...gameData,
      challengeInProgress: {
        ...challengeData,
        accepts: accepts.concat(
          challengeData.unanswered.filter((player) => player.uid === user.uid)
        ),
        unanswered: challengeData.unanswered.filter(
          (player) => player.uid !== user.uid
        ),
      },
    };

    updateGameData(updatedGameData);
  };

  const handleChallengeIgnore = () => {
    const ignores = gameData.challengeInProgress.ignores || [];

    const updatedGameData = {
      ...gameData,
      challengeInProgress: {
        ...challengeData,
        ignores: ignores.concat(
          challengeData.unanswered.filter((player) => player.uid === user.uid)
        ),
        unanswered: challengeData.unanswered.filter(
          (player) => player.uid !== user.uid
        ),
      },
    };

    updateGameData(updatedGameData);
  };

  const handleEndChallenge = () => {
    if (props.gameData.betweenRounds) {
      props.transitionOutOfBetweenRoundChallenge(wasChallengeIgnored());
    }
    // if the round ended because of a challenge, the challenging team (non talking)
    // should get the point, and everything else should transition as normal.
    props.transitionToNextRound(true, wasChallengeIgnored());
  };

  const wasChallengeIgnored = () => {
    return (
      (challengeData.accepts ? challengeData.accepts.length : 0) <=
      (challengeData.ignores ? challengeData.ignores.length : 0)
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {challengeData.unanswered ? (
          <React.Fragment>
            <h2>{challengeData.challenger} has challenged!</h2>
            <p>There are three things you may not give as a clue:</p>
            <ol>
              <li>
                1) A word that <strong>rhymes</strong> with the word.
              </li>
              <li>
                2) The <strong>first letter</strong> of the word.
              </li>
              <li>
                3) Part of the word (ie <strong>shoe</strong> for{' '}
                <strong>shoe</strong> horn)
              </li>
            </ol>

            <h3 className="space-large">
              Were any of these rules broken? Or should play continue?
            </h3>

            <div className="button-group">
              <Button onClick={handleChallengeAccept}>
                Accept Challenge
                <div className="accepters">
                  {challengeData.accepts &&
                    challengeData.accepts.map((player) => {
                      return (
                        <div key={player.uid} className="voter-image">
                          {player.photoURL && (
                            <img
                              src={player.photoURL}
                              alt={player.displayName}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </Button>

              <Button onClick={handleChallengeIgnore}>
                Ignore Challenge
                <div className="rejecters">
                  {challengeData.ignores &&
                    challengeData.ignores.map((player) => {
                      return (
                        <div key={player.uid} className="voter-image">
                          {player.photoURL && (
                            <img
                              src={player.photoURL}
                              alt={player.displayName}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>
              </Button>
            </div>

            <h4 className="vote-note">All players must vote to continue</h4>
            <div className="voter-images">
              {challengeData.unanswered &&
                challengeData.unanswered.map((player) => {
                  return (
                    <div key={player.uid} className="voter-image">
                      {player.photoURL && (
                        <img src={player.photoURL} alt={player.displayName} />
                      )}
                    </div>
                  );
                })}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h2>
              The challenge has been{' '}
              {wasChallengeIgnored() ? 'ignored' : 'accepted'}!
            </h2>
            <div className="space-large">
              <Button onClick={handleEndChallenge}>Resume Play</Button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
