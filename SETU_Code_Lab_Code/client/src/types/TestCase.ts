export interface TestCase {
    test_case_id: number;
    problem_id: number;
    input_value: any;
    expected_value: any;
    passed: boolean;
}