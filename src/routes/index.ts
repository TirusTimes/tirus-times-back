import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { groupRoutes } from './group.routes';
import { matchRoutes } from './match.routes';
import { userRoutes } from './user.routes';

const router = Router();

router.use('/', userRoutes);
router.use('/', authRoutes);
router.use('/', groupRoutes);
router.use('/', matchRoutes);

export default router;
