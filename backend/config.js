import "dotenv/config";

console.log("Loading config. PORT from env:", process.env.PORT);
export const PORT = process.env.PORT || 3000;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 5432;
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_NAME = process.env.DB_NAME || "portfolio_blog_admin";

export const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_this";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

