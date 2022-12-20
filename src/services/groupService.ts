import { IGroup } from './../helpers/dto';
import { prismaClient } from '../database/prismaClient';
import { UserService } from './userService';
import { groupSchemaCreate } from '../helpers/schemas';

const userServiceInstance = new UserService();

class GroupService {
  async createGroup({ name }: IGroup) {
    const group = {
      name
    };
    groupSchemaCreate
      .validate(group, {
        abortEarly: false
      })
      .catch((err) => {
        throw new Error(err.name);
      });
    const createdGroup = await prismaClient.group.create({
      data: group
    });
    return createdGroup;
  }

  async getGroupById(id: number) {
    const group = await prismaClient.group.findFirstOrThrow({
      where: {
        id
      }
    });
    return group;
  }

  async getAllGroups() {
    const groups = await prismaClient.group.findMany();
    return groups;
  }

  async updateGroup(id: number, { name }: IGroup) {
    this.verifyIfExists(id);
    const group = {
      name
    };
    const updatedGroup = await prismaClient.group.update({
      where: {
        id
      },
      data: group
    });
    return updatedGroup;
  }

  async deleteGroup(id: number) {
    this.verifyIfExists(id);
    await prismaClient.userGroup.deleteMany({
      where: {
        groupId: id
      }
    });
    const deletedGroup = await prismaClient.group.delete({
      where: {
        id
      }
    });
    return deletedGroup;
  }

  async insertUser(userId: number, groupId: number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const userGroup = prismaClient.userGroup.create({
      data: {
        userId,
        groupId
      }
    });
    return await userGroup;
  }

  async removeUser(userId: number, groupId: number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const removedUserGroup = await prismaClient.userGroup.delete({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });
    return removedUserGroup;
  }

  async getUsersByGroup(id: number) {
    this.verifyIfExists(id);
    const users = await prismaClient.user.findMany({
      where: {
        groups: {
          some: {
            groupId: id
          }
        }
      }
    });
    return users;
  }

  private async verifyIfExists(id: number) {
    prismaClient.group.findFirstOrThrow({
      where: {
        id
      }
    });
  }
}

export { GroupService };
