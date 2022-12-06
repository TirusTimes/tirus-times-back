
import { prismaClient } from '../database/prismaClient';
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
      throw new Error('Username already exists');
    }
  }

  async getUserById(id: Number) {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: Number(id)
      }
    });

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
    // @ts-expect-error
    delete updatedUser.password;
    return updatedUser;
  }

  async verifyIfExists(id: Number) {
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
    // @ts-expect-error
    delete deletedUser.password;
    return deletedUser;
  }

  async getGroupsByUser(id: Number) {
    this.verifyIfExists(id);
    const users = prismaClient.group.findMany({
      where: {
        users: {
          some: {
            userId: Number(id)
          }
        }
      }
    });
    return await users;
  }
}

export { UserService };
