import * as ProblemModel from "../models/problem.model";
import * as TestCaseModel from "../models/testCase.model";
import { pool } from "../infrastructure/database";
import type { TestCase } from "../types/testCase";

export const getAllCourseProblems = async (selectedCourseId: Number) => {
  const problems = await ProblemModel.fetchCourseProblems(selectedCourseId);
  return problems;
};

export const getAllMyProblems = async (userId: number) => {
  const problems = await ProblemModel.fetchProblemsByUserId(userId);
  return problems;
}

export const getAllAvailableProblems = async (userId: number) => {
  const problems = await ProblemModel.getAllAvailableProblems(userId);
  return problems;
}

export const createProblem = async (
  user_id: number,
  problem_title: string,
  problem_description: string,
  difficulty: string,
  placeholder_code: string,
  testCases: TestCase[]
) => {
  const client = await pool.connect();
  try {
    const points = parseInt(difficulty) * 100;
    await client.query("BEGIN");
    const problem = await ProblemModel.insertProblem(
      client,
      user_id,
      problem_title,
      problem_description,
      difficulty,
      placeholder_code,
      points
    );

    const problem_id = problem.problem_id
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
    await client.query("ROLLBACK");
    console.error("Error inside createProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
}

export const updateProblem = async (
  problem_id: number,
  problem_title: string,
  problem_description: string,
  difficulty: number,
  placeholder_code: string,
  testCases: TestCase[]
) => {
  const client = await pool.connect();
  try {
    const points = difficulty * 100;
    await client.query("BEGIN");
    const problem = await ProblemModel.updateProblem(
      client,
      problem_id,
      problem_title,
      problem_description,
      difficulty,
      placeholder_code,
      points
    );

    for (const testCase of testCases) {
      if (testCase.deleted) {
        if (testCase.test_case_id) {
          await TestCaseModel.deleteTestCase(
            client,
            testCase.test_case_id
          )
        }
        continue;
      } else if (testCase.test_case_id) {
        if (testCase.input_value == null || testCase.expected_value == null) {
          throw new Error("Invalid test case data");
        }
        await TestCaseModel.updateTestCase(
          client,
          testCase
        )
      } else {
        if (!problem_id) {
          throw new Error("Cannot create test case without problem_id");
        }
        if (testCase.input_value == null || testCase.expected_value == null) {
          throw new Error("Invalid test case data");
        }
        await TestCaseModel.createTestCase(
          client,
          problem_id,
          testCase
        )
      }
    }
    await client.query("COMMIT");
    return problem
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error inside updateProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
}

export const deleteProblem = async (
  problem_id: number
) => {
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    const problem = await ProblemModel.deleteProblem(
      client,
      problem_id
    );
    await client.query("COMMIT");
    return problem;
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error inside updateProblem:", error);
    throw error;
  } finally {
    await client.release();
  }
}

export const getSubmissionProblems = async (
  problem_ids: number[]
) => {
  const problem = await ProblemModel.getProblemsByIds(problem_ids);
  return problem;
}