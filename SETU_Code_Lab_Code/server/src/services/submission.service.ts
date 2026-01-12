import { pool } from "../infrastructure/database";
import { createSubmission } from "../models/submission.model";
import { createTestCaseResult } from "../models/testCaseResult.model";
import { TestCaseResult } from "../models/testCaseResult.model";

export const makeSubmission = async (
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
    testCaseResults: TestCaseResult[]
) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const submission = await createSubmission(
            client,
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken
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
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        await client.release();
    }
}