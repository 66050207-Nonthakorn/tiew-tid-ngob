import { RequestHandler } from "express";
import z from "zod";
import jwt from "jsonwebtoken";

export function validateBody(schema: z.ZodObject): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: "Invalid body" });
    }

    next();
  };
}

export function verifyJwt(): RequestHandler {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unanthorized" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

      req.user = decoded;

      next();
    }
    catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
      }
      else {
        res.status(500).json({ message: "Failed to verify token" });
      }
    }
  };
}
