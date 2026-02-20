import { Request, Response } from "express";
import { getAllStudents, getStudentsOnCourse, getUserData, deleteUserAccount } from "../services/user.service";

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (error: any) {
        console.error("Error fetching problems:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const fetchStudentsOnCourse = async (req: Request, res: Response) => {
    const { course_id } = req.body;
    try {
        const students = await getStudentsOnCourse(course_id);
        res.status(201).json(students);
    } catch (error: any) {
        console.error("Error fetching students on course: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const fetchUser = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId
            ? Number(req.query.userId)
            : req.user!.user_id;

        const userData = await getUserData(userId);
        res.json(userData);
    } catch (error: any) {
        console.error("Error fetching user data: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await deleteUserAccount(user.user_id);
        res.json({ message: "Account deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting account: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}