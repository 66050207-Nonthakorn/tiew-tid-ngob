import express from "express";
import auth from "../controllers/auth";
import passport from "passport";

const router = express.Router();

router.post("/password", auth.passwordSignIn);
router.post("/password/sign-up", auth.passwordSignUp);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }));

router.get("/facebook", auth.facebookSignIn);
router.get("/facebook/callback", auth.facebookCallback);

export default router;