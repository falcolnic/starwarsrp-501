import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { soldiers, users } from "../db/schema.js";
import { verifyCredentials, createSession, destroySession } from "../services/auth.service.js";
import { buildSteamLoginUrl, verifySteamCallback, fetchSteamProfile } from "../services/steamAuth.service.js";
import { SESSION_COOKIE_NAME } from "../middleware/auth.js";
import { lookupPlayerBySteamId } from "../services/botClient.js";

const router = Router();

const getClientUrl = () => process.env.FRONTEND_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173";

// ============ STEAM AUTH INIT ============
router.get("/steam", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");
  const backendOrigin = `${protocol}://${host}`;

  const loginUrl = buildSteamLoginUrl(backendOrigin);
  res.redirect(loginUrl);
});

// ============ STEAM AUTH CALLBACK ============
router.get("/steam/callback", async (req, res) => {
  const clientUrl = getClientUrl();

  try {
    const rawQuery = req.originalUrl.split("?")[1] || "";
    const steamId = await verifySteamCallback(rawQuery);

    if (!steamId) {
      return res.redirect(`${clientUrl}/admin/login?error=steam_failed`);
    }

    const [existingUser] = await db.select().from(users).where(eq(users.steamId, steamId)).limit(1);

    let userId: number;
    let userRole = "user";

    if (existingUser) {
      userId = existingUser.id;
      userRole = existingUser.role;
    } else {
      const profile = await fetchSteamProfile(steamId);
      const [insertResult] = await db.insert(users).values({
        steamId,
        displayName: profile?.personaName ?? `CT-${steamId.slice(-4)}`,
        role: "user",
      });
      userId = insertResult.insertId;
    }

    const [existingSoldier] = await db.select().from(soldiers).where(eq(soldiers.steamId, steamId)).limit(1);

    if (!existingSoldier) {
      const botData = await lookupPlayerBySteamId(steamId).catch(() => null);

      if (botData) {
        await db.insert(soldiers).values({
          cid: botData.cid,
          steamId,
          nickname: botData.nickname,
          rank: botData.rank,
          rankSince: botData.rankSince,
          onlineTotalHours: botData.onlineTotalHours,
          onlineSessions: botData.onlineSessions,
          unitLevel: botData.unitLevel,
          lastSyncedAt: new Date(),
          positions: [],
          squads: [],
          attached: [],
          medals: [],
          status: "active",
        });
      }
    }
    const { sessionId, expiresAt } = await createSession(userId);

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    if (userRole === "admin" || userRole === "superadmin") {
      res.redirect(`${clientUrl}/admin`);
    } else {
      res.redirect(`${clientUrl}/roster`);
    }
  } catch (err) {
    console.error("Steam auth error:", err);
    res.redirect(`${clientUrl}/admin/login?error=server_error`);
  }
});

// ============ FALLBACK USERNAME / PASSWORD LOGIN ============
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  const user = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  const { sessionId, expiresAt } = await createSession(user.id);

  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });

  res.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  });
});

router.post("/logout", async (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  if (sessionId) await destroySession(sessionId);

  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Не авторизован" });
  }

  res.json({
    id: req.currentUser.id,
    username: req.currentUser.username,
    displayName: req.currentUser.displayName,
    role: req.currentUser.role,
  });
});

export default router;
