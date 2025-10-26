import express from "express";
import { verifyJwt } from "@/middlewares/validation";

const userRouter = express.Router();
userRouter.use(verifyJwt());

userRouter.get("/profile", (req, res) => {
  console.log(req.user);
  res.send("profile");
});

export default userRouter;
