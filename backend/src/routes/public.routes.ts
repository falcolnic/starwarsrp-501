import { Router } from "express";
import { getAllRanks, getRankRequirements } from "../services/rank.service.js";
import { getAllDocuments } from "../services/document.service.js";
import { getAllBlacklist } from "../services/blacklist.service.js";
import { getAllZergs } from "../services/zerg.service.js";
import { getAllDroids } from "../services/droid.service.js";
import { getAllSoldiers } from "../services/soldiers.service.js";
const router = Router();

router.get("/ranks", async (_req, res) => {
  const ranks = await getAllRanks();
  res.json(ranks);
});

router.get("/soldiers", async (_req, res) => {
  const list = await getAllSoldiers();
  res.json(await getAllSoldiers());
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

router.get("/zergs", async (_req, res) => {
  res.json(await getAllZergs());
});

router.get("/droids", async (_req, res) => {
  res.json(await getAllDroids());
});

export default router;
