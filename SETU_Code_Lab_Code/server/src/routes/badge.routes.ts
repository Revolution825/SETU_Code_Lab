import { Router } from "express";
import * as badgeController from "../controllers/badge.controller";

const router: Router = Router();

router.get("/fetchUserBadges", badgeController.fetchUserBadges);

export default router;
