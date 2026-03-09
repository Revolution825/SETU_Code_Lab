import { JwtPayload } from "./express";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}