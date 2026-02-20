import { pool } from "../infrastructure/database";
import { createSubmission, getSubmissionsForCourse, getSubmissionsForUser } from "../models/submission.model";
import { createTestCaseResult } from "../models/testCaseResult.model";
import { TestCaseResult } from "../types/testCase";

export const makeSubmission = async (
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
    testCaseResults: TestCaseResult[]
) => {
    const client = await pool.connect();
    const numberTestCasesPassed = testCaseResults.filter(
        (testCase) => testCase.passed
    ).length;
    const percentage = (numberTestCasesPassed / testCaseResults.length) * 100;
    try {
        await client.query("BEGIN");

        const submission = await createSubmission(
            client,
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            percentage
        );

        for (const testCase of testCaseResults) {
            await createTestCaseResult(
                client,
                submission.submission_id,
                testCase.test_case_id,
                testCase.passed,
                testCase.actual_output,
                testCase.runtime_ms
            );
        }

        await client.query("COMMIT");
        return submission;
    } catch (error: any) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        await client.release();
    }
}

export const fetchSubmissionsForCourse = async (student_ids: number[], problem_ids: number[], created_at: string) => {
    const submissions = await getSubmissionsForCourse(student_ids, problem_ids, created_at);
    return submissions;
}

export const fetchSubmissionsForUser = async (user_id: number) => {
    const submissions = await getSubmissionsForUser(user_id);
    return submissions;
}