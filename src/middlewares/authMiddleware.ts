import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  const token = authorization.split(' ')[1];
  const secret = process.env.SECRET ?? 'default';

  try {
    jwt.verify(token, secret);
    return next();
  } catch (err) {
    return response.sendStatus(StatusCodes.UNAUTHORIZED);
  }
}
