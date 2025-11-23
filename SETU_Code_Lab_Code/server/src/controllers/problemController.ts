import { Request, Response } from "express";
import { fetchProblems } from "../services/problemService";

export const getProblems = async (req: Request, res: Response) => {
    try {
        const problems = await fetchProblems();
        res.json(problems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}