import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ICreateUser } from "../helpers/dto";
import { userService } from "../services/userService";
const userServiceInstance = new userService();

export class userController {
  async createUser(request: Request, response: Response): Promise<Response> {
    try {
      const user = await userServiceInstance.createUser({
        ...request.body as ICreateUser
      });
      return response.status(StatusCodes.OK).send(user);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async getUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const user = await userServiceInstance.getUserById(Number(id));
      return response.status(StatusCodes.OK).send(user);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const users = await userServiceInstance.getAllUsers();
      return response.status(StatusCodes.OK).send(users);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async updateUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const updatedUser = await userServiceInstance.updateUser(Number(id), {
        ...request.body as ICreateUser
      });
      return response.status(StatusCodes.OK).send(updatedUser);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }

  async deleteUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const deletedUser = await userServiceInstance.deleteUser(Number(id));
      return response.status(StatusCodes.OK).send(deletedUser);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
    }
  }
}
