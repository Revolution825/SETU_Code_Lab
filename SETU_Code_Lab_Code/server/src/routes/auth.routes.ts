import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller"

const router: Router = Router();

router.post("/login", login);
router.post("/signup", signUp)

export default router;