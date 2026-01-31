export interface TestCase {
    test_case_id?: number;
    problem_id: number;
    input_value: any;
    expected_value: any;
    passed?: boolean;
}

export interface TestCaseResult {
    test_case_result_id?: number;
    submission_id?: number;
    test_case_id: number;
    passed: boolean;
    actual_output: string;
    runtime_ms: number;
}