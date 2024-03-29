import { Router } from 'express';

import { GroupController } from '../controllers/groupController';
import authMiddleware from '../middlewares/authMiddleware';

const groupRoutes = Router();

const groupControllerInstance = new GroupController();

groupRoutes.post('/groups', authMiddleware, groupControllerInstance.createGroup);
groupRoutes.get('/groups/:id', authMiddleware, groupControllerInstance.getGroup);
groupRoutes.get('/groups', authMiddleware, groupControllerInstance.getAllGroups);
groupRoutes.put('/groups/:id', authMiddleware, groupControllerInstance.updateGroup);
groupRoutes.get('/groups/:id/users', authMiddleware, groupControllerInstance.getAllUsers);
groupRoutes.delete('/groups/:id/removeUser/:userId', authMiddleware, groupControllerInstance.removeUser);

// INVITES SERVICES
groupRoutes.post('/group/:id/owner/:adminId/insertUser/:userId', authMiddleware, groupControllerInstance.acceptInvite);
groupRoutes.post('/group/:id/user/:userId', authMiddleware, groupControllerInstance.sendInvite);
groupRoutes.put('/group/:id/user/:userId', authMiddleware, groupControllerInstance.rejectInvite);
groupRoutes.get('/group/:id/owner/:adminId', authMiddleware, groupControllerInstance.getGroupsInvite);

export { groupRoutes };
