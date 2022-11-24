import { Router } from "express";
import { userController } from "../controllers/userController";
const userRoutes = Router();

const userControllerInstance = new userController();

userRoutes.post('/users', userControllerInstance.createUser)
userRoutes.get('/users/:id', userControllerInstance.getUser)
userRoutes.get('/users', userControllerInstance.getAllUsers)
userRoutes.put('/users/:id', userControllerInstance.updateUser)
userRoutes.delete('/users/:id', userControllerInstance.deleteUser)

export { userRoutes };

