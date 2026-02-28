export interface User {
    user_id: number;
    user_name: string;
    email: string;
    role: "student" | "lecturer";
    total_points: number;
    current_streak: number;
    longest_streak: number;
    last_solved_date: number;
}