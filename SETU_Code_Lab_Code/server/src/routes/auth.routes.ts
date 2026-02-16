import { Router } from "express";
import { login, signUp, me, refresh, logout } from "../controllers/auth.controller"
import { verifyToken } from "../middlewares/auth";

const router: Router = Router();

router.post("/login", login);
router.post("/signup", signUp);
router.get("/me", verifyToken, me);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;