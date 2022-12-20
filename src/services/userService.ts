
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

  async getUserById(id: number) {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id
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
    this.verifyIfExists(id);

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
    prismaClient.user.findFirstOrThrow({
      where: {
        id
      }
    });
  }

  async deleteUser(id: number) {
    this.verifyIfExists(id);
    await prismaClient.userGroup.deleteMany({
      where: {
        userId: id
      }
    });
    const deletedUser = await prismaClient.user.delete({
      where: {
        id
      }
    });
    // @ts-expect-error
    delete deletedUser.password;
    return deletedUser;
  }

  async getGroupsByUser(id: number) {
    this.verifyIfExists(id);
    const users = await prismaClient.group.findMany({
      where: {
        users: {
          some: {
            userId: id
          }
        }
      }
    });
    return users;
  }
}

export { UserService };
