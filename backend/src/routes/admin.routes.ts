import { desc, eq } from "drizzle-orm";
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/requireRole.js";
import { logAudit } from "../services/audit.service.js";
import {
  createRank,
  updateRank,
  deleteRank,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getRequirementsByRank,
  getAllRanks,
} from "../services/rank.service.js";
import {
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
} from "../services/blacklist.service.js";
import { getContentByKey, upsertContent } from "../services/content.service.js";
import { getAllUsers, updateUserRole } from "../services/user.service.js";
import {
  createSoldier,
  deleteSoldier,
  getAllSoldiers,
  updateSoldier,
  updateSoldierMedals,
} from "../services/soldiers.service.js";
import { createDroid, deleteDroid, updateDroid } from "../services/droid.service.js";
import { createZerg, deleteZerg, updateZerg } from "../services/zerg.service.js";
import { auditLogs, users } from "../db/schema.js";
import { db } from "../db/client.js";
import { createCommander, deleteCommander, updateCommander } from "../services/commander.service.js";

const router = Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ============ SCHEMAS ============
const soldierCreateSchema = z.object({
  cid: z.string().min(1).max(16),
  rank: z.string().nullable().optional(),
  steamId: z.string().nullable().optional(),
  callsignOverride: z.string().nullable().optional(),
  positions: z.array(z.string()).optional(),
  squads: z.array(z.string()).optional(),
  attached: z.array(z.string()).optional(),
  medals: z.array(z.string()).optional(),
  status: z.string().optional(),
  joinDate: z.string().nullable().optional(),
  discordId: z.string().nullable().optional(),
  commandRole: z.string().nullable().optional(),
  commandOrder: z.number().int().nullable().optional(),
});

const soldierUpdateSchema = soldierCreateSchema.omit({ cid: true }).partial().extend({
  reprimands: z.number().int().optional(),
  reprimandsFrozen: z.boolean().optional(),
  leaveUntil: z.string().nullable().optional(),
  reserveUntil: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

const medalsSchema = z.object({
  medals: z.array(z.string()),
});

const rankSchema = z.object({
  name: z.string().min(1),
  order: z.number().int(),
  description: z.string().optional(),
});

const requirementSchema = z.object({
  description: z.string().min(1),
  type: z.enum(["auto", "manual"]),
  metric: z.string().nullable().optional(),
  threshold: z.number().int().nullable().optional(),
});

const docSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  category: z.string().optional(),
});

const roleSchema = z.object({
  role: z.enum(["user", "admin", "superadmin"]),
});

const zergSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  danger: z.enum(["низкий", "средний", "высокий"]),
  hp: z.number().int().positive(),
  attacks: z.array(z.object({ type: z.string(), range: z.string(), damage: z.string() })),
  recommendations: z.string().min(1),
  description: z.string().min(1),
  image: z.string().nullable().optional(),
});

const droidSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  hp: z.number().int().positive(),
  weapon: z.string().min(1),
  defenseLevel: z.string().min(1),
  dangerLevel: z.string().min(1),
  tactics: z.string().min(1),
  features: z.string().min(1),
  image: z.string().nullable().optional(),
});

const blacklistSchema = z.object({
  number: z.string().min(1),
  callsign: z.string().min(1),
  steamId: z.string().min(1),
  reason: z.string().min(1),
  addedDate: z.string().min(1),
  workoff: z.string().min(1),
  status: z.enum(["TRIALS", "EXILED", "BANNED"]).optional(),
});

// ============ SOLDIERS (ADMIN OK) ============
router.get("/soldiers", requireRole("admin"), asyncHandler(async (_req, res) => {
  const list = await getAllSoldiers();
  res.json(list);
}));

router.post("/soldiers", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = soldierCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  try {
    const created = await createSoldier(parsed.data);
    await logAudit({
      userId: req.currentUser!.id,
      action: "create",
      entityType: "soldier",
      entityId: parsed.data.cid,
      after: created,
    });
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof Error && err.message === "DUPLICATE_CID") {
      return res.status(409).json({ error: "Боец с таким CID уже существует" });
    }
    throw err;
  }
}));

router.patch("/soldiers/:cid", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = soldierUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateSoldier(req.params.cid, parsed.data);
  if (!result) return res.status(404).json({ error: "Боец не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "soldier",
    entityId: req.params.cid,
    before: result.before,
    after: result.after,
  });

  res.json(result.after);
}));

router.delete("/soldiers/:cid", requireRole("admin"), asyncHandler(async (req, res) => {
  const deleted = await deleteSoldier(req.params.cid);
  if (!deleted) return res.status(404).json({ error: "Боец не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "soldier",
    entityId: req.params.cid,
    before: deleted,
  });

  res.json({ ok: true });
}));

