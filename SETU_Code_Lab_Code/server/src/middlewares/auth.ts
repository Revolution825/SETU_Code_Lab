import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/express';

export function verifyToken(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token found" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" })
    }
}