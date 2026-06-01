import request from "supertest";
import app from "./app.js";

jest.mock("../db/dbconn.js", () => ({
  pool: { query: jest.fn() },
  connectDB: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import { pool } from "../db/dbconn.js";
import bcrypt from "bcryptjs";

const mockUser = {
  id: 1,
  name: "Admin User",
  email: "admin@test.com",
  password: "hashed-password",
  role: "admin",
  created_at: new Date("2024-01-01"),
};

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns 400 when email is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "secret" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 401 when user is not found", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unknown@test.com", password: "secret" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 401 when password is wrong", async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 200 with token and user shape on success", async () => {
    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@test.com", password: "correctpassword" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body.user).toMatchObject({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect(res.body.user).not.toHaveProperty("password");
  });
});
