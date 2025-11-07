import prisma from "@/config/database";
import { Request, Response } from "express";

async function getUserProfile(req: Request, res: Response) {
  const userId = (req as any).user.id;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId }
    });

    const userRes = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.status(200).json(userRes);
  }
  catch {
    return res.status(404).json({ message: "Not found" })
  }
}

export default {
  getUserProfile
};