import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";
import planRouter from "@/routes/plan";

dotenv.config({ override: true, quiet: true });

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Logging
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// Health Check
app.get("/", (_, res) => {
  res.send("Tiew Tid Ngob's backend is currently running");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/plan", planRouter);

// Handle unknown path
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.path}`);
});

// Handle error
app.use((error: unknown, _: Request, res: Response, __: NextFunction) => {
  const message = (error instanceof Error ? error.message : String(error));
  res.status(500).json({ message: `Error ${message}` });
});

export default app;