import { pool } from "../infrastructure/database";
import { tempTestCase } from "../services/problem.service";
import { TestCase } from "../types/testCase";

export async function fetchTestCases(problem_id: string): Promise<TestCase[]> {
  const query = "SELECT * FROM test_case WHERE problem_id=$1";
  const result = await pool.query(query, [problem_id]);
  console.log("JSON Data", result.rows);
  return result.rows;
}

export async function createTestCase(
  client: any,
  problem_id: number,
  test_case: tempTestCase
) {
  const result = await client.query(
    'INSERT INTO test_case (problem_id, input_value, expected_value) VALUES ($1, $2::json, $3::json)', [problem_id, JSON.stringify(test_case.sampleInput), JSON.stringify(test_case.expectedOutput)]
  );
  return result.rows[0]
}