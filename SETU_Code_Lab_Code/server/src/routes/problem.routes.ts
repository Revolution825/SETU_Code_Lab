import { Router } from "express";
import { getProblems, getMyProblems } from "../controllers/problem.controller";

const router: Router = Router();

router.get("/problems", getProblems);
router.get("/myProblems", getMyProblems);

export default router;