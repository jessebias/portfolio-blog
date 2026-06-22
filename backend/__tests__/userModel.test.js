import { jest } from "@jest/globals";

jest.mock("../db/dbconn.js", () => ({
  pool: { query: jest.fn() },
  connectDB: jest.fn(),
}));

import { pool } from "../db/dbconn.js";
import User from "../models/User.js";

const sampleUser = {
  id: 1,
  name: "Admin User",
  email: "admin@test.com",
  role: "admin",
  created_at: new Date("2024-01-01"),
};

describe("User model (mocked pool)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("create() inserts and returns the new row", async () => {
    pool.query.mockResolvedValueOnce({ rows: [sampleUser] });

    const result = await User.create("Admin User", "admin@test.com", "hashed", "admin");

    expect(result).toEqual(sampleUser);
    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO users/);
    expect(values).toEqual(["Admin User", "admin@test.com", "hashed", "admin"]);
  });

  it("create() defaults role to 'user' when omitted", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ ...sampleUser, role: "user" }] });

    await User.create("Jane", "jane@test.com", "hashed");

    const [, values] = pool.query.mock.calls[0];
    expect(values[3]).toBe("user");
  });

  it("findByEmail() returns the matching row", async () => {
    pool.query.mockResolvedValueOnce({ rows: [sampleUser] });

    const result = await User.findByEmail("admin@test.com");

    expect(result).toEqual(sampleUser);
    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toMatch(/WHERE email = \$1/);
    expect(values).toEqual(["admin@test.com"]);
  });

  it("findByEmail() returns undefined when no row matches", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const result = await User.findByEmail("nobody@test.com");

    expect(result).toBeUndefined();
  });

  it("findById() returns the matching row", async () => {
    pool.query.mockResolvedValueOnce({ rows: [sampleUser] });

    const result = await User.findById(1);

    expect(result).toEqual(sampleUser);
    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toMatch(/WHERE id = \$1/);
    expect(values).toEqual([1]);
  });

  it("getAll() returns all rows ordered by creation date", async () => {
    const rows = [sampleUser, { ...sampleUser, id: 2, email: "two@test.com" }];
    pool.query.mockResolvedValueOnce({ rows });

    const result = await User.getAll();

    expect(result).toEqual(rows);
    const [sql] = pool.query.mock.calls[0];
    expect(sql).toMatch(/ORDER BY created_at DESC/);
  });

  it("update() sends new values and returns the updated row", async () => {
    const updated = { id: 1, name: "New Name", email: "new@test.com", role: "user" };
    pool.query.mockResolvedValueOnce({ rows: [updated] });

    const result = await User.update(1, { name: "New Name", email: "new@test.com", role: "user" });

    expect(result).toEqual(updated);
    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toMatch(/UPDATE users/);
    expect(values).toEqual(["New Name", "new@test.com", "user", 1]);
  });

  it("delete() removes the row and returns its id", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const result = await User.delete(1);

    expect(result).toEqual({ id: 1 });
    const [sql, values] = pool.query.mock.calls[0];
    expect(sql).toMatch(/DELETE FROM users/);
    expect(values).toEqual([1]);
  });
});
