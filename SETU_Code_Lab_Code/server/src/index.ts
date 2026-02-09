import express, { Application } from "express";
import authRouter from "./routes/auth.routes";
import problemRouter from "./routes/problem.routes";
import testCaseRouter from "./routes/testCase.route";
import submissionRouter from "./routes/submission.route";
import dockerRouter from "./routes/docker.routes";
import courseRouter from "./routes/course.routes";
import userRouter from "./routes/user.routes";
import errorHandler from "./middlewares/errorHandler";
import { verifyToken } from "./middlewares/auth";
import cookieParser from "cookie-parser";

const app: Application = express();
const port: number = 3000;

app.use((req, _res, next) => {
    console.log("Incoming request:", req.method, req.originalUrl);
    next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", verifyToken, problemRouter);
app.use("/api", verifyToken, testCaseRouter);
app.use("/api", verifyToken, submissionRouter);
app.use("/api", verifyToken, courseRouter);
app.use("/api", verifyToken, userRouter);
app.use("/docker", dockerRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running smoothly on http://134.209.178.129:${port} or http://localhost:${port}`);
});