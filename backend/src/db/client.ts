import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Serverless optimizations:
  connectionLimit: 1,   // Strictly 1 connection per Vercel instance
  maxIdle: 1,           // Don't keep excess idle connections open
  idleTimeout: 10000,   // Kill connections after 10 seconds of inactivity
  
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

export const db = drizzle(pool, { schema, mode: "default" });

export { pool };