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

  async acceptInvite(userId: number, groupId: number, adminId: string) {
    this.verifyGroupOwner(groupId, Number(adminId));
    this.verifyIfExists(groupId);
    userServiceInstance.verifyIfExists(userId);
    const userGroup = await prismaClient.group.update({
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

    await prismaClient.inviteUser.update({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      },
      data: {
        status: 'ACCEPTED'
      }
    });
    return userGroup;
  }

  async sendInvite(groupId: number, userId: number) {
    this.verifyIfExists(groupId);
    await prismaClient.inviteUser.create({
      data: {
        userId,
        groupId
      }
    });
  }

  async rejectInvite(groupId: number, userId: number) {
    this.verifyIfExists(groupId);
    await prismaClient.inviteUser.update({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      },
      data: {
        status: 'REJECTED'
      }
    });
  }

  async getGroupInvites(groupId: number, owner: string) {
    this.verifyGroupOwner(groupId, Number(owner));
    await prismaClient.inviteUser.findMany({
      where: {
        AND: [{ groupId }, { status: 'WAITING' }]
      }
    });
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

  private async verifyGroupOwner(id: number, adminID: number) {
    prismaClient.group.findFirstOrThrow({
      where: {
        id,
        adminID
      }
    });
  }
}

export { GroupService };
