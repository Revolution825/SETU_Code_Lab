import { pool } from "../infrastructure/database";

export const fetchLeaderboardEntries = async (
    courseId: string,
    dateFrom: Date | null,
    filterBy: string
) => {
    let query = `
    SELECT DISTINCT
      u.user_id,
      u.user_name,
      u.total_points,
      u.current_streak,
      u.longest_streak
    FROM users u
    INNER JOIN submission s 
      ON u.user_id = s.user_id
    INNER JOIN course_problem cp
      ON s.problem_id = cp.problem_id
    WHERE cp.course_id = $1
  `;

    const values: any[] = [courseId];
    let paramIndex = 2;

    if (dateFrom) {
        query += ` AND u.role = 'student' AND s.submitted_at >= $${paramIndex}`;
        values.push(dateFrom);
        paramIndex++;
    } else {
        query += ` AND u.role = 'student'`;
    }

    if (filterBy === "score") {
        query += ` ORDER BY u.total_points DESC`;
    } else if (filterBy === "currentStreak") {
        query += ` ORDER BY u.current_streak DESC`;
    } else {
        query += ` ORDER BY u.total_points DESC`;
    }

    const result = await pool.query(query, values);
    return result.rows;
};