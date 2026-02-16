import { Request, Response } from "express";
import { makeSubmission, fetchSubmissionsForCourse } from "../services/submission.service";

export const makeSubmissionHandler = async (req: Request, res: Response) => {
    try {

        const user_id = req.user!.user_id;

        const {
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            testCaseResults
        } = req.body;



        const submission = await makeSubmission(
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            testCaseResults
        );

        res.status(200).json({ message: "Submission successful", submission: submission });
    } catch (error: any) {
        res.status(500).json({ messsage: error.message });
    }
}

export const getSubmissionsForCourse = async (req: Request, res: Response) => {
    const { student_ids, problem_ids, created_at } = req.body;
    try {
        const submissions = await fetchSubmissionsForCourse(student_ids, problem_ids, created_at);
        res.status(200).json(submissions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}