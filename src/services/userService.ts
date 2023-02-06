
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../database/prismaClient';
import { AppError } from '../errors/AppErrors';
import { IUser } from '../helpers/dto';
import { schemaCreateUser } from '../helpers/schemas';

class UserService {
  async createUser({
    username,
    firstname,
    lastname,
    email,
    password,
    position,
    age,
    gender
  }: IUser) {
    const user = {
      username,
      firstname,
      lastname,
      email,
      password,
      position,
      age,
      gender
    };

    schemaCreateUser
      .validate(user, {
        abortEarly: false
      })
      .catch((err) => {
        throw new Error(err.name);
      });

    this.validateInsert(user);

    const createdUser = await prismaClient.user.create({
      data: user
    });

    // @ts-expect-error
    delete createdUser.password;
    return createdUser;
  }

  async validateInsert(userToCreate: IUser) {
    const user = await prismaClient.user.findFirst({
      where: {
        username: userToCreate.username
      }
    });

    if (user) {
      throw new AppError('Username already exists', StatusCodes.BAD_GATEWAY);
    }
  }

  async getUserById(id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    // @ts-expect-error
    delete user.password;
    return user;
  }

  async getAllUsers() {
    const users = await prismaClient.user.findMany();
    const usersWithoutPasswords = users.map(user => {
      // @ts-expect-error
      delete user.password;
      return user;
    });
    return usersWithoutPasswords;
  }

  async updateUser(
    id: number,
    newData: IUser
  ) {
    const {
      username,
      firstname,
      lastname,
      email,
      password,
      position,
      age,
      gender
    } = newData;
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id
      },
      data: {
        username,
        firstname,
        lastname,
        email,
        password,
        position,
        age,
        gender
      }
    });
    // @ts-expect-error
    delete updatedUser.password;
    return updatedUser;
  }

  async verifyIfExists(id: number) {
    await prismaClient.user.findFirstOrThrow({
      where: {
        id
      }
    });
  }

  async getGroupsByUser(id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    const users = await prismaClient.group.findMany({
      where: {
        users: {
          some: {
            id
          }
        }
      }
    });
    return users;
  }

  async getUserAvaliation(id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const avaliations = await prismaClient.userAvaliations.findMany({
      where: {
        userId: {
          equals: id
        }
      },
      include: {
        avaliation: true
      }
    });

    if (!avaliations.length) {
      return { avaliation: 50, userId: id };
    }

    let avaliationResult = 0;
    avaliations.forEach(({ avaliation }) => {
      if (avaliation.avaliation) {
        avaliationResult += avaliation.avaliation;
      }
    });

    return { avaliation: avaliationResult / avaliations.length, userId: id };
  }

  async getUserTeam(id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    const team = await prismaClient.team.findFirst({
      where: {
        users: {
          some: {
            id
          }
        }
      }
    });

    return team;
  }
}

export { UserService };
