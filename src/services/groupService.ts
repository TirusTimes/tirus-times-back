import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../database/prismaClient';
import { AppError } from '../errors/AppErrors';
import { groupSchemaCreate } from '../helpers/schemas';
import { IGroup } from './../helpers/dto';
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
    const group = await prismaClient.group.findFirst({
      where: {
        id
      }
    });
    if (!group) {
      throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    }
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
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
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
    const invite = await prismaClient.inviteUser.create({
      data: {
        userId,
        groupId,
        status: 'WAITING'
      }
    });

    return invite;
  }

  async rejectInvite(groupId: number, userId: number) {
    this.verifyIfExists(groupId);
    const invite = await prismaClient.inviteUser.update({
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

    return invite;
  }

  async getGroupInvites(groupId: number, owner: string) {
    this.verifyGroupOwner(groupId, Number(owner));
    const invite = await prismaClient.inviteUser.findMany({
      where: {
        groupId,
        status: {
          equals: 'WAITING'
        }
      }
    });
    return invite;
  }

  async removeUser(userId: number, groupId: number) {
    this.verifyIfExists(groupId);
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
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
    const group = prismaClient.group.findFirst({
      where: {
        id
      }
    });

    if (!group) {
      throw new AppError('Group not found', StatusCodes.NOT_FOUND);
    }
  }

  private async verifyGroupOwner(id: number, adminID: number) {
    const group = prismaClient.group.findFirst({
      where: {
        id,
        adminID
      }
    });
    if (!group) {
      throw new AppError('Group not found ', StatusCodes.NOT_FOUND);
    }
  }
}

export { GroupService };
