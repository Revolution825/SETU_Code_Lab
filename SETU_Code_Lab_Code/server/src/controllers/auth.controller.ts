import { Request, Response } from "express";
import { loginUser, signUpUser } from "../services/auth.service";
import jwt from 'jsonwebtoken';

function isValidPassword(password: string, confPassword: string) {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{5,15}$/;

    if (password.length > 15) throw new Error("Password must be shorter than 15 characters")
    if (password.length < 5) throw new Error("Password must be at least 5 characters long")
    if (!regex.test(password)) throw new Error(
        "Password must contain: at least one uppercase letter, a lowercase letter, a digit and a special character"
    )
    if (confPassword !== password) throw new Error("Passwords do not match")
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log("Login received for:", email);

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const { user, accessToken, refreshToken } = await loginUser(email, password);

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 3 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: "Logged In Successfully", user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};


export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, role, email, password, confPassword } = req.body;

        if (!email || !password || !name || !role || !confPassword) {
            return res.status(400).json({ message: "Email, password, name and role required" });
        }

        isValidPassword(password, confPassword);

        const { user, accessToken, refreshToken } =
            await signUpUser(name, role, email, password);

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 3 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Account created successfully",
            user
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const me = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: req.user });
};

export const refresh = (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as any;

        const newAccessToken = jwt.sign(
            { user_id: decoded.user_id },
            process.env.JWT_SECRET!,
            { expiresIn: "3h" }
        );

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 3 * 60 * 60 * 1000
        });

        res.json({ message: "Token refreshed" });
    } catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("refreshToken", { path: "/auth/refresh" });
    res.json({ message: "Logged out" });
};

