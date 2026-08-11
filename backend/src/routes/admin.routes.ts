import { Router } from "express";
import { z } from "zod";
import { requireRole } from "../middleware/requireRole.js";
import { logAudit } from "../services/audit.service.js";
import { createRank, updateRank, deleteRank } from "../services/rank.service.js";
import { createDocument, updateDocument, deleteDocument } from "../services/document.service.js";
import { getAllUsers, updateUserRole } from "../services/user.service.js";

const router = Router();

// ============ RANKS (admin+) ============
const rankSchema = z.object({
  name: z.string().min(1),
  order: z.number().int(),
  description: z.string().optional(),
});

router.post("/ranks", requireRole("admin"), async (req, res) => {
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
});

router.patch("/ranks/:id", requireRole("admin"), async (req, res) => {
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
});

router.delete("/ranks/:id", requireRole("admin"), async (req, res) => {
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
});

// ============ DOCUMENTS (admin+) ============
const docSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  category: z.string().optional(),
});

router.post("/docs", requireRole("admin"), async (req, res) => {
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
});

router.patch("/docs/:id", requireRole("admin"), async (req, res) => {
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
});

router.delete("/docs/:id", requireRole("admin"), async (req, res) => {
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
});

// ============ USERS (superadmin only) ============
router.get("/users", requireRole("superadmin"), async (_req, res) => {
  const list = await getAllUsers();
  res.json(list);
});

const roleSchema = z.object({
  role: z.enum(["user", "admin", "superadmin"]),
});

router.patch("/users/:id/role", requireRole("superadmin"), async (req, res) => {
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
});

export default router;
