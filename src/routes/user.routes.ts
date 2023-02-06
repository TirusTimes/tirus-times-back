import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'yup';

import { UserController } from '../controllers/userController';
import { avaliationSchemaCreate, schemaCreateUser, schemaUpdateUser } from '../helpers/schemas';
import authMiddleware from '../middlewares/authMiddleware';

const userRoutes = Router();

const userControllerInstance = new UserController();

const validateCreateUser = async (request: Request, response: Response, next: NextFunction) => {
  await schemaCreateUser.validate(request.body, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};

const validateUpdateUser = async (request: Request, response: Response, next: NextFunction) => {
  await schemaUpdateUser.validate(request.body, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};

const validateSendAvaliation = async (request: Request, response: Response, next: NextFunction) => {
  const userId = Number(request.params.id);
  const avaliation = Number(request.params.avaliation);
  await avaliationSchemaCreate.validate({ userId, avaliation }, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};

userRoutes.post('/users', validateCreateUser, userControllerInstance.createUser);
userRoutes.get('/users/:id', authMiddleware, userControllerInstance.getUser);
userRoutes.get('/users', authMiddleware, userControllerInstance.getAllUsers);
userRoutes.put('/users/:id', authMiddleware, validateUpdateUser, userControllerInstance.updateUser);
userRoutes.get('/users/:id/groups', authMiddleware, userControllerInstance.getAllUserGroups);
userRoutes.get('/users/team/:id', authMiddleware, userControllerInstance.getUserTeam);
userRoutes.post('/avaliation/:avaliation/user/:id', authMiddleware, validateSendAvaliation, userControllerInstance.sendAvaliation);
userRoutes.get('/avaliation/:id', authMiddleware, userControllerInstance.getUserAvaliation);

export { userRoutes };
