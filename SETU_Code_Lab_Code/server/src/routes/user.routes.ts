import { Router } from "express";
import { getStudents, fetchUser, fetchStudentsOnCourse, deleteAccount } from "../controllers/user.controller";

const router: Router = Router();

router.get("/students", getStudents);
router.post("/studentsOnCourse", fetchStudentsOnCourse);
router.get("/fetchUser", fetchUser);
router.delete("/deleteAccount", deleteAccount);

export default router;