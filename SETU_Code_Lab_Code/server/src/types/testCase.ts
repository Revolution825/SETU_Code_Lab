export interface TestCase {
    test_case_id?: number;
    problem_id?: number;
    temp_id?: string;
    input_value: string;
    expected_value: string;
    passed?: boolean;
    deleted?: boolean;
}

export interface TestCaseResult {
    test_case_result_id?: number;
    submission_id?: number;
    test_case_id: number;
    passed: boolean;
    actual_output: string;
    runtime_ms: number;
}