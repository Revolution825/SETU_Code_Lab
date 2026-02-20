export interface User {
    user_id: number;
    user_name: string;
    email: string;
    role: "student" | "lecturer";
}