import { pool } from "./database";

export const fetchProblems = async () => {
    const query = "SELECT * FROM problem";
    const result = await pool.query(query);
    return result.rows;
}