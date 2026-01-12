export interface Submission {
    submission_id: number;
    student_id: number;
    problem_id: number;
    submitted_code: String;
    submitted_at: number;
    overall_status: boolean;
    time_taken: number;
}