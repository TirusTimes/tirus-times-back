import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "yup";
import { UserController } from "../controllers/userController";
import { schemaCreate, schemaUpdate } from "../helpers/schemas";
import authMiddleware from "../middlewares/authMiddleware";
const userRoutes = Router();

const userControllerInstance = new UserController();

const validateCreateUser = async (request: Request, response: Response, next: NextFunction) => {
    await schemaCreate.validate(request.body, {abortEarly: false}).then(() => {
        next();
    }).catch((errors: ValidationError)  => {
        const payloadErrors = errors.inner.map(err => ({field: err.path, message: err.message}));
        response.status(StatusCodes.BAD_REQUEST).json({errors: payloadErrors})
    })
}

const validateUpdateUser = async (request: Request, response: Response, next: NextFunction) => {
    await schemaUpdate.validate(request.body, {abortEarly: false}).then(() => {
        next();
    }).catch((errors: ValidationError)  => {
        const payloadErrors = errors.inner.map(err => ({field: err.path, message: err.message}));
        response.status(StatusCodes.BAD_REQUEST).json({errors: payloadErrors})
    })
}

userRoutes.post('/users', validateCreateUser, userControllerInstance.createUser)
userRoutes.get('/users/:id', userControllerInstance.getUser)
userRoutes.get('/users', userControllerInstance.getAllUsers)
userRoutes.put('/users/:id', authMiddleware,validateUpdateUser, userControllerInstance.updateUser)
userRoutes.delete('/users/:id', userControllerInstance.deleteUser)

export { userRoutes };

