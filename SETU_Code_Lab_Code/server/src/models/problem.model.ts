import { pool } from "../infrastructure/database";

export const fetchProblems = async () => {
    const result = await pool.query("SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id");
    return result.rows;
}

export const fetchProblemsByUserId = async (userId: number) => {
    const result = await pool.query("SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id WHERE problem.user_id = $1", [userId]);
    return result.rows;
}

export const insertProblem = async (
    client: any,
    user_Id: number,
    problem_title: string,
    problem_description: string,
    difficulty: string,
    placeholder_code: string
) => {
    const result = await client.query(
        "INSERT INTO problem (user_Id, problem_title, problem_description, difficulty, placeholder_code) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
            user_Id,
            problem_title,
            problem_description,
            difficulty,
            placeholder_code
        ]
    )
    return result.rows[0];
}

export const updateProblem = async (
    client: any,
    problem_id: number,
    problem_title: string,
    problem_description: string,
    difficulty: number,
    placeholder_code: string
) => {
    const result = await client.query(
        "UPDATE problem SET problem_title=$1, problem_description=$2, difficulty=$3, placeholder_code=$4 WHERE problem_id=$5 RETURNING *",
        [
            problem_title,
            problem_description,
            difficulty,
            placeholder_code,
            problem_id
        ]
    )
    return result.rows[0];
}

export const deleteProblem = async (
    client: any,
    problem_id: number
) => {
    const result = await client.query(
        "DELETE FROM problem WHERE problem_id=$1 RETURNING *",
        [
            problem_id
        ]
    )
    return result;
}