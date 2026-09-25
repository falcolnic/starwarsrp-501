// dev-api-plugin.ts
//
// Vite has no idea the /api folder means anything — that is a Vercel build
// convention. This plugin makes `vite dev` route /api/* to the matching file,
// using the same Web Request/Response signature the edge runtime uses, so the
// handlers run unmodified in both places.
//
// Modules are loaded per request via ssrLoadModule, so you get HMR and only
// the route you actually hit gets imported (i.e. /api/cron/snapshot.ts will
// not break startup if @upstash/redis is not installed).

import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

const API_DIR = "api";

function resolveHandlerFile(pathname: string): string | null {
  // "/api/ngg" -> "api/ngg.ts", "/api/cron/snapshot" -> "api/cron/snapshot.ts"
    const rel = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
    if (!rel.startsWith(`${API_DIR}/`)) return null;

    for (const candidate of [`${rel}.ts`, `${rel}.js`, `${rel}/index.ts`]) {
        const abs = path.resolve(process.cwd(), candidate);
        if (fs.existsSync(abs)) return abs;
    }
    return null;
}

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
    if (req.method === "GET" || req.method === "HEAD") return undefined;
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks);
}

export function devApi(): Plugin {
    return {
        name: "dev-api",
        apply: "serve",
        configureServer(server) {
        server.middlewares.use(async (req, res: ServerResponse, next) => {
            const url = new URL(req.url ?? "/", "http://localhost");
            if (!url.pathname.startsWith(`/api/ngg`)) return next();

            const file = resolveHandlerFile(url.pathname);
            if (!file) {
            res.statusCode = 404;
            res.setHeader("content-type", "application/json");
            res.end(
                JSON.stringify({
                error: `No handler file for ${url.pathname}`,
                looked_for: `${url.pathname.slice(1)}.ts`,
                }),
            );
            return;
            }

            try {
            const mod = await server.ssrLoadModule(file);
            const handler = mod.default;
            if (typeof handler !== "function") {
                throw new Error(`${file} has no default export function`);
            }

            const request = new Request(`http://localhost${req.url}`, {
                method: req.method,
                headers: req.headers as Record<string, string>,
                body: await readBody(req),
            });

            const response: Response = await handler(request);

            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(Buffer.from(await response.arrayBuffer()));
            } catch (err) {
            server.ssrFixStacktrace(err as Error);
            console.error(`[dev-api] ${url.pathname} failed:`, err);
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ error: String(err) }));
            }
        });
        },
    };
}