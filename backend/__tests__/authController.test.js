import { jest } from "@jest/globals";

jest.mock("../models/User.js", () => ({
  __esModule: true,
  default: {
    findByEmail: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { register, login } from "../controllers/auth.js";

// Minimal Express res double with chainable status().json().
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const newUser = {
  id: 5,
  name: "Jane",
  email: "jane@test.com",
  role: "user",
  created_at: new Date("2024-01-01"),
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("register controller", () => {
  it("returns 400 when required fields are missing", async () => {
    const res = mockRes();
    await register({ body: { email: "jane@test.com" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
    expect(User.findByEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email format", async () => {
    const res = mockRes();
    await register({ body: { name: "Jane", email: "not-an-email", password: "secret1" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email format" });
  });

  it("returns 400 when the password is too short", async () => {
    const res = mockRes();
    await register({ body: { name: "Jane", email: "jane@test.com", password: "123" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Password must be at least 6 characters" });
  });

  it("returns 400 when the user already exists", async () => {
    User.findByEmail.mockResolvedValueOnce(newUser);
    const res = mockRes();
    await register({ body: { name: "Jane", email: "jane@test.com", password: "secret1" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    expect(User.create).not.toHaveBeenCalled();
  });

  it("creates the user and returns 201 with a sanitised DTO", async () => {
    User.findByEmail.mockResolvedValueOnce(undefined);
    bcrypt.hash.mockResolvedValueOnce("hashed-password");
    User.create.mockResolvedValueOnce(newUser);
    const res = mockRes();

    await register({ body: { name: "Jane", email: "jane@test.com", password: "secret1" } }, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("secret1", 10);
    expect(User.create).toHaveBeenCalledWith("Jane", "jane@test.com", "hashed-password", "user");
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = res.json.mock.calls[0][0];
    expect(payload.message).toBe("User created successfully");
    expect(payload.user).toMatchObject({ id: 5, email: "jane@test.com", role: "user" });
    expect(payload.user).not.toHaveProperty("password");
  });

  it("returns 500 when the model throws", async () => {
    User.findByEmail.mockRejectedValueOnce(new Error("db down"));
    const res = mockRes();

    await register({ body: { name: "Jane", email: "jane@test.com", password: "secret1" } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error during registration" });
  });
});

describe("login controller error handling", () => {
  it("returns 500 when the model throws", async () => {
    User.findByEmail.mockRejectedValueOnce(new Error("db down"));
    const res = mockRes();

    await login({ body: { email: "jane@test.com", password: "secret1" } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error during login" });
  });
});
