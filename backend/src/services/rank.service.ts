import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { ranks, rankRequirements } from "../db/schema.js";

export async function getAllRanks() {
  return db.select().from(ranks).orderBy(ranks.order);
}

export async function getRankRequirements(rankId: number) {
  return db.select().from(rankRequirements).where(eq(rankRequirements.rankId, rankId));
}

export async function createRank(data: { name: string; order: number; description?: string }) {
  const result = await db.insert(ranks).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateRank(
  id: number,
  data: Partial<{ name: string; order: number; description: string }>
) {
  const [before] = await db.select().from(ranks).where(eq(ranks.id, id)).limit(1);
  if (!before) return null;

  await db.update(ranks).set(data).where(eq(ranks.id, id));
  const [after] = await db.select().from(ranks).where(eq(ranks.id, id)).limit(1);

  return { before, after };
}

export async function deleteRank(id: number) {
  const [before] = await db.select().from(ranks).where(eq(ranks.id, id)).limit(1);
  if (!before) return null;

  await db.delete(ranks).where(eq(ranks.id, id));
  return before;
}
