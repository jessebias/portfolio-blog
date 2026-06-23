import request from "supertest";
import app from "./app.js";
import { makeAdminToken, makeUserToken } from "./helpers.js";

jest.mock("../db/dbconn.js", () => ({
  pool: { query: jest.fn() },
  connectDB: jest.fn(),
}));

import { pool } from "../db/dbconn.js";

const mockAuthorRow = {
  id: 1,
  name: "Admin User",
  email: "admin@test.com",
  role: "admin",
  created_at: new Date("2024-01-01"),
};

const mockBlogRow = {
  id: 1,
  title: "Test Blog",
  content: "Blog content here",
  category: "Tech",
  image_url: "https://example.com/img.png",
  user: mockAuthorRow,
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-02"),
};

const blogShape = {
  id: mockBlogRow.id,
  title: mockBlogRow.title,
  content: mockBlogRow.content,
  category: mockBlogRow.category,
  image_url: mockBlogRow.image_url,
};

describe("Blogs API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/blogs", () => {
    it("returns 200 with an array of blogs", async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockBlogRow] });

      const res = await request(app).get("/api/blogs");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toMatchObject(blogShape);
      expect(res.body[0]).toHaveProperty("author");
    });
  });

  describe("GET /api/blogs/:id", () => {
    it("returns 200 with blog shape when found", async () => {
      pool.query.mockResolvedValueOnce({ rows: [mockBlogRow] });

      const res = await request(app).get("/api/blogs/1");

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(blogShape);
      expect(res.body.author).toMatchObject({
        id: mockAuthorRow.id,
        name: mockAuthorRow.name,
        email: mockAuthorRow.email,
        role: mockAuthorRow.role,
      });
    });

    it("returns 404 when blog is not found", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get("/api/blogs/999");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Blog not found");
    });
  });

  describe("POST /api/blogs", () => {
    it("returns 401 when no auth token provided", async () => {
      const res = await request(app)
        .post("/api/blogs")
        .send({ title: "New Blog", content: "Content" });

      expect(res.status).toBe(401);
    });

    it("returns 403 when authenticated as non-admin user", async () => {
      const token = makeUserToken();

      const res = await request(app)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New Blog", content: "Content" });

      expect(res.status).toBe(403);
    });

    it("returns 201 with blog shape when admin creates a blog", async () => {
      const token = makeAdminToken();
      const newBlogRow = { ...mockBlogRow, id: 2, title: "New Blog" };
      pool.query.mockResolvedValueOnce({ rows: [newBlogRow] });

      const res = await request(app)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "New Blog", content: "Content", category: "Tech" });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: newBlogRow.id,
        title: newBlogRow.title,
      });
    });
  });

  describe("PUT /api/blogs/:id", () => {
    it("returns 401 when no auth token provided", async () => {
      const res = await request(app)
        .put("/api/blogs/1")
        .send({ title: "Updated" });

      expect(res.status).toBe(401);
    });

    it("returns 200 when admin updates a blog", async () => {
      const token = makeAdminToken();
      const updatedRow = { ...mockBlogRow, title: "Updated Title" };
      pool.query.mockResolvedValueOnce({ rows: [updatedRow] });

      const res = await request(app)
        .put("/api/blogs/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    it("returns 401 when no auth token provided", async () => {
      const res = await request(app).delete("/api/blogs/1");

      expect(res.status).toBe(401);
    });

    it("returns 200 when admin deletes a blog", async () => {
      const token = makeAdminToken();
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const res = await request(app)
        .delete("/api/blogs/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ message: "Blog deleted successfully", id: 1 });
    });
  });
});
