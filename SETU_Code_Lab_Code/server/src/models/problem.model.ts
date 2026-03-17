import { pool } from "../infrastructure/database";

export const fetchCourseProblems = async (selectedCourseId: Number) => {
  const result = await pool.query(
    `SELECT p.*, u.user_name
     FROM problem AS p
     JOIN users AS u ON p.user_id = u.user_id
     JOIN course_problem AS cp ON cp.problem_id = p.problem_id
     WHERE cp.course_id = $1`,
    [selectedCourseId],
  );
  return result.rows;
};

export const fetchProblemsByUserId = async (userId: number) => {
  const result = await pool.query(
    "SELECT problem.*, users.user_name FROM problem AS problem JOIN users AS users ON problem.user_id = users.user_id WHERE problem.user_id = $1",
    [userId],
  );
  return result.rows;
};

export const getAllAvailableProblems = async (userId: number) => {
  const result = await pool.query(
    `SELECT * FROM problem WHERE user_id = $1 OR user_id = 1`,
    [userId],
  );
  return result.rows;
};

export const insertProblem = async (
  client: any,
  user_Id: number,
  problem_title: string,
  problem_description: string,
  difficulty: string,
  points: number,
) => {
  const result = await client.query(
    "INSERT INTO problem (user_Id, problem_title, problem_description, difficulty, points) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user_Id, problem_title, problem_description, difficulty, points],
  );
  return result.rows[0];
};

export const updateProblem = async (
  client: any,
  problem_id: number,
  problem_title: string,
  problem_description: string,
  difficulty: number,
  points: number,
) => {
  const result = await client.query(
    "UPDATE problem SET problem_title=$1, problem_description=$2, difficulty=$3, points=$4 WHERE problem_id=$5 RETURNING *",
    [problem_title, problem_description, difficulty, points, problem_id],
  );
  return result.rows[0];
};

export const deleteProblem = async (client: any, problem_id: number) => {
  const result = await client.query(
    "DELETE FROM problem WHERE problem_id=$1 RETURNING *",
    [problem_id],
  );
  return result;
};

export const getProblemsByIds = async (problem_ids: number[]) => {
  if (!problem_ids.length) return [];
  const result = await pool.query(
    "SELECT * FROM problem WHERE problem_id=ANY($1::int[])",
    [problem_ids],
  );
  return result.rows;
};

export const getProblemLanguageData = async (problem_id: number) => {
  const result = await pool.query(
    "SELECT * FROM problem_language WHERE problem_id=$1",
    [problem_id],
  );
  return result.rows;
};

export const insertProblemLanguage = async (
  client: any,
  problem_id: number,
  language: "java" | "python",
  placeholder_code: string,
) => {
  const result = await client.query(
    "INSERT INTO problem_language (problem_id, language, placeholder_code) VALUES ($1, $2, $3) RETURNING *",
    [problem_id, language, placeholder_code],
  );
  return result.rows[0];
};

export const deleteProblemLanguages = async (
  client: any,
  problem_id: number,
) => {
  await client.query("DELETE FROM problem_language WHERE problem_id = $1", [
    problem_id,
  ]);
};
