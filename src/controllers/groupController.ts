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
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }

  async getGroup(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const group = await groupServiceInstance.getGroupById(Number(id));
      return response.status(StatusCodes.OK).send(group);
    } catch (err) {
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }

  async getAllGroups(request: Request, response: Response): Promise<Response> {
    try {
      const groups = await groupServiceInstance.getAllGroups();
      return response.status(StatusCodes.OK).send(groups);
    } catch (err) {
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
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
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }

  async deleteGroup(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const deletedGroup = await groupServiceInstance.deleteGroup(Number(id));
      return response.status(StatusCodes.OK).send(deletedGroup);
    } catch (err) {
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }

  async insertUser(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = request.params.id;
      const userId = request.params.userId;
      const insertedUser = await groupServiceInstance.insertUser(
        Number(userId),
        Number(groupId)
      );
      return response.status(StatusCodes.OK).send(insertedUser);
    } catch (err) {
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
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
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const groupId = request.params.id;
      const users = await groupServiceInstance.getUsersByGroup(Number(groupId));
      return response.status(StatusCodes.OK).send(users);
    } catch (err) {
      if (err instanceof Error) {
        return response
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message });
      }
      const errorMessage = 'Failed to do something exceptional';
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  }
}
