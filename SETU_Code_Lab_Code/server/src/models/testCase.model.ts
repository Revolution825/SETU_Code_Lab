import { pool } from "../infrastructure/database";

export interface TestCase {
  test_case_id: number;
  problem_id: number;
  input_value: any;
  expected_value: any;
}

export async function fetchTestCases(problem_id: string): Promise<TestCase[]> {
    const query = "SELECT * FROM test_case WHERE problem_id=$1";
    const result = await pool.query(query, [problem_id]);
    console.log("JSON Data", result.rows);
    return result.rows;
}