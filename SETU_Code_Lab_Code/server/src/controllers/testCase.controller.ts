import { Request, Response } from "express";
import { getAllTestCasesForProblem } from "../services/testCase.service";

export const getTestCases = async (req: Request, res: Response) => {
    try {
        const problem_id = req.query.problem_id as string;
        const testCases = await getAllTestCasesForProblem(problem_id);
        res.json(testCases);
    } catch (error: any) {
        console.error("Error fetching test cases:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}