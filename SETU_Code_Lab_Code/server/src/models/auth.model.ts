import { pool } from "../database";

export interface User {
    id: number;
    email: string;
    password: string;
    role: string;
}
export async function getUserByEmail(email:string):Promise<User | null> {
    let result = await pool.query(
        "SELECT user_id AS id, user_name AS name, email, password, role FROM users WHERE email = $1",
    [email]
    );
    if (result.rows.length > 0) {
        return { ...result.rows[0]};
    }
  return null;
}

export async function createUser(name: string, role: string, email: string, password:string):Promise<User> {
    const result = await pool.query(
        `INSERT INTO users (user_name, role, email, password) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
         [name, role, email, password]
    );
    return result.rows[0]
}