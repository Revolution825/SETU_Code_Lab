import { Request, Response } from "express";
import { getAllProblems, getAllMyProblems } from "../services/problem.service";

export const getProblems = async (req: Request, res: Response) => {
    try {
        const problems = await getAllProblems();
        res.json(problems);
    } catch (error: any) {
        console.error("Error fetching problems:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyProblems = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const problems = await getAllMyProblems(userId);
        res.json(problems);
    } catch (error: any) {
        console.error("Error fetching user's problems:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}