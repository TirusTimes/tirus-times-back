import { prismaClient } from '../database/prismaClient';
import { IUser } from '../helpers/dto';

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

    const createdUser = await prismaClient.user.create({
      data: user
    });

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
      throw new Error('Username already exists');
    }
  }

  async getUserById(id: Number) {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: Number(id)
      }
    });

    delete user.password;
    return user;
  }

  async getAllUsers() {
    const users = await prismaClient.user.findMany();
    const usersWithoutPasswords = users.map(user => {
      delete user.password;
      return user;
    });
    return usersWithoutPasswords;
  }

  async updateUser(
    id: Number,
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
    this.verifyIfExists(id);

    const updatedUser = await prismaClient.user.update({
      where: {
        id: Number(id)
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
    delete updatedUser.password;
    return updatedUser;
  }

  private async verifyIfExists(id: Number) {
    prismaClient.user.findFirstOrThrow({
      where: {
        id: Number(id)
      }
    });
  }

  async deleteUser(id: Number) {
    this.verifyIfExists(id);
    const deletedUser = await prismaClient.user.delete({
      where: {
        id: Number(id)
      }
    });
    delete deletedUser.password;
    return deletedUser;
  }
}

export { UserService };
