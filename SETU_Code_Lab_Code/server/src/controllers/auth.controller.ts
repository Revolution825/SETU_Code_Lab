import { Request, Response } from "express";
import { login as loginUser, signUp as signUpUser } from "../services/auth.service"

function isValidPassword(password: string, confPassword: string) {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    if (password.length > 15) throw new Error("Password must be shorter than 15 characters")
    if (password.length < 8) throw new Error("Password must be at least 8 characters long")
    if (!regex.test(password)) throw new Error(
        "Password must contain: at least one uppercase letter, a lowercase letter, a digit and a special character"
    )
    if (confPassword !== password) throw new Error("Passwords do not match")
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000
        });
        res.json({ message: "Logged In Successfully", user })
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, role, email, password, confPassword } = req.body;
        isValidPassword(password, confPassword);
        const { user, token } = await signUpUser(name, role, email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000
        });
        res.status(201).json({
            message: "Account created successfully", user
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const me = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: req.user });
}