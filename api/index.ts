import app from "../backend/src/app.js";
import { pool } from "../backend/src/db/client.js";
import { attachDatabasePool } from "@vercel/functions";

try {
    attachDatabasePool(pool);
} catch (err) {
    console.error("attachDatabasePool failed, continuing without it:", err);
}

export default app;