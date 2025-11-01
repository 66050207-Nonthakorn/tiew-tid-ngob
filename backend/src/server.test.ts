import request from "supertest";
import app from "@/server";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    await request(app)
      .get('/')
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

describe("POST /auth/password/sign-up", function() {
  it("should return 201 Created", function(done) {
    request(app)
      .post("/auth/password/sign-up")
      .auth("testuser@gmail.com", "123456789")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, done);
  });

  it("should return 400 Bad Request", function(done) {
    request(app)
      .post("/auth/password/sign-up")
      .auth("", "")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});

describe("POST /auth/password/sign-in", function() {
  it("should return 200 OK", function(done) {
    request(app)
      .post("/auth/password/sign-in")
      .auth("testuser@gmail.com", "123456789")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("should return 400 Bad Request", function(done) {
    request(app)
      .post("/auth/password/sign-in")
      .auth("", "")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400, done);
  });

  it("should return 401 Unauthorized", function(done) {
    request(app)
      .post("/auth/password/sign-in")
      .auth("userdoesntexist@gmail.com", "123456789")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
  });
});
