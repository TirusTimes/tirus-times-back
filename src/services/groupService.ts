import { prismaClient } from '../database/prismaClient';
import { groupSchemaCreate } from '../helpers/schemas';
import { IGroup } from './../helpers/dto';
import { UserService } from './userService';

const userServiceInstance = new UserService();

class GroupService {
  async createGroup({ name, adminID }: IGroup) {
    const group = {
      name,
      adminID
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

  async insertUser(userId: number, groupId: number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const userGroup = prismaClient.group.update({
      where: {
        id: groupId
      },
      data: {
        users: {
          connect: {
            id: userId
          }
        }
      }
    });
    return await userGroup;
  }

  async removeUser(userId: number, groupId: number) {
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const removedUserGroup = await prismaClient.group.update({
      where: {
        id: groupId
      },
      data: {
        users: {
          delete: {
            id: userId
          }
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
            id
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
