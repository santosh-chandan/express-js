import request from "supertest";
import app from "../app.js"; // your express app (export it from app.js)
import mongoose from "mongoose";

describe("Auth API", () => {
    beforeAll(async () => {
    // connect to a test DB
    await mongoose.connect("mongodb://127.0.0.1:27017/jest_auth_test");
    });

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    });

test("should return 400 if email or password missing", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email and password required");
});

test("should return 401 for invalid credentials", async () => {
    const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "fake@test.com", password: "wrong" });
    expect(res.status).toBe(401);
    });
});
