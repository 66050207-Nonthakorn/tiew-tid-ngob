import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import prisma from "@/config/database";
import app from "@/server";

// Mock the database module
jest.mock("@/config/database", () => ({
  __esModule: true,
  default: {
    trip: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    place: {
      upsert: jest.fn(),
    },
    tripPlace: {
      create: jest.fn(),
    },
    $transaction: jest.fn((fn: any) => Promise.resolve(fn(prisma))),
  },
}));

// Get direct references to mocked functions
const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("Plan Routes", () => {
  const mockUser = {
    id: "45f97f49-1666-47c8-99df-37e02f199793",
    name: "Test User",
    email: "test@example.com",
  };

  const mockAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1Zjk3ZjQ5LTE2NjYtNDdjOC05OWRmLTM3ZTAyZjE5OTc5MyIsImlhdCI6MTc2MjQzOTI5NCwiZXhwIjoxNzkzOTk2ODk0fQ.AGR8AsQ_oDwkKBG8TUNAjpCaHy7D9YGSjEwYWrxCIH4";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /plan/history", () => {
    it("should return trip history for authenticated user", async () => {
      const mockTrips = [
        {
          id: "trip-1",
          userId: mockUser.id,
          totalPrice: 1000,
          startAt: "2025-11-06T09:00:00Z",
          endAt: "2025-11-06T20:00:00Z",
          createdAt: new Date().toISOString(),
          rating: null,
          places: [
            {
              id: "trip-place-1",
              place: {
                id: "place-1",
                googlePlaceId: "google-place-1",
              },
              startAt: "2025-11-06T09:00:00Z",
              endAt: "2025-11-06T11:00:00Z",
              price: 500,
            },
          ],
        },
      ];

      prismaMock.trip.findMany.mockResolvedValue(mockTrips as any);

      const response = await request(app)
        .get("/api/plan/history")
        .set("Authorization", `Bearer ${mockAuthToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ trips: mockTrips });
      expect(prismaMock.trip.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: {
          places: {
            include: {
              place: true,
            },
          },
        },
        orderBy: { startAt: 'desc' },
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app)
        .get("/api/plan/history")
        .send();

      expect(response.status).toBe(401);
    });
  });

  describe("GET /plan/history/:id", () => {
    const mockTripId = "trip-123";

    it("should return specific trip for authenticated user", async () => {
      const mockTrip = {
        id: mockTripId,
        userId: mockUser.id,
        totalPrice: 1000,
        startAt: "2025-11-06T09:00:00Z",
        endAt: "2025-11-06T20:00:00Z",
        createdAt: new Date().toISOString(),
        rating: null,
        places: [
          {
            id: "trip-place-1",
            place: {
              id: "place-1",
              googlePlaceId: "google-place-1",
              categories: [{ name: "restaurant" }],
            },
            startAt: "2025-11-06T09:00:00Z",
            endAt: "2025-11-06T11:00:00Z",
            price: 500,
          },
        ],
      };

      prismaMock.trip.findFirst.mockResolvedValue(mockTrip as any);

      const response = await request(app)
        .get(`/api/plan/history/${mockTripId}`)
        .set("Authorization", `Bearer ${mockAuthToken}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ trip: mockTrip });
      expect(prismaMock.trip.findFirst).toHaveBeenCalledWith({
        where: { 
          id: mockTripId,
          userId: mockUser.id,
        },
        include: {
          places: {
            include: {
              place: true,
            },
          },
        },
      });
    });

    it("should return 404 if trip is not found", async () => {
      prismaMock.trip.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/plan/history/${mockTripId}`)
        .set("Authorization", `Bearer ${mockAuthToken}`)
        .send();

      expect(response.status).toBe(404);
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app)
        .get(`/api/plan/history/${mockTripId}`)
        .send();

      expect(response.status).toBe(401);
    });
  });

  describe("POST /plan/history", () => {
    const validTripBody = {
      totalPrice: 2500,
      startAt: "2025-11-06T09:00:00Z",
      endAt: "2025-11-06T20:00:00Z",
      places: [
        {
          googlePlaceId: "place-123",
          startAt: "2025-11-06T09:00:00Z",
          endAt: "2025-11-06T11:00:00Z",
          price: 500,
          latitude: 13.7563,
          longitude: 100.5018,
        },
      ],
    };

    it("should create a new trip successfully", async () => {
      const mockNewTrip = {
        id: "new-trip-123",
        userId: mockUser.id,
        totalPrice: validTripBody.totalPrice,
        startAt: validTripBody.startAt,
        endAt: validTripBody.endAt,
        createdAt: new Date().toISOString(),
        rating: null
      };

      const mockPlace = {
        id: "place-123",
        googlePlaceId: validTripBody.places[0].googlePlaceId,
        latitude: validTripBody.places[0].latitude,
        longitude: validTripBody.places[0].longitude,
      };

      prismaMock.trip.create.mockResolvedValue(mockNewTrip as any);
      prismaMock.place.upsert.mockResolvedValue(mockPlace);
      prismaMock.tripPlace.create.mockResolvedValue({
        id: "trip-place-123",
        tripId: mockNewTrip.id,
        placeId: mockPlace.id,
        startAt: new Date(validTripBody.places[0].startAt),
        endAt: new Date(validTripBody.places[0].endAt),
        price: validTripBody.places[0].price,
      });

      const response = await request(app)
        .post("/api/plan/history")
        .set("Authorization", `Bearer ${mockAuthToken}`)
        .send(validTripBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ trip: mockNewTrip });
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app)
        .post("/api/plan/history")
        .send(validTripBody);

      expect(response.status).toBe(401);
    });

    it("should validate trip data format", async () => {
      const invalidTripBody = {
        ...validTripBody,
        startAt: "invalid-date",
      };

      const response = await request(app)
        .post("/api/plan/history")
        .set("Authorization", `Bearer ${mockAuthToken}`)
        .send(invalidTripBody);

      expect(response.status).toBe(400);
    });
  });
});