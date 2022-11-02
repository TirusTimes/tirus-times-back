import { Router } from "express";
import { personRoutes } from "./person.routes";

const router = Router();

router.use("/",personRoutes);


export default router;