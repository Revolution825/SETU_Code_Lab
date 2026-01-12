import { Router } from "express";
import { makeSubmissionHandler } from "../controllers/submission.controller";

const router: Router = Router();

router.post("/submission", makeSubmissionHandler);

export default router;