import { pool } from "../infrastructure/database"

export const fetchAllStudents = async () => {
    const result = await pool.query(
        "SELECT user_id AS student_id, user_name AS student_name FROM users WHERE role='student'", []
    );
    return result.rows;
}

export const fetchStudentsOnCourse = async (course_id: number) => {
    const result = await pool.query(
        "SELECT u.user_id, u.user_name FROM users u JOIN enrollment e ON u.user_id = e.user_id WHERE e.course_id = $1", [course_id]
    );
    return result.rows;
}