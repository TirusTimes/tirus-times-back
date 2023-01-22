import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { prismaClient } from '../database/prismaClient';

export class AuthController {
  async authenticate(request: Request, response: Response) {
    const { email, password } = request.body;
    const secret = process.env.SECRET ?? 'default';
    const user = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      return response.sendStatus(StatusCodes.NOT_FOUND);
    }

    if (password !== user?.password) {
      return response.sendStatus(StatusCodes.NOT_FOUND);
    }

    const token = jwt.sign({ id: user?.id }, secret, { expiresIn: '1d' });

    // @ts-expect-error
    delete user.password;

    return response.json({
      user,
      token
    });
  }
}
