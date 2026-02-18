import { Request, Response } from "express";
import { getAllTestCasesForProblem, getTestCaseResultsForSubmission } from "../services/testCase.service";

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

export const getTestCaseResults = async (req: Request, res: Response) => {
    try {
        const submission_id = req.query.submission_id as string;
        const testCaseResults = await getTestCaseResultsForSubmission(submission_id);
        res.json(testCaseResults);
    } catch (error: any) {
        console.error("Error fetching test case results:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}