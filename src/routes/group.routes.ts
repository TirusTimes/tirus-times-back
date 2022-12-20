import { Router } from 'express';
import { GroupController } from '../controllers/groupController';

const groupRoutes = Router();

const groupControllerInstance = new GroupController();

groupRoutes.post('/groups', groupControllerInstance.createGroup);
groupRoutes.get('/groups/:id', groupControllerInstance.getGroup);
groupRoutes.get('/groups', groupControllerInstance.getAllGroups);
groupRoutes.put('/groups/:id', groupControllerInstance.updateGroup);
groupRoutes.delete('/groups/:id', groupControllerInstance.deleteGroup);
groupRoutes.post('/groups/:id/insertUser/:userId', groupControllerInstance.insertUser);
groupRoutes.get('/groups/:id/users', groupControllerInstance.getAllUsers);
groupRoutes.delete('/groups/:id/removeUser/:userId', groupControllerInstance.removeUser);

export { groupRoutes };
