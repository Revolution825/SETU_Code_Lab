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

export const fetchCreatedCoursesByUserId = async (user_id: number) => {
    const result = await pool.query(
        "SELECT * FROM course WHERE owner_id=$1 OR course_id=1", [user_id]
    )
    return result.rows;
}

export const insertCourse = async (
    client: any,
    user_id: number,
    course_title: string,
    course_description: string
) => {
    const result = await client.query(
        "INSERT INTO course (owner_id, course_title, course_description) VALUES ($1, $2, $3) RETURNING *",
        [user_id, course_title, course_description]
    )
    return result.rows[0];
}

export const insertCourseProblem = async (
    client: any,
    course_id: number,
    problem_id: number
) => {
    const result = await client.query(
        "INSERT INTO course_problem (course_id, problem_id) VALUES ($1, $2) RETURNING *", [course_id, problem_id]
    )
    return result.rows[0];
}

export const insertEnrollment = async (
    client: any,
    course_id: number,
    student_id: number
) => {
    const result = await client.query(
        "INSERT INTO enrollment (course_id, user_id) VALUES ($1, $2) RETURNING *", [course_id, student_id]
    )
    return result.rows[0];
}

export const updateCourseDetails = async (
    client: any,
    course_id: number,
    course_title: string,
    course_description: string
) => {
    const result = await client.query(
        "UPDATE course SET course_title=$1, course_description=$2 WHERE course_id=$3 RETURNING *",
        [course_title, course_description, course_id]
    )
    return result.rows[0];
}

export const deleteCourseProblems = async (
    client: any,
    course_id: number
) => {
    await client.query(
        "DELETE FROM course_problem WHERE course_id=$1", [course_id]
    )
}

export const deleteEnrollmentsByCourseId = async (
    client: any,
    course_id: number
) => {
    await client.query(
        "DELETE FROM enrollment WHERE course_id=$1", [course_id]
    )
}

export const fetchProblemIdsFromCourse = async (
    course_id: number
) => {
    const result = await pool.query(
        "SELECT problem_id FROM course_problem WHERE course_id = $1", [course_id]
    );
    return result.rows;
}

export const fetchStudentIdsFromCourse = async (
    course_id: number
) => {
    const result = await pool.query(
        "SELECT user_id FROM enrollment WHERE course_id = $1", [course_id]
    );
    return result.rows;
}

export const deleteCourseById = async (
    client: any,
    course_id: number
) => {
    await client.query(
        "DELETE FROM course WHERE course_id=$1", [course_id]
    )
}

export const fetchCourseById = async (course_id: number) => {
    const result = await pool.query(
        "SELECT * FROM course WHERE course_id=$1", [course_id]
    )
    return result.rows[0];
}