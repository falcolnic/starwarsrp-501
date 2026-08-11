import { Router } from "express";
import { z } from "zod";
import { verifyCredentials, createSession, destroySession } from "../services/auth.service.js";
import { SESSION_COOKIE_NAME } from "../middleware/auth.js";

const router = Router();

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
    secure: true,
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
