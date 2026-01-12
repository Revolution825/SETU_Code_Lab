import { Submission } from "../types/submission";

export async function createSubmission(
    client: any,
    user_id: number,
    problem_id: number,
    submitted_code: string,
    overall_status: boolean,
    time_taken: number,
): Promise<Submission> {
    const result = await client.query(
        `INSERT INTO submission (user_id, problem_id, submitted_code, overall_status, time_taken) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
            user_id,
            problem_id,
            submitted_code,
            overall_status,
            time_taken
        ]
    );
    return result.rows[0]
}