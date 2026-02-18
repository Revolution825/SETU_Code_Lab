import { Router } from "express";
import { getTestCases, getTestCaseResults } from "../controllers/testCase.controller";

const router: Router = Router();

router.get("/testCases", getTestCases);
router.get("/testCaseResults", getTestCaseResults);

export default router;