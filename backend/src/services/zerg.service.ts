import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { zergs } from "../db/schema.js";

export async function getAllZergs() {
    return db.select().from(zergs);
}

export async function createZerg(data: {
    id: string;
    name: string;
    danger: "низкий" | "средний" | "высокий";
    hp: number;
    attacks: { type: string; range: string; damage: string }[];
    recommendations: string;
    description: string;
    image?: string | null;
    }) {
    const existing = await db.select().from(zergs).where(eq(zergs.id, data.id)).limit(1);
    if (existing.length > 0) throw new Error("DUPLICATE_ID");

    await db.insert(zergs).values(data);
    const [created] = await db.select().from(zergs).where(eq(zergs.id, data.id)).limit(1);
    return created;
}

export async function updateZerg(id: string, data: Partial<typeof zergs.$inferInsert>) {
    const [before] = await db.select().from(zergs).where(eq(zergs.id, id)).limit(1);
    if (!before) return null;

    await db.update(zergs).set(data).where(eq(zergs.id, id));
    const [after] = await db.select().from(zergs).where(eq(zergs.id, id)).limit(1);

    return { before, after };
}

export async function deleteZerg(id: string) {
    const [before] = await db.select().from(zergs).where(eq(zergs.id, id)).limit(1);
    if (!before) return null;

    await db.delete(zergs).where(eq(zergs.id, id));
    return before;
}