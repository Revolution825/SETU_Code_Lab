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

export const fetchUserData = async (user_id: number) => {
    const result = await pool.query(
        "SELECT user_id, user_name, email, role, total_points FROM users WHERE user_id = $1", [user_id]
    );
    return result.rows[0];
}

export const deleteAccount = async (user_id: number) => {
    await pool.query(
        "DELETE FROM users WHERE user_id = $1", [user_id]
    );
}

export const updateUserPoints = async (client: any, user_id: number, points_awarded: number) => {
    const result = await client.query(
        `UPDATE users SET total_points = total_points + $1
            WHERE user_id = $2`,
        [points_awarded, user_id]
    );
    return result.rows[0]
}