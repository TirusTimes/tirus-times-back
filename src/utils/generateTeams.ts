export interface Player {
  id: number
  name: string
  avaliation: number
}

export interface Team {
  team: Player[]
  power: number
}

export async function generateTeams(players: Player[]): Promise<Team[]> {
  const teams: Team[] = [];
  const playersTemp = [...players];
  const length = playersTemp.length;

  for (let i = 0; i < 2; i++) {
    let avaliationTeam = 0;

    const playersIndex = Array.from({ length: length / 2 }, (_, i) => i);

    const shuffle = (array: number[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const teamIndex = shuffle(playersIndex).slice(0, 6);

    const team = teamIndex.map(index => playersTemp[index]);

    team.forEach(x => {
      avaliationTeam += x.avaliation;
      playersTemp.splice(playersTemp.indexOf(x), 1);
    });

    teams.push({ team, power: avaliationTeam });
  }

  while (Math.abs(teams[0].power - teams[1].power) > 40) {
    const maxPlayer = teams[0].team.reduce((prev, current) => (prev.avaliation > current.avaliation ? prev : current));
    const minPlayer = teams[1].team.reduce((prev, current) => (prev.avaliation < current.avaliation ? prev : current));
    teams[0].team.splice(teams[0].team.indexOf(maxPlayer), 1);
    teams[0].power -= maxPlayer.avaliation;
    teams[1].team.splice(teams[1].team.indexOf(minPlayer), 1);
    teams[1].power -= minPlayer.avaliation;

    teams[0].team.push(minPlayer);
    teams[0].power += minPlayer.avaliation;
    teams[1].team.push(maxPlayer);
    teams[1].power += maxPlayer.avaliation;
  }
  return teams;
}
