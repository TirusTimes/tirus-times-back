import { Router } from 'express';

import { GroupController } from '../controllers/groupController';
import authMiddleware from '../middlewares/authMiddleware';

const groupRoutes = Router();

const groupControllerInstance = new GroupController();

groupRoutes.post('/groups', authMiddleware, groupControllerInstance.createGroup);
groupRoutes.get('/groups/:id', authMiddleware, groupControllerInstance.getGroup);
groupRoutes.get('/groups', authMiddleware, groupControllerInstance.getAllGroups);
groupRoutes.put('/groups/:id', authMiddleware, groupControllerInstance.updateGroup);
groupRoutes.delete('/groups/:id', authMiddleware, groupControllerInstance.deleteGroup);
groupRoutes.post('/groups/:id/insertUser/:userId', authMiddleware, groupControllerInstance.insertUser);
groupRoutes.get('/groups/:id/users', authMiddleware, groupControllerInstance.getAllUsers);
groupRoutes.delete('/groups/:id/removeUser/:userId', authMiddleware, groupControllerInstance.removeUser);

export { groupRoutes };
