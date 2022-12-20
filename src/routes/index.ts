import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { groupRoutes } from './group.routes';
import { userRoutes } from './user.routes';

const router = Router();

router.use('/', userRoutes);
router.use('/', authRoutes);
router.use('/', groupRoutes);

export default router;
