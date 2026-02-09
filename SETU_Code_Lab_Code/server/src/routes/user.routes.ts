import { Router } from "express";
import { getStudents } from "../controllers/user.controller";

const router: Router = Router();

router.get("/students", getStudents);

export default router;