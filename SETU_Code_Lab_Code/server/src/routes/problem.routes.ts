import { Router } from "express";
import { getCourseProblems, getMyProblems, createProblemController, updateProblemController, deleteProblemController, getAvailableProblems, getSubmittedProblems } from "../controllers/problem.controller";

const router: Router = Router();

router.post("/problems", getCourseProblems);
router.get("/myProblems", getMyProblems);
router.post("/fetchSubmittedProblems", getSubmittedProblems);
router.get("/AvailableProblems", getAvailableProblems);
router.post("/createNewProblem", createProblemController);
router.post("/updateProblem", updateProblemController);
router.post("/deleteProblem", deleteProblemController);

export default router;