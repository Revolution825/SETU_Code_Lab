import express, { Application } from "express";
import problemsRouter from "./routes/problemRoutes";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

const app: Application = express();
const port: number = 3000;

app.use(express.json());
app.use("/api", problemsRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running smoothly on http://localhost:${port}`);
});