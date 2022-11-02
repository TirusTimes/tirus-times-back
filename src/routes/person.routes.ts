import { Router } from "express";
import { personController } from "../controllers/personController";
const personRoutes = Router();

const personControllerInstance = new personController();

personRoutes.post('/', personControllerInstance.createperson)


export { personRoutes };

