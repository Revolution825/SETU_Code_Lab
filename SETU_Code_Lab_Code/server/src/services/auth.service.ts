import { pool } from "../infrastructure/database";
import * as authModel from "../models/auth.model";
import * as courseModel from "../models/course.model";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginResult {
    user: Omit<User, "password">;
    token: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
    const user = await authModel.getUserByEmail(email);
    if (!user) throw new Error("Invalid email or password")

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password")

    const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
}

export async function signUp(name: string, role: string, email: string, password: string): Promise<LoginResult> {
    const existing = await authModel.getUserByEmail(email);
    if (existing) {
        throw new Error("Email already in use");
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const hashed = await bcrypt.hash(password, 10);
        const user = await authModel.createUser(client, name, role, email.toLowerCase(), hashed);
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
        await courseModel.addUserToCourse(client, user.user_id);
        const { password: _, ...userWithoutPassword } = user;
        await client.query("COMMIT");
        return { user: userWithoutPassword, token };
    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Error inside createProblem:", error);
        throw error;
    } finally {
        await client.release();
    }
}
