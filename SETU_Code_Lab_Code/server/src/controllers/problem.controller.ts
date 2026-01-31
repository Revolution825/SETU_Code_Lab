import { Request, Response } from "express";
import { getAllProblems, getAllMyProblems, createProblem } from "../services/problem.service";

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

export const createProblemController = async (req: Request, res: Response) => {
    try {
        console.log("USER IN CONTROLLER:", req.user);
        const userId = req.user!.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const {
            problem_title,
            problem_description,
            difficulty,
            placeholder_code,
            testCases
        } = req.body;

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({ message: "At least one test case is required" })
        }

        const problem = await createProblem(
            userId,
            problem_title,
            problem_description,
            difficulty,
            placeholder_code,
            testCases
        )
        res.status(201).json({ problem_id: problem.problem_id });
    } catch (error: any) {
        console.error("Error fetching creating new problem:", error);
        res.status(500).json({ message: error.message });
    }
}