import { Router } from "express";
import * as leaderboardController from "../controllers/leaderboard.controller";

const router: Router = Router();

router.get("/fetchLeaderboard", leaderboardController.fetchLeaderboard);

export default router;