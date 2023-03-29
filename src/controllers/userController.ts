import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppErrors';
import { IUser } from '../helpers/dto';
import { AvaliationService } from '../services/avaliationService';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';
const userServiceInstance = new UserService();
const avaliationServiceInstance = new AvaliationService();

export class UserController {
  async createUser(request: Request, response: Response): Promise<Response> {
    try {
      await userServiceInstance.validateInsert({
        ...(request.body as IUser)
      });
      const user = await userServiceInstance.createUser({
        ...(request.body as IUser)
      });
      const secret = process.env.SECRET ?? 'default';
      const token = jwt.sign({ id: user?.id }, secret, { expiresIn: '1d' });

      return response.status(StatusCodes.OK).send({ user, token });
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async sendAvaliation(request: Request, response: Response): Promise<Response> {
    try {
      const userId = Number(request.params.id);
      const avaliation = Number(request.params.avaliation);
      const aval = await avaliationServiceInstance.addAvaliation({
        avaliation,
        userId
      });
      return response.status(StatusCodes.OK).send(aval);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
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
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
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
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
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
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
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
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getUserAvaliation(request: Request, response: Response): Promise<Response> {
    try {
      const userId = Number(request.params.id);

      const aval = await userServiceInstance.getUserAvaliation([userId]);
      return response.status(StatusCodes.OK).send(aval);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }

  async getUserTeam(request: Request, response: Response): Promise<Response> {
    try {
      const userId = Number(request.params.id);

      const team = await userServiceInstance.getUserTeam(userId);
      if (!team) {
        throw new AppError('User does not belong to a Team', StatusCodes.NOT_FOUND);
      }
      return response.status(StatusCodes.OK).send(team);
    } catch (err) {
      if (err instanceof AppError) { return response.status(err.statusCode).json({ error: err.message }); }
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err instanceof Error ? err.message : 'Failed to do something exceptional' });
    }
  }
}
