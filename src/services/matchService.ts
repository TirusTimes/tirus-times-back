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

  async separateTeams(matchId: number) {
    const users = await prismaClient.user.findMany({
      where: {
        matchs: {
          some: {
            id: matchId
          }
        }
      }
    });

    if (!users) {
      throw new Error('No users found for this match');
    }
    const player: Player[] = [];

    users.forEach(async (user) => {
      const aval = await userServiceInstance.getUserAvaliation(user.id);
      player.push({ id: user.id, name: user.firstname + ' ' + user.lastname, avaliation: aval });
    });

    const teams = await generateTeams(player);
    this.applyTeamToUser(teams);
    return teams;
  }

  applyTeamToUser(teams: Team[]) {
    teams.forEach(async (team) => {
      const teamCreate = await prismaClient.team.create({
        data: {}
      });
      team.team.forEach(async (player) => {
        await prismaClient.user.update({
          where: {
            id: player.id
          },
          data: {
            teamId: teamCreate.id
          }
        });
      });
    });
  }
}

export { MatchService };
