export const shufflePlayersIntoTeams = (players) => {
  let team1 = [];
  let team2 = [];

  players.forEach((player) => {
    if (Math.round(Math.random())) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  [team1, team2] = evenOutSides(team1, team2);

  return [team1, team2];
};

const evenOutSides = (team1, team2) => {
  if (team1.length - team2.length > 1) {
    team2.push(team1.pop());
    [team1, team2] = evenOutSides(team1, team2);
  } else if (team2.length - team1.length > 1) {
    team1.push(team2.pop());
    [team1, team2] = evenOutSides(team1, team2);
  }

  return [team1, team2];
};

// set a random time in seconds between 30 and 75 seconds
export const setTimer = () => {
  const baseSeconds = 30;
  const variationSeconds = 45;
  return Math.round(Math.random() * variationSeconds + baseSeconds);
};

export const nextTurn = (gameData) => {
  const { team1, currentTalker } = gameData;

  if (!currentTalker) {
    return { team: 'team1', talker: team1[0] };
  }

  if (currentTalker.team === 'team1') {
    return { team: 'team2', talker: getTalker('team2', gameData) };
  } else {
    return { team: 'team1', talker: getTalker('team1', gameData) };
  }
};

const getTalker = (team, gameData) => {
  const { currentTurn, team1, team2 } = gameData;

  const teamTurn = Math.floor(currentTurn / 2);

  // turns start at 0 so even turns are team1 but each team gets a 'teamTurn = 0' (every number)
  if (team === 'team1') {
    const playerIndex = teamTurn % team1.players.length;
    return team1.players[playerIndex];
  } else {
    const playerIndex = teamTurn % team2.players.length;
    return team2.players[playerIndex];
  }
};

export const shouldShowClue = (gameData, user) => {
  const { currentTalker, team1, team2 } = gameData;

  const isUserOnTeam1 = team1.players.find((player) => player.uid === user.uid);
  const isUserOnTeam2 = team2.players.find((player) => player.uid === user.uid);
  const isUserCurrentTalker = currentTalker.talker.uid === user.uid;

  if (isUserCurrentTalker) {
    return true;
  } else if (currentTalker.team === 'team1' && isUserOnTeam2) {
    return true;
  } else if (currentTalker.team === 'team2' && isUserOnTeam1) {
    return true;
  }

  // hide the clue if your team is up and you aren’t the currentTalker
  return false;
};
