import { Router } from "express";
import { getTestCases } from "../controllers/testCase.controller";

const router: Router = Router();

router.get("/testCases", getTestCases);

export default router;