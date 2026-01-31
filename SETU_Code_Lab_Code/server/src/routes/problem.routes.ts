import { Router } from "express";
import { getProblems, getMyProblems, createProblemController } from "../controllers/problem.controller";

const router: Router = Router();

router.get("/problems", getProblems);
router.get("/myProblems", getMyProblems);
router.post("/createNewProblem", createProblemController);

export default router;