import { Router } from "express";
import { getProblems, getMyProblems, createProblemController, updateProblemController, deleteProblemController } from "../controllers/problem.controller";

const router: Router = Router();

router.get("/problems", getProblems);
router.get("/myProblems", getMyProblems);
router.post("/createNewProblem", createProblemController);
router.post("/updateProblem", updateProblemController);
router.post("/deleteProblem", deleteProblemController);

export default router;