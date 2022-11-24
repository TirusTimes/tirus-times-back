import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/", userRoutes);
router.use("/", authRoutes);

export default router;
