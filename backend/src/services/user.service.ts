import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";

export async function getAllUsers() {
  const rows = await db.select().from(users);
  return rows.map(({ passwordHash, ...rest }) => rest);
}

export async function updateUserRole(id: number, role: "user" | "admin" | "superadmin") {
  const [before] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!before) return null;

  await db.update(users).set({ role }).where(eq(users.id, id));
  const [after] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  const { passwordHash: _bh, ...beforeSafe } = before;
  const { passwordHash: _ah, ...afterSafe } = after;

  return { before: beforeSafe, after: afterSafe };
}
