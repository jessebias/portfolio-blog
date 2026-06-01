import jwt from "jsonwebtoken";

export const TEST_SECRET = "test-secret";

export const makeAdminToken = () =>
  jwt.sign({ id: 1, email: "admin@test.com", role: "admin" }, TEST_SECRET, {
    expiresIn: "1h",
  });

export const makeUserToken = () =>
  jwt.sign({ id: 2, email: "user@test.com", role: "user" }, TEST_SECRET, {
    expiresIn: "1h",
  });
