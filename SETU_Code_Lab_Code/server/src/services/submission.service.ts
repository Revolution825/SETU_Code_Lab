import { pool } from "../infrastructure/database";
import { createSubmission, getSubmissionsForCourse, getSubmissionsForUser, checkFirstSolve } from "../models/submission.model";
import { createTestCaseResult } from "../models/testCaseResult.model";
import { updateUserPoints, getStreakData, updateStreak } from "../models/user.model";
import { TestCaseResult } from "../types/testCase";

export const makeSubmission = async (
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
    testCaseResults: TestCaseResult[],
    points: number
) => {
    const client = await pool.connect();
    const numberTestCasesPassed = testCaseResults.filter(
        (testCase) => testCase.passed
    ).length;
    const percentage = (numberTestCasesPassed / testCaseResults.length) * 100;
    const speedBonus = time_taken < 1800 ? 100 : time_taken < 3600 ? 50 : time_taken < 5400 ? 25 : 0;
    const points_awarded = percentage < 100 ? 0 : points + speedBonus;
    try {
        await client.query("BEGIN");

        const isFirstSolve = await checkFirstSolve(client, user_id, problem_id);
        if (isFirstSolve) {

            if (overall_status && isFirstSolve) {
                const todaysDate = new Date();
                todaysDate.setHours(0, 0, 0, 0);
                const yesterdaysDate = new Date(todaysDate);
                yesterdaysDate.setDate(todaysDate.getDate() - 1);

                const { last_solved_date, current_streak } = await getStreakData(client, user_id);

                if (last_solved_date == null) {
                    await updateStreak(client, user_id, 1);
                } else {
                    const lastSolvedDate = new Date(last_solved_date);
                    lastSolvedDate.setHours(0, 0, 0, 0);

                    if (lastSolvedDate.getTime() === todaysDate.getTime()) {
                    } else if (lastSolvedDate.getTime() === yesterdaysDate.getTime()) {
                        await updateStreak(client, user_id, current_streak + 1);
                    } else {
                        await updateStreak(client, user_id, 1);
                    }
                }
            }

            await updateUserPoints(
                client,
                user_id,
                points_awarded
            )
        }

        const submission = await createSubmission(
            client,
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            percentage,
            points_awarded
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