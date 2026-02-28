import { pool } from "../infrastructure/database";
import { Submission } from "../types/submission";

export async function createSubmission(
    client: any,
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
    percentage: number,
    points_awarded: number
): Promise<Submission> {
    const result = await client.query(
        `INSERT INTO submission (user_id, problem_id, submitted_code, overall_status, time_taken, percentage, points_awarded) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken,
            percentage,
            points_awarded
        ]
    );
    return result.rows[0]
}

export async function getSubmissionsForCourse(student_ids: number[], problem_ids: number[], created_at: string) {
    const result = await pool.query(
        `
        SELECT DISTINCT ON (user_id, problem_id)
            *
        FROM submission
        WHERE user_id = ANY($1)
          AND problem_id = ANY($2)
          AND submitted_at > $3::timestamp
        ORDER BY 
            user_id,
            problem_id,
            submitted_at DESC
        `,
        [student_ids, problem_ids, created_at]
    );
    return result.rows;
}

export async function getSubmissionsForUser(user_id: number) {
    const result = await pool.query(`SELECT * FROM submission WHERE user_id = $1 ORDER BY submitted_at DESC`,
        [user_id]
    );
    return result.rows;
}