import request from "supertest";
import app from "./app.js";
import { makeAdminToken } from "./helpers.js";

jest.mock("../db/dbconn.js", () => ({
  pool: { query: jest.fn() },
  connectDB: jest.fn(),
}));

import { pool } from "../db/dbconn.js";

const mockSchemaRows = [
  {
    position: 1,
    column_name: "id",
    data_type: "integer",
    character_maximum_length: null,
    is_nullable: "NO",
    column_default: "nextval('blogs_id_seq'::regclass)",
  },
  {
    position: 2,
    column_name: "title",
    data_type: "character varying",
    character_maximum_length: 255,
    is_nullable: "NO",
    column_default: null,
  },
];

const mockUserRows = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@test.com",
    role: "admin",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];

describe("Meta API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/meta/schema/:table", () => {
    it("returns 200 with array of column info for blogs table", async () => {
      pool.query.mockResolvedValueOnce({ rows: mockSchemaRows });

      const res = await request(app).get("/api/meta/schema/blogs");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("column_name");
      expect(res.body[0]).toHaveProperty("data_type");
    });

    it("returns 400 for an invalid (unknown) table name", async () => {
      const res = await request(app).get("/api/meta/schema/invalid_table");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Unknown table");
    });
  });

  describe("GET /api/meta/users", () => {
    it("returns 401 when no auth token is provided", async () => {
      const res = await request(app).get("/api/meta/users");

      expect(res.status).toBe(401);
    });

    it("returns 200 with user list when admin token is provided", async () => {
      const token = makeAdminToken();
      pool.query.mockResolvedValueOnce({ rows: mockUserRows });

      const res = await request(app)
        .get("/api/meta/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toMatchObject({
        id: mockUserRows[0].id,
        name: mockUserRows[0].name,
        email: mockUserRows[0].email,
        role: mockUserRows[0].role,
      });
    });
  });
});
