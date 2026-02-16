import { pool } from "../infrastructure/database";
import * as authModel from "../models/auth.model";
import * as courseModel from "../models/course.model";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginResult {
    user: Omit<User, "password">;
    accessToken: string;
    refreshToken: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
    const user = await authModel.getUserByEmail(email.toLowerCase());
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const accessToken = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" }
    );

    const refreshToken = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken: accessToken, refreshToken: refreshToken };
}

export async function signUpUser(name: string, role: string, email: string, password: string): Promise<LoginResult> {
    const existing = await authModel.getUserByEmail(email);
    if (existing) {
        throw new Error("Email already in use");
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const hashed = await bcrypt.hash(password, 10);
        const user = await authModel.createUser(client, name, role, email.toLowerCase(), hashed);
        const accessToken = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "3h" }
        );
        const refreshToken = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );
        await courseModel.addUserToCourse(client, user.user_id);
        const { password: _, ...userWithoutPassword } = user;
        await client.query("COMMIT");
        return { user: userWithoutPassword, accessToken: accessToken, refreshToken: refreshToken };

    } catch (error: any) {
        await client.query("ROLLBACK");
        console.error("Error inside signUp:", error);
        throw error;
    } finally {
        await client.release();
    }
}
