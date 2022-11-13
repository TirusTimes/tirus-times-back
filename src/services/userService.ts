import { prismaClient } from "../database/prismaClient";
import { ICreateUser } from "../helpers/dto";
import { schemaCreate } from "../helpers/schemas";

class userService {
  async createUser({
    username,
    firstname,
    lastname,
    email,
    password,
    position,
    age,
    gender,
  }: ICreateUser) {
    const user = {
      username,
      firstname,
      lastname,
      email,
      password,
      position,
      age,
      gender,
    };

    this.validateInsert(user);

    const createdUser = await prismaClient.user.create({
      data: user,
    });
    return createdUser;
  }

  private async validateInsert(userToCreate: ICreateUser) {
    const user = await prismaClient.user.findFirst({
      where: {
        username: userToCreate.username,
      },
    });

    if (user) {
      throw new Error("Username already exists");
    }
  }

  async getUserById(id: Number) {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });

    return user;
  }

  async getAllUsers() {
    const users = await prismaClient.user.findMany();
    return users;
  }

  async updateUser(
    id: Number,
    {
      username,
      firstname,
      lastname,
      email,
      password,
      position,
      age,
      gender,
    }: ICreateUser
  ) {
    this.verifyIfExists(id);

    const updatedUser = await prismaClient.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        position: position,
        age: age,
        gender: gender,
      },
    });
    return updatedUser;
  }

  private async verifyIfExists(id: Number) {
    prismaClient.user.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });
  }

  async deleteUser(id: Number) {
    this.verifyIfExists(id);
    const deletedUser = await prismaClient.user.delete({
      where: {
        id: Number(id),
      },
    });
    return deletedUser;
  }
}

export { userService };
