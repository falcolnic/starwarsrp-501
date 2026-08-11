import { Router } from "express";
import { getAllRanks, getRankRequirements } from "../services/rank.service.js";
import { getAllDocuments } from "../services/document.service.js";
import { getAllBlacklist } from "../services/blacklist.service.js";
import { db } from "../db/client.js";
import { soldiers } from "../db/schema.js";
const router = Router();

router.get("/ranks", async (_req, res) => {
  const ranks = await getAllRanks();
  res.json(ranks);
});

router.get("/soldiers", async (_req, res) => {
  const allSoldiers = await db.select().from(soldiers);
  res.json(allSoldiers);
});

router.get("/ranks/:id/requirements", async (req, res) => {
  const rankId = Number(req.params.id);
  if (Number.isNaN(rankId)) {
    return res.status(400).json({ error: "Некорректный id звания" });
  }

  const requirements = await getRankRequirements(rankId);
  res.json(requirements);
});

router.get("/docs", async (_req, res) => {
  const docs = await getAllDocuments();
  res.json(docs);
});

router.get("/blacklist", async (_req, res) => {
  const entries = await getAllBlacklist();
  res.json(entries);
});

export default router;
