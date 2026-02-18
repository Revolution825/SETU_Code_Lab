import { pool } from "../infrastructure/database";
import { TestCase, TestCaseResult } from "../types/testCase";

export async function fetchTestCases(problem_id: string): Promise<TestCase[]> {
  const query = "SELECT * FROM test_case WHERE problem_id=$1";
  const result = await pool.query(query, [problem_id]);
  return result.rows;
}

export async function fetchTestCaseResults(submission_id: string): Promise<TestCaseResult[]> {
  const result = await pool.query("SELECT * FROM test_case_result WHERE submission_id=$1", [submission_id]);
  console.log("fetchTestCaseResults result ", result);
  return result.rows;
}

export async function createTestCase(
  client: any,
  problem_id: number,
  test_case: TestCase
) {
  const result = await client.query(
    'INSERT INTO test_case (problem_id, input_value, expected_value) VALUES ($1, $2::json, $3::json) RETURNING *', [problem_id, test_case.input_value, test_case.expected_value]
  );
  return result.rows[0]
}

export async function updateTestCase(
  client: any,
  test_case: TestCase
) {
  if (!test_case.test_case_id) {
    throw new Error("Cannot update test case without test case id");
  }
  const result = await client.query(
    'UPDATE test_case SET input_value=$1, expected_value=$2 WHERE test_case_id=$3 RETURNING *', [test_case.input_value, test_case.expected_value, test_case.test_case_id]
  );
  return result.rows[0]
}

export async function deleteTestCase(
  client: any,
  test_case_id: number
) {
  const result = await client.query(
    'DELETE FROM test_case WHERE test_case_id=$1 RETURNING *', [test_case_id]
  );
  if (result.rowCount === 0) {
    throw new Error(`Test case ${test_case_id} not found`);
  }
  return result;
}