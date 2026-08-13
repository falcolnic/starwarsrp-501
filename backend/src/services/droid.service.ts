import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { droids } from "../db/schema.js";

export async function getAllDroids() {
    return db.select().from(droids);
}

export async function createDroid(data: {
    id: string;
    name: string;
    hp: number;
    weapon: string;
    defenseLevel: string;
    dangerLevel: string;
    tactics: string;
    features: string;
    image?: string | null;
    }) {
    const existing = await db.select().from(droids).where(eq(droids.id, data.id)).limit(1);
    if (existing.length > 0) throw new Error("DUPLICATE_ID");

    await db.insert(droids).values(data);
    const [created] = await db.select().from(droids).where(eq(droids.id, data.id)).limit(1);
    return created;
}

export async function updateDroid(id: string, data: Partial<typeof droids.$inferInsert>) {
    const [before] = await db.select().from(droids).where(eq(droids.id, id)).limit(1);
    if (!before) return null;

    await db.update(droids).set(data).where(eq(droids.id, id));
    const [after] = await db.select().from(droids).where(eq(droids.id, id)).limit(1);

    return { before, after };
}

export async function deleteDroid(id: string) {
    const [before] = await db.select().from(droids).where(eq(droids.id, id)).limit(1);
    if (!before) return null;

    await db.delete(droids).where(eq(droids.id, id));
    return before;
}