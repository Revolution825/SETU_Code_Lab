
export interface TestCaseResult {
    test_case_result_id?: number;
    submission_id?: number;
    test_case_id: number;
    passed: boolean;
    actual_output: string;
    runtime_ms: number;
}

export async function createTestCaseResult(
    client: any,
    submission_id: number,
    test_case_id: number,
    passed: boolean,
    actual_output: string,
    runtime_ms: number
) {
    await client.query(
        `INSERT INTO test_case_result (submission_id, test_case_id, passed, actual_output, runtime_ms)
        VALUES ($1, $2, $3, $4, $5)`,
        [
            submission_id,
            test_case_id,
            passed,
            actual_output,
            runtime_ms
        ]
    );
}