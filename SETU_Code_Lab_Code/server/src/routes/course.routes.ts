import { Router } from "express";
import * as courseController from "../controllers/course.controller";

const router: Router = Router();

router.get("/fetchCourses", courseController.fetchMyCourses);

export default router;
