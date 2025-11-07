import express from "express";
import auth from "@/controllers/auth";
import { validateBody } from "@/middlewares/validation";
import { zGoogleAuthBody, zUserSignInBody, zUserSignUpBody } from "@/models/auth";
import { zRefreshTokenBody } from "@/models/token";

const authRouter = express.Router();

authRouter.post("/token/refresh", validateBody(zRefreshTokenBody), auth.refreshJwtToken);  
authRouter.post("/password/sign-in", validateBody(zUserSignInBody), auth.passwordSignIn);
authRouter.post("/password/sign-up", validateBody(zUserSignUpBody), auth.passwordSignUp);
authRouter.post("/google", validateBody(zGoogleAuthBody), auth.googleAuth);

export default authRouter;
