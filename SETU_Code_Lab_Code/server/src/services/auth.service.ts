import * as authModel from "../models/auth.model";
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
        { id: user.id, email: user.email, role: user.role },
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

    const hashed = await bcrypt.hash(password, 10);

    const user = await authModel.createUser(name, role, email, hashed);

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}
