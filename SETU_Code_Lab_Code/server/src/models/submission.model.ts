import { pool } from "../infrastructure/database";
import { Submission } from "../types/submission";

export async function createSubmission(
    client: any,
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
    percentage: number
): Promise<Submission> {
    const result = await client.query(
        `INSERT INTO submission (user_id, problem_id, submitted_code, overall_status, time_taken, percentage) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            percentage
        ]
    );
    return result.rows[0]
}

export async function getSubmissionsForCourse(student_ids: number[], problem_ids: number[], created_at: string) {
    const result = await pool.query(
        `
        SELECT DISTINCT ON (s.user_id, s.problem_id)
            s.submission_id,
            s.user_id,
            s.problem_id,
            s.submitted_code,
            s.submitted_at,
            s.overall_status,
            s.time_taken,
            s.percentage
        FROM submission s
        WHERE s.user_id = ANY($1)
          AND s.problem_id = ANY($2)
          AND s.submitted_at > $3::timestamp
        ORDER BY 
            s.user_id,
            s.problem_id,
            s.submitted_at DESC
        `,
        [student_ids, problem_ids, created_at]
    );
    return result.rows;
}