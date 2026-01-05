import { Router } from "express";
import * as dockerController from "../controllers/docker.controller";

const router:Router = Router();

router.post("/start", dockerController.startContainerHandler);

export default router;