router.patch("/soldiers/:cid/medals", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = medalsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateSoldierMedals(req.params.cid, parsed.data.medals);
  if (!result) return res.status(404).json({ error: "Боец не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "soldier_medals",
    entityId: req.params.cid,
    before: result.before.medals,
    after: result.after.medals,
  });

  res.json(result.after);
}));

// ============ RANKS & REQUIREMENTS (SUPERADMIN ONLY FOR ACTIONS) ============
// Keep GET as admin so the Roster frontend can fetch the ranks for dropdowns
router.get("/ranks", requireRole("admin"), asyncHandler(async (_req, res) => {
  const list = await getAllRanks();
  res.json(list);
}));

router.post("/ranks", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = rankSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const created = await createRank(parsed.data);
  await logAudit({
    userId: req.currentUser!.id,
    action: "create",
    entityType: "rank",
    entityId: created.id,
    after: created,
  });

  res.status(201).json(created);
}));

router.patch("/ranks/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = rankSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateRank(id, parsed.data);
  if (!result) return res.status(404).json({ error: "Звание не найдено" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "rank",
    entityId: id,
    before: result.before,
    after: result.after,
  });

  res.json(result.after);
}));

router.delete("/ranks/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteRank(id);
  if (!deleted) return res.status(404).json({ error: "Звание не найдено" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "rank",
    entityId: id,
    before: deleted,
  });

  res.json({ ok: true });
}));

router.get("/ranks/:rankId/requirements", requireRole("admin"), asyncHandler(async (req, res) => {
  const rankId = Number(req.params.rankId);
  const list = await getRequirementsByRank(rankId);
  res.json(list);
}));

router.post("/ranks/:rankId/requirements", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const rankId = Number(req.params.rankId);
  const parsed = requirementSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const created = await createRequirement({ rankId, ...parsed.data });
  await logAudit({
    userId: req.currentUser!.id,
    action: "create",
    entityType: "rank_requirement",
    entityId: created.id,
    after: created,
  });

  res.status(201).json(created);
}));

router.patch("/requirements/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = requirementSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateRequirement(id, parsed.data);
  if (!result) return res.status(404).json({ error: "Требование не найдено" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "rank_requirement",
    entityId: id,
    before: result.before,
    after: result.after,
  });

  res.json(result.after);
}));

router.delete("/requirements/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteRequirement(id);
  if (!deleted) return res.status(404).json({ error: "Требование не найдено" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "rank_requirement",
    entityId: id,
    before: deleted,
  });

  res.json({ ok: true });
}));

// ============ BLACKLIST (ADMIN OK) ============
router.post("/blacklist", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = blacklistSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const created = await createBlacklistEntry({ ...parsed.data, addedBy: req.currentUser!.id });
  await logAudit({
    userId: req.currentUser!.id,
    action: "create",
    entityType: "blacklist",
    entityId: created.id,
    after: created,
  });

  res.status(201).json(created);
}));

router.patch("/blacklist/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = blacklistSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateBlacklistEntry(id, parsed.data);
  if (!result) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "blacklist",
    entityId: id,
    before: result.before,
    after: result.after,
  });

  res.json(result.after);
}));

router.delete("/blacklist/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteBlacklistEntry(id);
  if (!deleted) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "blacklist",
    entityId: id,
    before: deleted,
  });

  res.json({ ok: true });
}));

// ============ DOCUMENTS ============
const siteContentSchema = z.object({
  content: z.string().min(1, "Содержимое не может быть пустым"),
});

router.get("/content/:key", asyncHandler(async (req, res) => {
  const content = await getContentByKey(req.params.key);
  res.json(content || { content: "" });
}));

router.put("/content/:key", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = siteContentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const existing = await getContentByKey(req.params.key);
  const updatedBy = req.currentUser!.displayName || req.currentUser!.username || "System";

  const updated = await upsertContent(
    req.params.key, 
    parsed.data.content, 
    updatedBy
  );

  await logAudit({
    userId: req.currentUser!.id,
    action: existing ? "update" : "create",
    entityType: "site_content",
    entityId: req.params.key,
    before: existing,
    after: updated,
  });

  res.json(updated);
}));

// ============ USERS (SUPERADMIN ONLY) ============
router.get("/users", requireRole("superadmin"), asyncHandler(async (_req, res) => {
  const list = await getAllUsers();
  res.json(list);
}));

