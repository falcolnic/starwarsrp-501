import type { Request, Response, NextFunction } from "express";

type Role = "user" | "admin" | "superadmin";

const ROLE_RANK: Record<Role, number> = {
  user: 0,
  admin: 1,
  superadmin: 2,
};

export function requireRole(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return res.status(401).json({ error: "Требуется авторизация" });
    }

    const userRank = ROLE_RANK[req.currentUser.role as Role];
    const requiredRank = ROLE_RANK[minRole];

    if (userRank < requiredRank) {
      return res.status(403).json({ error: "Недостаточно прав доступа" });
    }

    next();
  };
}
