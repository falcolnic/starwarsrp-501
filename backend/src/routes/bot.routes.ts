import { Router } from "express";
import { requireBotKey } from "../middleware/botAuth.js";
import { db } from "../db/client.js";
import { soldiers } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.patch("/soldiers/:cid", requireBotKey, async (req, res) => {
    const { cid } = req.params;
    const { nickname, rank, rankSince, onlineTotalHours, onlineSessions, unitLevel, recentSessions, steamId } = req.body;

    const existing = await db.select().from(soldiers).where(eq(soldiers.cid, cid)).limit(1);

    if (existing.length === 0) {
        // новый боец — бот сам его "заводит", остальное (позиции, медали) — по умолчанию пустые
        await db.insert(soldiers).values({ cid, steamId, nickname, rank, rankSince, onlineTotalHours, onlineSessions, unitLevel, recentSessions, lastSyncedAt: new Date() });
    } else {
        // ТОЛЬКО поля бота — ручные данные (positions, medals...) не трогаем
        await db.update(soldiers).set({ nickname, rank, rankSince, onlineTotalHours, onlineSessions, unitLevel, recentSessions, steamId, lastSyncedAt: new Date() }).where(eq(soldiers.cid, cid));
    }

    res.json({ ok: true });
});

export default router;