router.patch("/users/:id/role", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const [targetUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!targetUser) return res.status(404).json({ error: "Пользователь не найден" });

  if (targetUser.role === "superadmin" && targetUser.id !== req.currentUser!.id) {
      return res.status(403).json({ 
          error: "Вы не можете изменить роль другого супер-администратора" 
      });
  }

  const result = await updateUserRole(id, parsed.data.role);
  if (!result) return res.status(404).json({ error: "Пользователь не найден" });

  await logAudit({
      userId: req.currentUser!.id,
      action: "update",
      entityType: "user_role",
      entityId: id,
      before: result.before,
      after: result.after,
  });

  res.json(result.after);
}));

router.delete("/users/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [targetUser] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!targetUser) return res.status(404).json({ error: "Пользователь не найден" });

    if (targetUser.id === req.currentUser!.id) {
        return res.status(403).json({ error: "Вы не можете удалить самого себя" });
    }
    if (targetUser.role === "superadmin") {
        return res.status(403).json({ error: "Вы не можете удалить другого супер-администратора" });
    }
    await db.delete(users).where(eq(users.id, id));

    await logAudit({
        userId: req.currentUser!.id,
        action: "delete",
        entityType: "user",
        entityId: id,
    });

    res.json({ success: true });
}));

// ============ ZERGS (SUPERADMIN ONLY) ============
router.post("/zergs", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = zergSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  try {
    const created = await createZerg(parsed.data);
    await logAudit({ userId: req.currentUser!.id, action: "create", entityType: "zerg", entityId: created.id, after: created });
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof Error && err.message === "DUPLICATE_ID") {
      return res.status(409).json({ error: "Запись с таким id уже существует" });
    }
    throw err;
  }
}));

router.patch("/zergs/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = zergSchema.omit({ id: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateZerg(req.params.id, parsed.data);
  if (!result) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "update", entityType: "zerg", entityId: req.params.id, before: result.before, after: result.after });
  res.json(result.after);
}));

router.delete("/zergs/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const deleted = await deleteZerg(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "delete", entityType: "zerg", entityId: req.params.id, before: deleted });
  res.json({ ok: true });
}));

// ============ DROIDS (SUPERADMIN ONLY) ============
router.post("/droids", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = droidSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  try {
    const created = await createDroid(parsed.data);
    await logAudit({ userId: req.currentUser!.id, action: "create", entityType: "droid", entityId: created.id, after: created });
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof Error && err.message === "DUPLICATE_ID") {
      return res.status(409).json({ error: "Запись с таким id уже существует" });
    }
    throw err;
  }
}));

router.patch("/droids/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = droidSchema.omit({ id: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateDroid(req.params.id, parsed.data);
  if (!result) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "update", entityType: "droid", entityId: req.params.id, before: result.before, after: result.after });
  res.json(result.after);
}));

router.delete("/droids/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const deleted = await deleteDroid(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "delete", entityType: "droid", entityId: req.params.id, before: deleted });
  res.json({ ok: true });
}));

// ============ AUDIT (SUPERADMIN ONLY) ============
router.get("/audit", requireRole("superadmin"), asyncHandler(async (req, res) => {
    const logs = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            beforeData: auditLogs.beforeData,
            afterData: auditLogs.afterData,
            createdAt: auditLogs.createdAt,
            userId: auditLogs.userId,
            userDisplayName: users.displayName,
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.userId, users.id))
        .orderBy(desc(auditLogs.createdAt))
        .limit(100);

    res.json(logs);
}));

// ============ COMMANDERS REGISTRY (SUPERADMIN ONLY) ============
const commanderSchema = z.object({
  rank: z.string().min(1, "Звание обязательно"),
  period: z.string().min(1, "Период обязателен (напр. 2024-2025)"),
  orderNum: z.number().int().min(1, "Порядковый номер обязателен"),
  idNumber: z.string().min(1, "Номер ID обязателен (используйте '—' если нет)"),
  callsign: z.string().min(1, "Позывной обязателен"),
});

router.post("/commanders", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const parsed = commanderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  
  const created = await createCommander(parsed.data);
  
  await logAudit({
    userId: req.currentUser!.id,
    action: "create",
    entityType: "commander",
    entityId: created.id,
    after: created,
  });
  
  res.status(201).json(created);
}));

router.patch("/commanders/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = commanderSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });
  
  const result = await updateCommander(id, parsed.data);
  if (!result) return res.status(404).json({ error: "Командир не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "commander",
    entityId: id,
    before: result.before,
    after: result.after,
  });
  
  res.json(result.after);
}));

router.delete("/commanders/:id", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteCommander(id);
  if (!deleted) return res.status(404).json({ error: "Командир не найден" });
  
  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "commander",
    entityId: id,
    before: deleted,
  });
  
  res.json({ ok: true });
}));

export default router;
