export interface Player {
  id: number
  name: string
  avaliation: number
}

export interface Team {
  team: Player[]
  power: number
}

export async function generateTeams(players: Player[]): Promise<{ teams: Team[], playersInBench: Player[] }> {
  players.sort((a, b) => b.avaliation - a.avaliation);
  
  const numTeams = Math.floor(players.length / 6);
  const numPlayersInTeams = numTeams * 6;
  const playersInTeams = players.slice(0, numPlayersInTeams);
  const playersInBench = players.slice(numPlayersInTeams);

  const teams: Team[] = [];
  for (let i = 0; i < numTeams; i++) {
    teams.push({ team: [], power: 0 });
  }

  for (let i = 0; i < numPlayersInTeams; i++) {
    const player = playersInTeams[i];
    let minPower = Infinity;
    let minTeamIndex = 0;
    for (let j = 0; j < numTeams; j++) {
      const teamPower = teams[j].power;
      if (teamPower < minPower && teams[j].team.length < 6) {
        minPower = teamPower;
        minTeamIndex = j;
      }
    }
    teams[minTeamIndex].team.push(player);
    teams[minTeamIndex].power += player.avaliation;
  }

  return {teams, playersInBench};
}
