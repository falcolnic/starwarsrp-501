// api/cron/snapshot.ts — OPTIONAL
//
// ngg.su only exposes TOTAL server online history. There is no per-legion
// history endpoint. Your bot solves this by polling /api/players/ every 15
// minutes and writing counts into its own Postgres (see `online_logs` in
// status.py).
//
// This does the same thing on Vercel, so the site does not depend on the bot
// being up. Storage here is Upstash Redis (`npm i @upstash/redis`), because it
// is free-tier friendly and the payload is tiny; swap in Vercel Postgres or
// your existing bot DB if you would rather have one source of truth.
//
// vercel.json:
//   { "crons": [{ "path": "/api/cron/snapshot", "schedule": "*/15 * * * *" }] }
//
// Set CRON_SECRET in project env; Vercel sends it as a Bearer token.

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const KEY = "legion-online";
const RETENTION_DAYS = 30;

interface PlayerEntry {
    uid: string;
    cid: string;
    nick: string;
    rank: string;
    legion: string;
}

export default async function handler(req: Request): Promise<Response> {
    if (
        process.env.CRON_SECRET &&
        req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return new Response("Unauthorized", { status: 401 });
    }

    const res = await fetch("https://ngg.su/api/players/?index=sw1", {
        headers: { accept: "application/json" },
    });
    if (!res.ok) {
        return Response.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }

    const players = (await res.json()) as PlayerEntry[];

    const counts: Record<string, number> = {};
    for (const player of players) {
        counts[player.legion] = (counts[player.legion] ?? 0) + 1;
    }

    const t = Math.floor(Date.now() / 1000);
    await redis.zadd(KEY, {
        score: t,
        member: JSON.stringify({ t, total: players.length, counts }),
    });

    // Trim anything older than the retention window.
    await redis.zremrangebyscore(KEY, 0, t - RETENTION_DAYS * 86400);

    return Response.json({ ok: true, t, total: players.length, counts });
}
