import { pool } from "../infrastructure/database";

export const fetchProblems = async () => {
    const result = await pool.query("SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id");
    return result.rows;
}

export const fetchProblemsByUserId = async (userId: number) => {
    const result = await pool.query("SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id WHERE problem.user_id = $1", [userId]);
    return result.rows;
}