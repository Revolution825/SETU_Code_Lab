import { Router } from "express";
import { getProblems } from "../controllers/problem.controller";

const router: Router = Router();

router.get("/problems", getProblems);

export default router;