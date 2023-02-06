import { randomBytes } from 'crypto';
import { promisify } from 'util';

const random = promisify(randomBytes);

export interface Player {
  id: number
  name: string
  avaliation?: number
}

export interface Team {
  team: Player[]
  power: number
}

export async function generateTeams(players: Player[]): Promise<Team[]> {
  const teams: Team[] = [];
  const playersTemp = [...players];

  for (let i = 0; i < 4; i++) {
    let avaliationTeam = 0;

    const playersIndex = Array.from({ length: 5 }, (_, i) => i);
    const shuffle = async (array: number[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = (await random(1))[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    const teamIndex = (await shuffle(playersIndex)).slice(0, 5);

    const team = teamIndex.map(index => playersTemp[index]);

    team.forEach(x => {
      avaliationTeam += (x?.avaliation ?? 50);
      playersTemp.splice(playersTemp.indexOf(x), 1);
    });

    teams.push({ team, power: avaliationTeam });
  }

  if (calculateBalance(teams) < 0.2) {
    return teams;
  } else {
    return await generateTeams(players);
  }
}

function calculateBalance(teams: Team[]): number {
  const bestTeam = teams.reduce((prev, current) => (prev.power > current.power ? prev : current));
  const worstTeam = teams.reduce((prev, current) => (prev.power < current.power ? prev : current));

  const balance = bestTeam.power - worstTeam.power;

  return balance;
}
