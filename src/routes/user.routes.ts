import { Router } from 'express';
import { UserController } from '../controllers/userController';
import authMiddleware from "../middlewares/authMiddleware";
const userRoutes = Router();

const userControllerInstance = new UserController();

userRoutes.post('/users', userControllerInstance.createUser)
userRoutes.get('/users/:id', userControllerInstance.getUser)
userRoutes.get('/users', userControllerInstance.getAllUsers)
userRoutes.put('/users/:id', authMiddleware, userControllerInstance.updateUser)
userRoutes.delete('/users/:id', userControllerInstance.deleteUser)

export { userRoutes };

