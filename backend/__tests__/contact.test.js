import request from "supertest";
import app from "./app.js";

jest.mock("resend", () => {
  const mockEmailsSend = jest.fn();
  const MockResend = jest.fn().mockImplementation(() => ({
    emails: { send: mockEmailsSend },
  }));
  MockResend._mockEmailsSend = mockEmailsSend;
  return { Resend: MockResend };
});

import { Resend } from "resend";

const getMockSend = () => Resend._mockEmailsSend;

describe("POST /api/contact", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    Resend.mockImplementation(() => ({
      emails: { send: getMockSend() },
    }));
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({ name: "Alice", email: "alice@test.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns 400 when email format is invalid", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Alice",
      email: "not-a-valid-email",
      message: "Hello there!",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("returns 200 when all fields are valid and Resend succeeds", async () => {
    const mockSend = jest.fn().mockResolvedValueOnce({ data: { id: "email-123" }, error: null });
    Resend.mockImplementation(() => ({ emails: { send: mockSend } }));

    const res = await request(app).post("/api/contact").send({
      name: "Alice",
      email: "alice@test.com",
      message: "Hello, this is a test message.",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Message sent");
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when Resend returns an error object", async () => {
    const mockSend = jest.fn().mockResolvedValueOnce({
      data: null,
      error: { message: "API key invalid" },
    });
    Resend.mockImplementation(() => ({ emails: { send: mockSend } }));

    const res = await request(app).post("/api/contact").send({
      name: "Alice",
      email: "alice@test.com",
      message: "Hello, this is a test message.",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
});
