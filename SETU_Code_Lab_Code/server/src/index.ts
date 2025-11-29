import express, { Application } from "express";
import authRouter from "./routes/auth.routes";
import problemRouter from "./routes/problem.routes"
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();
const port: number = 3000;

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api", problemRouter)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running smoothly on http://localhost:${port}`);
});