
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../database/prismaClient';
import { AppError } from '../errors/AppErrors';
import { IAvaliation } from '../helpers/dto';
import { avaliationSchemaCreate } from '../helpers/schemas';

class AvaliationService {
  async addAvaliation(data: IAvaliation) {
    avaliationSchemaCreate.validate(data, {
      abortEarly: true
    }).catch((err) => {
      throw new Error(err);
    });

    const {
      avaliation,
      userId
    } = data;

    const id = Number(userId);
    const user = await this.getUserById(id);

    if (!user) {
      throw new AppError('User does not exist', StatusCodes.NOT_FOUND);
    }

    const addAvaliationToDb = await prismaClient.userAvaliations.create({
      data: {
        avaliation: {
          create: {
            avaliation
          }
        },
        user: {
          connect: {
            id
          }
        }
      }
    });
    return addAvaliationToDb;
  }

  async getUserById(id: number) {
    const user = await prismaClient.user.findFirst({
      where: {
        id
      }
    });

    return user;
  }
}

export { AvaliationService };
