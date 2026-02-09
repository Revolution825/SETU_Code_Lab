import { Router } from "express";
import * as courseController from "../controllers/course.controller";

const router: Router = Router();

router.get("/fetchCourses", courseController.fetchMyCourses);
router.get("/myCourses", courseController.fetchMyCreatedCourses);
router.post("/createCourse", courseController.createCourse);
router.post("/updateCourse", courseController.updateCourse);
router.post("/problemStudentId", courseController.fetchCourseAssociations);

export default router;
