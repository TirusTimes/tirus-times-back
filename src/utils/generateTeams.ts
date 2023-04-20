export interface Player {
  id: number
  name: string
  avaliation: number
}

export interface Team {
  team: Player[]
  power: number
}

export function generateTeams(players: Player[]): Team[] {
  // Ordena a lista de jogadores por avaliação em ordem decrescente
  players.sort((a, b) => b.avaliation - a.avaliation);

  const teamOne = [] as Player[];
  const teamTwo = [] as Player[];
  let teamOneTotalAvaliation = 0;
  let teamTwoTotalAvaliation = 0;

  players.forEach((player) => {
    if (teamOne.length < 6 && (teamOneTotalAvaliation + player.avaliation) <= (teamTwoTotalAvaliation + 40)) {
      teamOne.push(player);
      teamOneTotalAvaliation += player.avaliation;
    } else {
      teamTwo.push(player);
      teamTwoTotalAvaliation += player.avaliation;
    }
  });

  // Se o time dois ainda tiver menos de 6 jogadores, complete com os jogadores restantes
  while (teamTwo.length < 6) {
    const remainingPlayer = players.find(player => !teamOne.includes(player) && !teamTwo.includes(player));
    if (remainingPlayer) {
      teamTwo.push(remainingPlayer);
      teamTwoTotalAvaliation += remainingPlayer.avaliation;
    } else {
      break;
    }
  }

  // Calcula o poder de cada time como a soma total de avaliações dos jogadores no time
  const teamOnePower = teamOne.reduce((total, player) => total + player.avaliation, 0);
  const teamTwoPower = teamTwo.reduce((total, player) => total + player.avaliation, 0);

  // Retorna um array de times com as informações de cada time
  return [
    { team: teamOne, power: teamOnePower },
    { team: teamTwo, power: teamTwoPower }
  ];
}
