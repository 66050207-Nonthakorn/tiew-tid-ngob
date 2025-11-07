import express from "express";
import { verifyJwt } from "@/middlewares/validation";
import user from "@/controllers/user";

const userRouter = express.Router();
userRouter.use(verifyJwt());

userRouter.get("/profile", user.getUserProfile);

export default userRouter;
