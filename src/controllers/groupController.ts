import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GroupService } from '../services/groupService';
import { IGroup } from './../helpers/dto';

const groupServiceInstance = new GroupService();

export class GroupController {
  async createGroup(request: Request, response: Response): Promise<Response> {
    try {
      const group = await groupServiceInstance.createGroup({
        ...(request.body as IGroup)
      });
      return response.status(StatusCodes.OK).send(group);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getGroup(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const group = await groupServiceInstance.getGroupById(Number(id));
      return response.status(StatusCodes.OK).send(group);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getAllGroups(request: Request, response: Response): Promise<Response> {
    try {
      const groups = await groupServiceInstance.getAllGroups();
      return response.status(StatusCodes.OK).send(groups);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async updateGroup(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const updatedGroup = await groupServiceInstance.updateGroup(Number(id), {
        ...(request.body as IGroup)
      });
      return response.status(StatusCodes.OK).send(updatedGroup);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async acceptInvite(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = request.params.id;
      const userId = request.params.userId;
      const groupOwner = request.params.adminId;
      const insertedUser = await groupServiceInstance.acceptInvite(
        Number(userId),
        Number(groupId),
        groupOwner
      );
      return response.status(StatusCodes.OK).send(insertedUser);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : "User couldn't be added to group" });
    }
  }

  async rejectInvite(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = Number(request.params.id);
      const userId = Number(request.params.userId);

      const invite = await groupServiceInstance.rejectInvite(groupId, userId);
      return response.status(StatusCodes.OK).send(invite);
    } catch (err) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: err instanceof Error ? err.message : "Rejection couldn't be completed" });
    }
  }

  async sendInvite(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = Number(request.params.id);
      const userId = Number(request.params.userId);

      const invite = await groupServiceInstance.sendInvite(groupId, userId);
      return response.status(StatusCodes.OK).send(invite);
    } catch (err) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: err instanceof Error ? err.message : "Application to group couldn't be completed" });
    }
  }

  async getGroupsInvite(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = Number(request.params.id);
      const groupOwner = request.params.adminId;

      const invites = await groupServiceInstance.getGroupInvites(groupId, groupOwner);
      return response.status(StatusCodes.OK).send(invites);
    } catch (err) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: err instanceof Error ? err.message : 'Invites not found' });
    }
  }

  async removeUser(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = request.params.id;
      const userId = request.params.userId;
      const removedUser = await groupServiceInstance.removeUser(
        Number(userId),
        Number(groupId)
      );
      return response.status(StatusCodes.OK).send(removedUser);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = request.params.id;
      const users = await groupServiceInstance.getUsersByGroup(Number(groupId));
      return response.status(StatusCodes.OK).send(users);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }
}
