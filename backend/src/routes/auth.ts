import express from "express";
import auth from "@/controllers/auth";
import { validateBody } from "@/middlewares/validation";
import { zGoogleAuthBody, zUserAuthBody } from "@/models/auth";
import { zRefreshTokenBody } from "@/models/token";

const authRouter = express.Router();

authRouter.post("/token/refresh", validateBody(zRefreshTokenBody), auth.refreshJwtToken);  
authRouter.post("/password/sign-in", validateBody(zUserAuthBody), auth.passwordSignIn);
authRouter.post("/password/sign-up", validateBody(zUserAuthBody), auth.passwordSignUp);
authRouter.post("/google", validateBody(zGoogleAuthBody), auth.googleAuth);

export default authRouter;
