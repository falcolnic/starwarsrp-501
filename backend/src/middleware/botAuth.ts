import type { Request, Response, NextFunction } from "express";

export function requireBotKey(req: Request, res: Response, next: NextFunction) {
    const key = req.headers["x-bot-key"];
    if (key !== process.env.BOT_SYNC_KEY) {
        return res.status(401).json({ error: "Неверный ключ бота" });
    }
    next();
}