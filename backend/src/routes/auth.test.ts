import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import argon2 from "argon2";
import prisma from "@/config/database";
import googleOAuth from "@/config/auth";
import { createJWT } from "@/lib/auth";
import app from "@/server";

// Mock external dependencies
jest.mock("@/config/database");
jest.mock("argon2");
jest.mock("@/config/auth");

// Mock external modules directly without type casting
// Mock environment variables
const TEST_JWT_ACCESS_SECRET = "test-access-secret";
const TEST_JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.JWT_ACCESS_SECRET = TEST_JWT_ACCESS_SECRET;
process.env.JWT_REFRESH_SECRET = TEST_JWT_REFRESH_SECRET;

jest.mock("@/config/database", () => ({
  user: {
    findUniqueOrThrow: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("argon2", () => ({
  verify: jest.fn(),
  hash: jest.fn(),
  argon2id: "argon2id",
}));

jest.mock("@/config/auth", () => ({
  verifyIdToken: jest.fn(),
}));

jest.useFakeTimers();

// Get direct references to mocked functions
const prismaUser = (prisma.user as any);
const argon2Mock = (argon2 as any);
const googleOAuthMock = (googleOAuth as any);

// Helper function to verify JWT token format
const isValidJWT = (token: string) => {
  try {
    return !!token && token.split(".").length === 3;
  } catch (e) {
    return false;
  }
};

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/password/sign-up", () => {
    const validSignUpBody = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    it("should create a new user successfully", async () => {
      const hashedPassword = "hashed_password";
      argon2Mock.hash.mockResolvedValue(hashedPassword);
      prismaUser.create.mockResolvedValue({
        id: 1,
        email: validSignUpBody.email,
        name: validSignUpBody.name,
      });

      const response = await request(app)
        .post("/api/auth/password/sign-up")
        .send(validSignUpBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User created." });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: validSignUpBody.email,
          name: validSignUpBody.name,
          passwordHash: hashedPassword,
        },
      });
    });

    it("should validate email format", async () => {
      const response = await request(app)
        .post("/api/auth/password/sign-up")
        .send({ ...validSignUpBody, email: "invalid-email" });

      expect(response.status).toBe(400);
    });

    it("should require minimum password length", async () => {
      const response = await request(app)
        .post("/api/auth/password/sign-up")
        .send({ ...validSignUpBody, password: "123" });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/password/sign-in", () => {
    const validSignInBody = {
      emailOrName: "test1234@gmail.com",
      password: "12345678"
    };

    const mockUser = {
      id: "user-123",
      email: validSignInBody.emailOrName,
      name: "test1234",
      passwordHash: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
      googleId: null,
      facebookId: null
    };

    it("should sign in successfully with valid credentials", async () => {
      prismaUser.findMany.mockResolvedValue([mockUser]);
      argon2Mock.verify.mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/password/sign-in")
        .send(validSignInBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        createdAt: expect.any(String),
      }));
      expect(isValidJWT(response.body.accessToken)).toBe(true);
      expect(isValidJWT(response.body.refreshToken)).toBe(true);
    });

    it("should fail with invalid password", async () => {
      prismaUser.findUniqueOrThrow.mockResolvedValue(mockUser);
      argon2Mock.verify.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/auth/password/sign-in")
        .send(validSignInBody);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Failed to sign in" });
    });

    it("should fail with non-existent user", async () => {
      prismaUser.findUniqueOrThrow.mockRejectedValue(new Error());

      const response = await request(app)
        .post("/api/auth/password/sign-in")
        .send(validSignInBody);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Failed to sign in" });
    });
  });

  describe("POST /api/auth/google", () => {
    const validGoogleBody = {
      idToken: "valid_google_id_token",
    };

    const mockGooglePayload = {
      sub: "google_user_id",
      email: "test@gmail.com",
      name: "Google User",
    };

    it("should authenticate new Google user successfully", async () => {
      googleOAuthMock.verifyIdToken.mockResolvedValue({
        getPayload: () => mockGooglePayload,
      });
      prismaUser.findUnique.mockResolvedValue(null);
      prismaUser.create.mockResolvedValue({
        id: 1,
        email: mockGooglePayload.email,
        name: mockGooglePayload.name,
        googleId: mockGooglePayload.sub,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/google")
        .send(validGoogleBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        createdAt: expect.any(String),
      }));
      expect(isValidJWT(response.body.accessToken)).toBe(true);
      expect(isValidJWT(response.body.refreshToken)).toBe(true);
    });

    it("should authenticate existing Google user successfully", async () => {
      const existingUser = {
        id: 1,
        email: mockGooglePayload.email,
        name: mockGooglePayload.name,
        googleId: mockGooglePayload.sub,
        createdAt: new Date(),
      };

      googleOAuthMock.verifyIdToken.mockResolvedValue({
        getPayload: () => mockGooglePayload,
      });
      prismaUser.findUnique.mockResolvedValue(existingUser);

      const response = await request(app)
        .post("/api/auth/google")
        .send(validGoogleBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        createdAt: expect.any(String),
      }));
      expect(isValidJWT(response.body.accessToken)).toBe(true);
      expect(isValidJWT(response.body.refreshToken)).toBe(true);
    });

    it("should fail with invalid Google token", async () => {
      googleOAuthMock.verifyIdToken.mockRejectedValue(new Error());

      const response = await request(app)
        .post("/api/auth/google")
        .send(validGoogleBody);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Failed to authenticate with Google" });
    });
  });

  describe("POST /api/auth/token/refresh", () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      createdAt: new Date(),
    };

    it("should refresh tokens successfully", async () => {
      const oldRefreshToken = createJWT({ id: mockUser.id, email: mockUser.email });

      // Delay to test the token iat
      jest.setSystemTime(Date.now() + 2000);

      const response = await request(app)
        .post("/api/auth/token/refresh")
        .send({ refreshToken: oldRefreshToken.refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
      }));
      expect(isValidJWT(response.body.accessToken)).toBe(true);
      expect(response.body.accessToken).not.toBe(oldRefreshToken.accessToken);
    });

    it("should fail with invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/token/refresh")
        .send({ refreshToken: "invalid_token" });

      expect(response.status).toBe(498);
      expect(response.body).toEqual({ message: "Invalid refresh token" });
    });
  });
});