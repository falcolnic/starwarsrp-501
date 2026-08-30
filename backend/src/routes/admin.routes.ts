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
import { createDocument, updateDocument, deleteDocument } from "../services/document.service.js";
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

const router = Router();

// Express async handler wrapper
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

// ============ SOLDIERS ============
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

// ============ RANKS & REQUIREMENTS ============
router.get("/ranks", requireRole("admin"), asyncHandler(async (_req, res) => {
  const list = await getAllRanks(); // Or whatever function your rank service uses to fetch all ranks
  res.json(list);
}));

router.post("/ranks", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.patch("/ranks/:id", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.delete("/ranks/:id", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.post("/ranks/:rankId/requirements", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.patch("/requirements/:id", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.delete("/requirements/:id", requireRole("admin"), asyncHandler(async (req, res) => {
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

// ============ BLACKLIST ============
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
router.post("/docs", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = docSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const created = await createDocument(parsed.data);
  await logAudit({
    userId: req.currentUser!.id,
    action: "create",
    entityType: "document",
    entityId: created.id,
    after: created,
  });

  res.status(201).json(created);
}));

router.patch("/docs/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = docSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateDocument(id, parsed.data);
  if (!result) return res.status(404).json({ error: "Документ не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "update",
    entityType: "document",
    entityId: id,
    before: result.before,
    after: result.after,
  });

  res.json(result.after);
}));

router.delete("/docs/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await deleteDocument(id);
  if (!deleted) return res.status(404).json({ error: "Документ не найден" });

  await logAudit({
    userId: req.currentUser!.id,
    action: "delete",
    entityType: "document",
    entityId: id,
    before: deleted,
  });

  res.json({ ok: true });
}));

// ============ USERS ============
router.get("/users", requireRole("superadmin"), asyncHandler(async (_req, res) => {
  const list = await getAllUsers();
  res.json(list);
}));

router.patch("/users/:id/role", requireRole("superadmin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

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

// ============ ZERGS ============
router.post("/zergs", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.patch("/zergs/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = zergSchema.omit({ id: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateZerg(req.params.id, parsed.data);
  if (!result) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "update", entityType: "zerg", entityId: req.params.id, before: result.before, after: result.after });
  res.json(result.after);
}));

router.delete("/zergs/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const deleted = await deleteZerg(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "delete", entityType: "zerg", entityId: req.params.id, before: deleted });
  res.json({ ok: true });
}));

// ============ DROIDS ============
router.post("/droids", requireRole("admin"), asyncHandler(async (req, res) => {
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

router.patch("/droids/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const parsed = droidSchema.omit({ id: true }).partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

  const result = await updateDroid(req.params.id, parsed.data);
  if (!result) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "update", entityType: "droid", entityId: req.params.id, before: result.before, after: result.after });
  res.json(result.after);
}));

router.delete("/droids/:id", requireRole("admin"), asyncHandler(async (req, res) => {
  const deleted = await deleteDroid(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Запись не найдена" });

  await logAudit({ userId: req.currentUser!.id, action: "delete", entityType: "droid", entityId: req.params.id, before: deleted });
  res.json({ ok: true });
}));

export default router;
