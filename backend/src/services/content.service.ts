import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { siteContent } from "../db/schema.js";

export async function getContentByKey(key: string) {
  const [result] = await db
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, key))
    .limit(1);
  return result || null;
}

export async function upsertContent(key: string, content: string, updatedBy: string) {
  const existing = await getContentByKey(key);

  if (existing) {
    await db
      .update(siteContent)
      .set({ content, updatedBy })
      .where(eq(siteContent.key, key));
  } else {
    await db.insert(siteContent).values({ key, content, updatedBy });
  }

  return getContentByKey(key);
}