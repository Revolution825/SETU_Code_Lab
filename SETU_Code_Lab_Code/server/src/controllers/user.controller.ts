import { Request, Response } from "express";
import { getAllStudents } from "../services/user.service";

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (error: any) {
        console.error("Error fetching problems:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}