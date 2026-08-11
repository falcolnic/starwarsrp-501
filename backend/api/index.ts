import app from "../src/app.js";
import { pool } from "../src/db/client.js";
import { attachDatabasePool } from "@vercel/functions";

attachDatabasePool(pool);

export default app;
