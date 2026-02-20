import { Router } from "express";
import { makeSubmissionHandler, getSubmissionsForCourse, getSubmissionsForUser } from "../controllers/submission.controller";

const router: Router = Router();

router.post("/submission", makeSubmissionHandler);
router.post("/submissionsForCourse", getSubmissionsForCourse);
router.get("/fetchSubmissions", getSubmissionsForUser);

export default router;