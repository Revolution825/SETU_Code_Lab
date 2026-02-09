import { pool } from "../infrastructure/database"

export const fetchAllStudents = async () => {
    const result = await pool.query(
        "SELECT user_id AS student_id, user_name AS student_name FROM users WHERE role='student'", []
    );
    return result.rows;
}