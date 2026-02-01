export interface TestCase {
    test_case_id?: number;
    problem_id?: number;
    temp_id?: string;
    input_value: string;
    expected_value: string;
    passed?: boolean;
    deleted?: boolean;
}