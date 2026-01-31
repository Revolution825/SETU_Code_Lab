import * as ProblemModel from "../models/problem.model";
import * as TestCaseModel from "../models/testCase.model";
import { pool } from "../infrastructure/database";

export interface tempTestCase {
  sampleInput: string;
  expectedOutput: string;
}

export const getAllProblems = async () => {
  const problems = await ProblemModel.fetchProblems();
  return problems;
};

export const getAllMyProblems = async (userId: number) => {
  const problems = await ProblemModel.fetchProblemsByUserId(userId);
  return problems;
}

export const createProblem = async (
  user_Id: number,
  problem_title: string,
  problem_description: string,
  difficulty: string,
  placeholder_code: string,
  testCases: tempTestCase[]
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const problem = await ProblemModel.insertProblem(
      client,
      user_Id,
      problem_title,
      problem_description,
      difficulty,
      placeholder_code
    );

    const problem_id = problem.problem_id
    console.log("ProblemId: ", problem_id);
    for (const testCase of testCases) {
      await TestCaseModel.createTestCase(
        client,
        problem_id,
        testCase
      )
    }

    await client.query("COMMIT");
    return problem
  } catch (error: any) {
    client.query("ROLLBACK");
    console.error("Error inside createProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
}
