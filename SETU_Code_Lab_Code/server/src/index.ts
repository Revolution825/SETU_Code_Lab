import express, { Application } from "express";
import router from "./routes/routes";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();
const port: number = 3000;

app.use("/", router);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running smoothly on http://localhost:${port}`);
});