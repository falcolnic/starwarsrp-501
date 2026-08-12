import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { verifyCredentials, createSession, destroySession } from "../services/auth.service.js";
import { SESSION_COOKIE_NAME } from "../middleware/auth.js";

const router = Router();

const getClientUrl = () => process.env.FRONTEND_ORIGIN || "http://localhost:5173";

router.get("/steam", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");

  const backendOrigin = `${protocol}://${host}`;
  const returnTo = `${backendOrigin}/api/auth/steam/callback`;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": backendOrigin,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  res.redirect(`https://steamcommunity.com/openid/login?${params.toString()}`);
});

router.get("/steam/callback", async (req, res) => {
  const clientUrl = getClientUrl();

  try {
    const rawQuery = req.originalUrl.split("?")[1] || "";
    const params = new URLSearchParams(rawQuery);
    params.set("openid.mode", "check_authentication");
    const checkRes = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const checkText = await checkRes.text();
    if (!checkText.includes("is_valid:true")) {
      return res.redirect(`${clientUrl}/admin/login?error=steam_failed`);
    }

    const claimedId = req.query["openid.claimed_id"] as string;
    const match = claimedId?.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/);
    const steamId = match ? match[1] : null;

    if (!steamId) {
      return res.redirect(`${clientUrl}/admin/login?error=invalid_steam`);
    }

    const [user] = await db.select().from(users).where(eq(users.steamId, steamId)).limit(1);
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.redirect(`${clientUrl}/admin/login?error=not_authorized`);
    }

    const { sessionId, expiresAt } = await createSession(user.id);

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    res.redirect(`${clientUrl}/admin`);
  } catch (err) {
    console.error("Steam auth error:", err);
    res.redirect(`${clientUrl}/admin/login?error=server_error`);
  }
});

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
