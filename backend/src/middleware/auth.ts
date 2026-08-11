import type { Request, Response, NextFunction } from "express";
import { getSessionUser } from "../services/auth.service.js";

const SESSION_COOKIE_NAME = "session_id";

export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  const user = await getSessionUser(sessionId);
  if (user) req.currentUser = user;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  next();
}

export { SESSION_COOKIE_NAME };
