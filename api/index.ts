import app from "../backend/src/app.js";
import { pool } from "../backend/src/db/client.js";
import { attachDatabasePool } from "@vercel/functions";

attachDatabasePool(pool);

export default app;