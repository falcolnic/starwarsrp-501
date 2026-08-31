import crypto from "crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users, sessions } from "../db/schema.js";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export async function verifyCredentials(username: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

export async function createSession(userId: number) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(sessions).values({ id: sessionId, userId, expiresAt });

  return { sessionId, expiresAt };
}

export async function getSessionUser(sessionId: string | undefined) {
  if (!sessionId) return null;

  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user ?? null;
}

export async function destroySession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
