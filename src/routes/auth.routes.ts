import { Router } from 'express';
import { AuthController } from '../controllers/AuthControler';

const authRoutes = Router();

const authControllerInstance = new AuthController();

authRoutes.post('/auth', authControllerInstance.authenticate);

export { authRoutes };
