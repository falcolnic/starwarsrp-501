// api/ngg.ts — Vercel Edge Function
//
// Proxy for https://ngg.su/api/*. You need this because:
//  - ngg.su sends no CORS headers, so the browser cannot call it directly;
//  - it lets you cache responses at the edge instead of hammering their server
//    once per visitor;
//  - it keeps the upstream host in one place if it ever changes.
//
// Usage from the client:
//   /api/ngg?resource=online&interval=week
//   /api/ngg?resource=status
//   /api/ngg?resource=players

export const config = { runtime: "edge" };

const UPSTREAM = "https://ngg.su/api";
const INDEX = "sw1";

const RESOURCES = {
    online: ["online", 300, 600],
    status: ["status", 20, 60],
    players: ["players", 30, 90],
} as const;

type Resource = keyof typeof RESOURCES;

const INTERVALS = ["day", "week", "month"] as const;
type Interval = (typeof INTERVALS)[number];

function json(body: unknown, status: number, cache?: string) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": cache ?? "no-store",
        },
    });
}

export default async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const resource = url.searchParams.get("resource") as Resource | null;

    if (!resource || !(resource in RESOURCES)) {
        return json(
        { error: "Unknown resource", allowed: Object.keys(RESOURCES) },
        400,
        );
    }

    const [path, maxAge, swr] = RESOURCES[resource];
    const upstream = new URL(`${UPSTREAM}/${path}/`);
    upstream.searchParams.set("index", INDEX);

    if (resource === "online") {
        const interval = (url.searchParams.get("interval") ?? "day") as Interval;
        if (!INTERVALS.includes(interval)) {
        return json({ error: "Unknown interval", allowed: INTERVALS }, 400);
        }
        upstream.searchParams.set("interval", interval);
    }

    if (resource === "status") {
        upstream.searchParams.set("full", "1");
    }

    try {
        const res = await fetch(upstream, {
        headers: { accept: "application/json" },
        cf: { cacheTtl: maxAge },
        signal: AbortSignal.timeout(8000),
        } as RequestInit);

        if (!res.ok) {
        return json({ error: `Upstream returned ${res.status}` }, 502);
        }

        const data = await res.json();
        return json(
        data,
        200,
        `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}`,
        );
    } catch (err) {
        return json(
        { error: "Upstream unreachable", detail: String(err) },
        504,
        );
    }
}
