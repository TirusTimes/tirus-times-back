import { Router } from 'express';
import { AvaliationController } from '../controllers/AvaliationController';
import { UserController } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const avaliationRoutes = Router();

const avaliationControllerInstance = new AvaliationController();
const userControllerInstance = new UserController();

avaliationRoutes.post('/avaliation', authMiddleware, avaliationControllerInstance.avaliation);
avaliationRoutes.get('/avaliation/:id', authMiddleware, userControllerInstance.getUserAvaliation);

export { avaliationRoutes };
