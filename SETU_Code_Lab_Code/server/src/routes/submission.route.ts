import { Router } from "express";
import { makeSubmissionHandler, getSubmissionsForCourse } from "../controllers/submission.controller";

const router: Router = Router();

router.post("/submission", makeSubmissionHandler);
router.post("/submissionsForCourse", getSubmissionsForCourse);

export default router;