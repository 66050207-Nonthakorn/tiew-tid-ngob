import express from "express";
import { verifyJwt } from "@/middlewares/validation";
import plan from "@/controllers/plan";

const planRouter = express.Router();
planRouter.use(verifyJwt());

// Generate plan and create history
planRouter.get("/generate", plan.generatePlan);

planRouter.get("/history", () => {});
planRouter.get("/history/:id", () => {});
planRouter.post("/history", () => {});

export default planRouter;