import { Request, Response } from "express";
import { getAllProblems } from "../services/problem.service";

export const getProblems = async (req: Request, res: Response) => {
    try {
        const problems = await getAllProblems();
        res.json(problems);
    } catch (error: any) {
        console.error("Error fetching problems:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}