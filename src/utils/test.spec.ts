import { generateTeams, Player, Team } from './generateTeams';

describe('generateTeams', () => {
  // Mock de jogadores para uso nos testes
  const players: Player[] = [
    { id: 1, name: 'Player 1', avaliation: 80 },
    { id: 2, name: 'Player 2', avaliation: 90 },
    { id: 3, name: 'Player 3', avaliation: 85 },
    { id: 4, name: 'Player 4', avaliation: 70 },
    { id: 5, name: 'Player 5', avaliation: 75 },
    { id: 6, name: 'Player 6', avaliation: 95 },
    { id: 7, name: 'Player 7', avaliation: 65 },
    { id: 8, name: 'Player 8', avaliation: 60 },
    { id: 9, name: 'Player 9', avaliation: 55 },
    { id: 10, name: 'Player 10', avaliation: 50 },
    { id: 11, name: 'Player 11', avaliation: 45 },
    { id: 12, name: 'Player 12', avaliation: 40 }
  ];

  test('should generate two teams with 6 players each', () => {
    const teams: Team[] = generateTeams(players);
    console.log('times ', teams);
    expect(teams).toHaveLength(2);
    expect(teams[0].team).toHaveLength(6);
    expect(teams[1].team).toHaveLength(6);
  });

  test('should distribute players evenly between teams', () => {
    const teams: Team[] = generateTeams(players);

    const teamOneTotalAvaliation = teams[0].team.reduce((total, player) => total + player.avaliation, 0);
    const teamTwoTotalAvaliation = teams[1].team.reduce((total, player) => total + player.avaliation, 0);

    expect(teamOneTotalAvaliation).toBeGreaterThanOrEqual(teamTwoTotalAvaliation - 40);
    expect(teamOneTotalAvaliation).toBeLessThanOrEqual(teamTwoTotalAvaliation + 40);
  });

  test('should calculate team powers correctly', () => {
    const teams: Team[] = generateTeams(players);

    const teamOnePower = teams[0].team.reduce((total, player) => total + player.avaliation, 0);
    const teamTwoPower = teams[1].team.reduce((total, player) => total + player.avaliation, 0);

    expect(teams[0].power).toEqual(teamOnePower);
    expect(teams[1].power).toEqual(teamTwoPower);
  });
});
