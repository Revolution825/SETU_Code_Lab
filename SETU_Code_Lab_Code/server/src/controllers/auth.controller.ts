import { Request, Response } from "express";
import { login as loginUser, signUp as signUpUser } from "../services/auth.service"

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.json({message: "Logged In Successfully", user})
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, role, email, password } = req.body;
        const user = await signUpUser(name, role, email, password);
        res.status(201).json({
        message: "Account created successfully",
        user,
    });
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}