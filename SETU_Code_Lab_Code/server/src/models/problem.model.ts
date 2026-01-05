import { pool } from "../infrastructure/database";

export const fetchProblems = async () => {
    const query = "SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id";
    const result = await pool.query(query);
    return result.rows;
}