import express from "express";
import { validateBody, verifyJwt } from "@/middlewares/validation";
import { zCreateTripBody } from "@/models/trip";
import plan from "@/controllers/plan";
import { zGeneratePlanBody } from "@/models/plan";

const planRouter = express.Router();
planRouter.use(verifyJwt());

planRouter.post("/generate", validateBody(zGeneratePlanBody), plan.generatePlan);

planRouter.get("/history", plan.getTripHistory);
planRouter.get("/history/:id", plan.getTripHistoryFromId);
planRouter.post("/history", validateBody(zCreateTripBody), plan.createTripHistory);

export default planRouter;