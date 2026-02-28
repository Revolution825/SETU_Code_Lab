export interface User {
    user_id: number;
    email: string;
    password: string;
    role: string;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    last_solved_date: number;
}