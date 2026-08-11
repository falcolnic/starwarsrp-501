import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";

export async function getAllDocuments() {
  return db.select().from(documents);
}

export async function createDocument(data: {
  title: string;
  description?: string;
  url: string;
  category?: string;
}) {
  const result = await db.insert(documents).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateDocument(id: number, data: Partial<typeof documents.$inferInsert>) {
  const [before] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!before) return null;

  await db.update(documents).set(data).where(eq(documents.id, id));
  const [after] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);

  return { before, after };
}

export async function deleteDocument(id: number) {
  const [before] = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  if (!before) return null;

  await db.delete(documents).where(eq(documents.id, id));
  return before;
}
