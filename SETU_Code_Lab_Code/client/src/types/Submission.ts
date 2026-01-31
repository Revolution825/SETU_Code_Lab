export interface Submission {
    student_id: number;
    problem_id: number;
    submitted_code: String;
    submitted_at?: number;
    overall_status: boolean;
    time_taken: number;
}