import { Router } from "express";
import { getStudents } from "../controllers/user.controller";
import { fetchStudentsOnCourse } from "../controllers/user.controller";

const router: Router = Router();

router.get("/students", getStudents);
router.post("/studentsOnCourse", fetchStudentsOnCourse);

export default router;