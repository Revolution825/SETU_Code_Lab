export interface Submission {
    submission_id: number;
    user_id: number;
    problem_id: number;
    submitted_code: String;
    submitted_at: string;
    overall_status: boolean;
    time_taken: number;
    percentage: number;
    points_awarded: number;
}