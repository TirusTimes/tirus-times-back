import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../helpers/dto';
import { UserService } from '../services/userService';
const userServiceInstance = new UserService();

export class UserController {
  async createUser(request: Request, response: Response): Promise<Response> {
    try {
      await userServiceInstance.validateInsert({
        ...(request.body as IUser)
      });
      const user = await userServiceInstance.createUser({
        ...(request.body as IUser)
      });
      return response.status(StatusCodes.OK).send(user);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const user = await userServiceInstance.getUserById(Number(id));
      return response.status(StatusCodes.OK).send(user);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const users = await userServiceInstance.getAllUsers();
      return response.status(StatusCodes.OK).send(users);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async updateUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const updatedUser = await userServiceInstance.updateUser(Number(id), {
        ...(request.body as IUser)
      });
      return response.status(StatusCodes.OK).send(updatedUser);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getAllUserGroups(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.params.id;
      const groups = await userServiceInstance.getGroupsByUser(Number(userId));
      return response.status(StatusCodes.OK).send(groups);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getUserAvaliation(request: Request, response: Response): Promise<Response> {
    try {
      const userId = Number(request.params.id);

      const aval = await userServiceInstance.getUserAvaliation(userId);
      return response.status(StatusCodes.OK).send(aval);
    } catch (err) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }
}
