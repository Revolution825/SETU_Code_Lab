export interface Problem {
    problem_id: number;
    user_id: number;
    problem_title: string;
    problem_description: string;
    user_name: string;
    difficulty: number;
    placeholder_code?: string;
}