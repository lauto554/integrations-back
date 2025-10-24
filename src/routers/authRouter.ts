import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import "colors";
import { validateSignIn } from "../middleware";

const authRouter = Router();

authRouter.all("/sign-in", validateSignIn, AuthController.signIn);

export default authRouter;
