import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../database/prismaClient';
import { AppError } from '../errors/AppErrors';
import { IMatch, IMatchUpdate, Status } from '../helpers/dto';
import { generateTeams, Player, Team } from '../utils/generateTeams';
import { UserService } from './userService';

const userServiceInstance = new UserService();
class MatchService {
  async createMatch({ adminID, date, location, playerLimit = 12, time, groupId }: IMatch) {
    const admin = await prismaClient.user.findFirst({
      where: {
        id: adminID
      }
    });

    if (!admin) {
      throw new AppError('Admin does not exist', 404);
    }

    const createdMatch = await prismaClient.match.create({
      data: {
        date,
        location,
        playerLimit,
        time,
        groupId
      }
    });
    return createdMatch;
  }

  async getAllMatchs() {
    const matchs = await prismaClient.match.findMany();
    return matchs;
  }

  async getAllUsersByMatch(id: number) {
    this.getMatch(id);
    const users = await prismaClient.user.findMany({
      where: {
        matchs: {
          some: {
            id
          }
        }
      }
    });
    const usersWithoutPasswords = users.map(user => {
      // @ts-expect-error
      delete user.password;
      return user;
    });
    return usersWithoutPasswords;
  }

  async getMatch(id: number) {
    const match = await prismaClient.match.findFirst({
      where: {
        id
      }
    });
    if (!match) {
      throw new AppError('Match does not exists', StatusCodes.NOT_FOUND);
    }
    return match;
  }

  async getMatchByGroupId(id: number) {
    const match = await prismaClient.match.findFirst({
      where: {
        groupId: id
      }
    });
    if (!match) {
      throw new AppError('Match does not exists', StatusCodes.NOT_FOUND);
    }
    return match;
  }

  async updateMatch(
    id: number,
    newData: IMatchUpdate
  ) {
    const {
      adminID,
      location,
      date,
      time,
      playerLimit
    } = newData;

    await this.verifyInput(id, adminID);

    const updatedMatch = await prismaClient.match.update({
      where: {
        id
      },
      data: {
        location,
        date,
        time,
        playerLimit
      }
    });

    return updatedMatch;
  }

  async verifyInput(id: number, adminID: number) {
    const match = await prismaClient.match.findFirst({
      where: {
        id
      }
    });
    if (!match) {
      throw new AppError('Match does not exists', StatusCodes.NOT_FOUND);
    }

    const admin = await prismaClient.user.findFirst({
      where: {
        id: adminID
      }
    });
    if (!admin) {
      throw new AppError('Admin does not exists', StatusCodes.NOT_FOUND);
    }

    const UserIsAdmin = await prismaClient.group.findFirst({
      where: {
        id: match.groupId,
        adminID
      }
    });
    if (!UserIsAdmin) {
      throw new AppError('Not the game admin', StatusCodes.BAD_REQUEST);
    }

    return { match, admin };
  }

  async updateMatchStatus(
    id: number,
    adminID: number,
    status: Status
  ) {
    const { match } = await this.verifyInput(id, adminID);
    if (match.status !== status) {
      const updatedMatch = await prismaClient.match.update({
        where: {
          id
        },
        data: {
          status
        }
      });

      return updatedMatch;
    }
  }

  async enterMatch(playerId: number, matchId: number) {
    const match = await prismaClient.match.findFirst({
      where: {
        id: matchId
      }
    });

    if (!match) {
      return new AppError('Match does not exists', StatusCodes.NOT_FOUND);
    }

    const updatedMatch = await prismaClient.match.update({
      where: {
        id: matchId
      },
      data: {
        players: {
          connect: {
            id: playerId
          }
        }
      }
    });

    return updatedMatch;
  }

  async separateTeams(matchId: number) {
    const match = await prismaClient.match.findFirst({
      where: {
        id: matchId
      },
      include: {
        players: true
      }
    });

    if (!match?.players) {
      throw new Error('No users found for this match');
    }

    const players = await this.getPlayersAvaliation(match.players);

    const teams = await generateTeams(players);
    await this.applyTeamToUser(teams);
    return teams;
  }

  async getPlayersAvaliation(players: User[]): Promise<Player[]> {
    const ids = players.map(player => player.id);
    const avaliations = await userServiceInstance.getUserAvaliation(ids);

    return players.map(player => {
      const playerAvaliation = avaliations.find(avaliation => avaliation.userId === player.id);
      return {
        id: player.id,
        name: player.firstname + ' ' + player.lastname,
        avaliation: playerAvaliation?.avaliation ?? 50
      };
    });
  }

  async applyTeamToUser(teams: Team[]) {
    const team1Ids = teams[0].team.map(player => player.id);
    const team2Ids = teams[1].team.map(player => player.id);
    const createTeam1 = await prismaClient.team.create({
      data: {}
    });
    const createTeam2 = await prismaClient.team.create({
      data: {}
    });

    await prismaClient.user.updateMany({
      where: {
        id: {
          in: team1Ids
        }
      },
      data: {
        teamId: {
          set: createTeam1.id
        }
      }
    });

    await prismaClient.user.updateMany({
      where: {
        id: {
          in: team2Ids
        }
      },
      data: {
        teamId: {
          set: createTeam2.id
        }
      }
    });
  }
}

export { MatchService };
