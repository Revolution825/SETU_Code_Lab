import { Router } from "express";
import { getProblems } from "../controllers/problemController";

const router: Router = Router();

router.get("/problems", getProblems);

export default router;