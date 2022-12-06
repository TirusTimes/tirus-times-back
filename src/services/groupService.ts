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

  async getGroupById(id: Number) {
    const group = await prismaClient.group.findFirstOrThrow({
      where: {
        id: Number(id)
      }
    });
    return group;
  }

  async getAllGroups() {
    const groups = await prismaClient.group.findMany();
    return groups;
  }

  async updateGroup(id: Number, { name }: IGroup) {
    this.verifyIfExists(id);
    const group = {
      name
    };
    const updatedGroup = await prismaClient.group.update({
      where: {
        id: Number(id)
      },
      data: group
    });
    return updatedGroup;
  }

  async deleteGroup(id: Number) {
    this.verifyIfExists(id);
    await prismaClient.userGroup.deleteMany({
      where: {
        groupId: Number(id)
      }
    });
    const deletedGroup = await prismaClient.group.delete({
      where: {
        id: Number(id)
      }
    });
    return deletedGroup;
  }

  async insertUser(userId: Number, groupId: Number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const userGroup = prismaClient.userGroup.create({
      data: {
        userId: Number(userId),
        groupId: Number(groupId)
      }
    });
    return await userGroup;
  }

  async removeUser(userId: Number, groupId: Number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const removedUserGroup = await prismaClient.userGroup.delete({
      where: {
        userId_groupId: {
          userId: Number(userId),
          groupId: Number(groupId)
        }
      }
    });
    return removedUserGroup;
  }

  async getUsersByGroup(id: Number) {
    this.verifyIfExists(id);
    const users = await prismaClient.user.findMany({
      where: {
        groups: {
          some: {
            groupId: Number(id)
          }
        }
      }
    });
    return users;
  }

  private async verifyIfExists(id: Number) {
    prismaClient.group.findFirstOrThrow({
      where: {
        id: Number(id)
      }
    });
  }
}

export { GroupService };
