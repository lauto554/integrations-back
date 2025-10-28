import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import "colors";
import { validateSignIn, validateSignUp, validateToken } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.all("/sign-in", validateSignIn, AuthController.signIn);
authRouter.all("/sign-up", validateSignUp, AuthController.signUp);
authRouter.all("/refresh-token", validateToken, AuthController.refreshToken);

export default authRouter;
