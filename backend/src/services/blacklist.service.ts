import { db } from "../db/client.js";
import { blacklist } from "../db/schema.js";
import { desc } from "drizzle-orm";

export async function getAllBlacklist() {
    return await db.select().from(blacklist).orderBy(desc(blacklist.createdAt));
}

export async function createBlacklistEntry(data: typeof blacklist.$inferInsert) {
    return await db.insert(blacklist).values(data);
}
