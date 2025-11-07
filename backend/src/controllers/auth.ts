import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import prisma from "@/config/database";
import googleOAuth from "@/config/auth";
import { GoogleAuthBody, PasswordSignInBody, PasswordSignUpBody } from "@/models/auth";
import { RefreshTokenBody } from "@/models/token";
import { createJWT } from "@/lib/auth";

async function passwordSignIn(req: Request, res: Response) {
  const { emailOrName, password } = req.body as PasswordSignInBody;

  try {
    // Find user
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: emailOrName, mode: "insensitive" } },
          { email: { contains: emailOrName, mode: "insensitive" } },
        ],
      },
    });

    if (users.length === 0) throw new Error(); 
    const user = users[0];

    // User login with Google, Facebook Auth instead
    if (!user.passwordHash) {
      throw new Error();
    }

    // Verify Password
    const isVerify = await argon2.verify(user.passwordHash, password);
    if (!isVerify) {
      throw new Error();
    }

    // Create JWT
    const payload = {
      id: user.id,
      email: user.email!,
    };

    const token = createJWT(payload);

    res.status(200).json({
      createdAt: user.createdAt,
      ...token
    });
  } catch (err) {
    res.status(401).json({ message: "Failed to sign in" });
  }
}

async function passwordSignUp(req: Request, res: Response) {
  const { email, name, password } = req.body as PasswordSignUpBody;

  try {
    // Create user
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created." });
  }
  catch (err) {
    res.status(400).json({ message: "Failed to sign up" });
  }
}

async function googleAuth(req: Request, res: Response) {
  const { idToken } = req.body as GoogleAuthBody;
  
  try {
    const ticket = await googleOAuth.verifyIdToken({ idToken });
    const payload = ticket.getPayload();

    if (!payload) throw new Error();

    const { sub: googleId, email, name = "" } = payload;
    let user = await prisma.user.findUnique({
      where: {
        googleId: googleId
      }
    });

    let created = false;

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleId }
      });
      created = true;
    }

    const token = createJWT({ id: user.id, email });
    res.status(created ? 201 : 200).json({ createdAt: user.createdAt, ...token });
  }
  catch (e) {
    res.status(401).json({ message: "Failed to authenticate with Google" });
  }
}

// This refresh access token using refresh token
function refreshJwtToken(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenBody;

  try {
    // Verify the refresh token
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { id: string; email: string };

    // Generate new access token
    const { accessToken } = createJWT({ id: payload.id, email: payload.email });

    res.status(200).json({ accessToken });
  }
  catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: "Refresh token expired" });
    }
    else {
      res.status(498).json({ message: "Invalid refresh token" });
    }
  }
}

export default {
  passwordSignUp,
  passwordSignIn,
  googleAuth,
  refreshJwtToken,
};
