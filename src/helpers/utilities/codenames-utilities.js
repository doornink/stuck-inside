export const isUserOnRedTeam = (gameData, user) => {
  const { red } = gameData;

  return !!red.players.find((player) => player.uid === user.uid);
};

export const isUserOnBlueTeam = (gameData, user) => {
  const { blue } = gameData;

  return !!blue.players.find((player) => player.uid === user.uid);
};

export const getUsersTeamName = (gameData, user) => {
  const { red, blue } = gameData;

  if (!!red.players.find((player) => player.uid === user.uid)) {
    return 'red';
  }
  if (!!blue.players.find((player) => player.uid === user.uid)) {
    return 'blue';
  }
  return null;
};

export const getTeamScore = (gameData, team) => {
  return gameData.gridData
    ? gameData.gridData.filter(
        (card) => card.agentType === team && card.flipped
      ).length
    : 0;
};

export const isUserSpymaster = (gameData, user) => {
  const { red, blue } = gameData;

  return (
    (red.spymaster && red.spymaster.uid === user.uid) ||
    (blue.spymaster && blue.spymaster.uid === user.uid)
  );
};

export const getTeamsSpymaster = (gameData, team) => {
  const { red, blue } = gameData;

  return team === 'red' ? red.spymaster : blue.spymaster;
};

// odd turns are team red, even team blue
export const getTeamTurn = (gameData) => {
  return gameData.currentTurn % 2 === 0 ? 'blue' : 'red';
};

export const isUsersTurn = (gameData, user) => {
  return (
    ((isUserOnRedTeam(gameData, user) && getTeamTurn(gameData) === 'red') ||
      (isUserOnRedTeam(gameData, user) && getTeamTurn(gameData) === 'blue')) &&
    !isUserSpymaster(gameData, user)
  );
};

const times = function (n, iterator) {
  var accum = Array(Math.max(0, n));
  for (var i = 0; i < n; i++) accum[i] = iterator.call();
  return accum;
};

export const setInitialGridData = (wordList) => {
  // 9 red agents, 8 blue agents, 1 assassin, 7 neutral
  const redAgents = times(9, () => {
    return { agentType: 'red', order: Math.random() };
  });
  const blueAgents = times(8, () => {
    return { agentType: 'blue', order: Math.random() };
  });
  const assassin = times(1, () => {
    return { agentType: 'assassin', order: Math.random() };
  });
  const neutralAgents = times(7, () => {
    return { agentType: 'neutral', order: Math.random() };
  });
  const allAgents = redAgents.concat(
    blueAgents.concat(assassin.concat(neutralAgents))
  );

  const agentMapping = allAgents.sort((a, b) => a.order - b.order);

  return wordList.map((word, i) => {
    return {
      id: i,
      word,
      assignment: null,
      flipped: false,
      agentType: agentMapping[i].agentType,
    };
  });
};

export const isThereAWinner = (gameData) => {
  // assassin card is flipped
  // all cards for a team flipped

  const flippedRed = gameData.gridData.filter(
    (card) => card.agentType === 'red' && card.flipped
  );
  const flippedBlue = gameData.gridData.filter(
    (card) => card.agentType === 'blue' && card.flipped
  );

  if (
    gameData.gridData.find(
      (card) => card.agentType === 'assassin' && card.flipped
    )
  ) {
    return getTeamTurn(gameData) === 'red' ? 'blue' : 'red';
  } else if (flippedBlue && flippedBlue.length === 8) {
    return 'blue';
  } else if (flippedRed && flippedRed.length === 9) {
    return 'red';
  }

  return false;
};

export const getGameOutcome = (gameData) => {
  const { winner } = gameData;

  const assassinCard = gameData.gridData.find(
    (card) => card.agentType === 'assassin'
  );

  if (assassinCard.flipped) {
    return `The ${winner === 'red' ? 'Blue' : 'Red'} Team chose ${
      assassinCard.word
    }, which was the Assassin Card. Better luck next time.`;
  } else {
    return `The ${
      winner === 'red' ? 'Blue' : 'Red'
    } Team found all their words. Outstanding!`;
  }
};
