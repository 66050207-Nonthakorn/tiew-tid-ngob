import request from "supertest";
import app from "@/server";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    await request(app)
      .get("/")
      .expect(200);
  });
});

describe("GET unknown path", () => {
  it("should return 404 not found", async () => {
    await request(app)
      .get("/blahblah")
      .expect(404);
  });
});