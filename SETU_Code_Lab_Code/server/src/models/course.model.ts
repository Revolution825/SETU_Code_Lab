import { pool } from "../infrastructure/database";

export const addUserToCourse = async (client: any, user_id: number) => {
    const result = await client.query(
        "INSERT INTO enrollment (course_id, user_id) VALUES (1, $1) RETURNING *", [user_id]
    )
    return result.rows[0];
}

export const fetchCourseByUserId = async (user_id: number) => {
    const result = await pool.query(
        "SELECT c.* FROM course c JOIN enrollment e ON c.course_id = e.course_id WHERE e.user_id = $1", [user_id]
    )
    return result.rows;
}