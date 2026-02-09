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

export const fetchMyCreatedCourses = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const courses = await CourseService.getAllMyCreatedCourses(userId);
        res.json(courses);
    } catch (error: any) {
        console.error("Error fetching user's owned courses:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createCourse = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const {
            course_title,
            course_description,
            problem_ids,
            student_ids
        } = req.body;
        const course = await CourseService.createNewCourse(
            userId,
            course_title,
            course_description,
            problem_ids,
            student_ids
        );
        res.status(201).json(course);
    } catch (error: any) {
        console.error("Error creating new course: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const {
            course_id,
            course_title,
            course_description,
            problem_ids,
            student_ids
        } = req.body;
        const course = await CourseService.updateExistingCourse(
            course_id,
            course_title,
            course_description,
            problem_ids,
            student_ids
        );
        res.status(201).json(course);
    } catch (error: any) {
        console.error("Error updating existing course: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const fetchCourseAssociations = async (req: Request, res: Response) => {
    const { course_id } = req.body;
    try {
        const associations = await CourseService.getCourseAssociations(course_id);
        res.status(201).json(associations);
    } catch (error: any) {
        console.error("Error fetching course associations: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}