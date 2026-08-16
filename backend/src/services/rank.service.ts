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

export async function getRequirementsByRank(rankId: number) {
  return db.select().from(rankRequirements).where(eq(rankRequirements.rankId, rankId));
}

export async function createRequirement(data: {
  rankId: number;
  description: string;
  type: "auto" | "manual";
  metric?: string | null;
  threshold?: number | null;
}) {
  const result = await db.insert(rankRequirements).values({
    rankId: data.rankId,
    description: data.description,
    type: data.type,
    metric: data.type === "auto" ? data.metric ?? null : null,
    threshold: data.type === "auto" ? data.threshold ?? null : null,
  });
  const [created] = await db
    .select()
    .from(rankRequirements)
    .where(eq(rankRequirements.id, result[0].insertId))
    .limit(1);
  return created;
}

export async function updateRequirement(
  id: number,
  data: Partial<{ description: string; type: "auto" | "manual"; metric: string | null; threshold: number | null }>
) {
  const [before] = await db.select().from(rankRequirements).where(eq(rankRequirements.id, id)).limit(1);
  if (!before) return null;

  await db.update(rankRequirements).set(data).where(eq(rankRequirements.id, id));
  const [after] = await db.select().from(rankRequirements).where(eq(rankRequirements.id, id)).limit(1);

  return { before, after };
}

export async function deleteRequirement(id: number) {
  const [before] = await db.select().from(rankRequirements).where(eq(rankRequirements.id, id)).limit(1);
  if (!before) return null;

  await db.delete(rankRequirements).where(eq(rankRequirements.id, id));
  return before;
}
