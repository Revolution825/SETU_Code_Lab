import { Request, Response } from "express";
import * as CourseService from "../services/course.service";

export const fetchMyCourses = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const courses = await CourseService.getAllMyCourses(userId);
        res.json(courses);
    } catch (error: any) {
        console.error("Error fetching user's courses:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}