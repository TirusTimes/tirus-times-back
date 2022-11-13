import { Request, Response } from "express";
import { ICreateUser } from "../helpers/dto";
import { userService } from "../services/userService";
const userServiceInstance = new userService();

export class userController {
  async createUser(request: Request, response: Response): Promise<Response> {
    try {
      const {
        username,
        firstname,
        lastname,
        email,
        password,
        position,
        age,
        gender,
      }: ICreateUser = request.body;
      const user = await userServiceInstance.createUser({
        username,
        firstname,
        lastname,
        email,
        password,
        position,
        age,
        gender,
      });
      return response.status(201).send(user);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(500).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(500).json({ error: errorMessage });
    }
  }

  async getUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const user = await userServiceInstance.getUserById(Number(id));
      return response.status(201).send(user);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(500).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(500).json({ error: errorMessage });
    }
  }

  async getAllUsers(request: Request, response: Response): Promise<Response> {
    try {
      const users = await userServiceInstance.getAllUsers();
      return response.status(201).send(users);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(500).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(500).json({ error: errorMessage });
    }
  }

  async updateUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const {
        username,
        firstname,
        lastname,
        email,
        password,
        position,
        age,
        gender,
      }: ICreateUser = request.body;
      const updatedUser = await userServiceInstance.updateUser(Number(id), {
        username,
        firstname,
        lastname,
        email,
        password,
        position,
        age,
        gender,
      });
      return response.status(201).send(updatedUser);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(500).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(500).json({ error: errorMessage });
    }
  }

  async deleteUser(request: Request, response: Response): Promise<Response> {
    try {
      const id = request.params.id;
      const deletedUser = await userServiceInstance.deleteUser(Number(id));
      return response.status(201).send(deletedUser);
    } catch (err) {
      if (err instanceof Error) {
        return response.status(500).json({ error: err.message });
      }
      const errorMessage = "Failed to do something exceptional";
      return response.status(500).json({ error: errorMessage });
    }
  }
}
