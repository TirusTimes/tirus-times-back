import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'yup';

import { MatchController } from '../controllers/matchController';
import { schemaCreateMatch, schemaUpdateMatch, schemaUpdateMatchStatus } from '../helpers/schemas';
import authMiddleware from '../middlewares/authMiddleware';

const matchRoutes = Router();

const matchControllerInstance = new MatchController();

const validateCreateMatch = async (request: Request, response: Response, next: NextFunction) => {
  await schemaCreateMatch.validate(request.body, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};
const validateUpdateMatch = async (request: Request, response: Response, next: NextFunction) => {
  await schemaUpdateMatch.validate(request.body, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};
const validateUpdateMatchStatus = async (request: Request, response: Response, next: NextFunction) => {
  await schemaUpdateMatchStatus.validate(request.body, { abortEarly: false }).then(() => {
    next();
  }).catch((errors: ValidationError) => {
    const payloadErrors = errors.inner.map(err => ({ field: err.path, message: err.message }));
    response.status(StatusCodes.BAD_REQUEST).json({ errors: payloadErrors });
  });
};

matchRoutes.post('/match', validateCreateMatch, authMiddleware, matchControllerInstance.createMatch);
matchRoutes.get('/match', authMiddleware, matchControllerInstance.getAllMatchs);
matchRoutes.put('/match/:id', validateUpdateMatch, authMiddleware, matchControllerInstance.updateMatch);
matchRoutes.patch('/match/:id', validateUpdateMatchStatus, authMiddleware, matchControllerInstance.updateMatchStatus);
matchRoutes.get('/match/:id', authMiddleware, matchControllerInstance.getMatch);

export { matchRoutes };
