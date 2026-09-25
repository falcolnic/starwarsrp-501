export const SERVER_TZ = "Europe/Moscow"; // ngg buckets read naturally in MSK

export type Interval = "day" | "week" | "month";

export interface OnlinePoint {
  /** Unix seconds, exactly as the API keys them. */
    t: number;
    date: Date;
    value: number;
}

/** Raw shape of /api/online/ — { "<unix seconds>": <players online> }. */
export type OnlineRaw = Record<string, number>;

export interface ServerStatus {
    error: boolean;
    name: string;
    location: string;
    map: string;
    players: number;
    max_players: number;
}

export interface PlayerEntry {
    uid: string;
    cid: string;
    nick: string;
    rank: string;
    legion: string;
}

// Updated to match the exact string the API now sends
export const LEGION_501 = "501-й";

/** 
 * Reference list of known legions. 
 * Note: We now group dynamically based on who is actually online.
 */
export const LEGIONS = [
    "501-й",
    "104-й",
    "212-й",
    "41-й",
    "Гвардия",
    "Мед. Корпус",
    "ИПК",
    "Кадетский корпус",
    "14501-й",
    "11",
    "Солдат-клон",
    "Пилоты",
    "Дис. батальон",
    "Без подразделения"
] as const;

/* ------------------------------------------------------------------ */
/* fetching                                                            */
/* ------------------------------------------------------------------ */

async function get<T>(params: Record<string, string>): Promise<T> {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/ngg?${qs}`);
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export async function fetchOnline(interval: Interval): Promise<OnlinePoint[]> {
    const raw = await get<OnlineRaw>({ resource: "online", interval });
    return parseOnline(raw);
}

export function fetchStatus(): Promise<ServerStatus> {
    return get<ServerStatus>({ resource: "status" });
}

export function fetchPlayers(): Promise<PlayerEntry[]> {
    return get<PlayerEntry[]>({ resource: "players" });
}

/* ------------------------------------------------------------------ */
/* parsing + derived stats                                             */
/* ------------------------------------------------------------------ */

export function parseOnline(raw: OnlineRaw): OnlinePoint[] {
    return Object.entries(raw)
        .map(([t, value]) => {
            const secs = Number(t);
            return { t: secs, date: new Date(secs * 1000), value };
        })
        // ADD THIS LINE: Ignore values of 0 so the graph doesn't drop during server restarts
        .filter((point) => point.value > 0) 
        .sort((a, b) => a.t - b.t);
}

export interface OnlineSummary {
    current: number;
    peak: number;
    peakAt: Date | null;
    low: number;
    lowAt: Date | null;
    average: number;
    median: number;
    /** Percent change of the latest half vs the earlier half of the window. */
    trend: number;
    /** Seconds between samples. */
    step: number;
}

export function summarize(points: OnlinePoint[]): OnlineSummary {
    if (points.length === 0) {
        return {
        current: 0, peak: 0, peakAt: null, low: 0, lowAt: null,
        average: 0, median: 0, trend: 0, step: 0,
        };
    }

    const values = points.map((p) => p.value);
    let peakIdx = 0;
    let lowIdx = 0;
    for (let i = 1; i < values.length; i++) {
        if (values[i] > values[peakIdx]) peakIdx = i;
        if (values[i] < values[lowIdx]) lowIdx = i;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
        sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const half = Math.floor(points.length / 2);
    const mean = (arr: number[]) =>
        arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
    const older = mean(values.slice(0, half));
    const newer = mean(values.slice(half));

    return {
        current: values[values.length - 1],
        peak: values[peakIdx],
        peakAt: points[peakIdx].date,
        low: values[lowIdx],
        lowAt: points[lowIdx].date,
        average: mean(values),
        median,
        trend: older > 0 ? ((newer - older) / older) * 100 : 0,
        step: points.length > 1 ? points[1].t - points[0].t : 0,
    };
}

/**
 * Average online per hour of day, in server time. Feed it the `month` series
 * for a stable picture of when the server actually fills up.
 */
export function hourlyProfile(points: OnlinePoint[]): number[] {
    const sums = new Array(24).fill(0);
    const counts = new Array(24).fill(0);

    for (const p of points) {
        const hour = Number(
        new Intl.DateTimeFormat("ru-RU", {
            hour: "2-digit",
            hour12: false,
            timeZone: SERVER_TZ,
        }).format(p.date),
        );
        sums[hour] += p.value;
        counts[hour] += 1;
    }

    return sums.map((s, i) => (counts[i] ? s / counts[i] : 0));
}

export function groupByLegion(
    players: PlayerEntry[],
): Array<{ legion: string; count: number; players: PlayerEntry[] }> {
    const map = new Map<string, PlayerEntry[]>();

    // Only map units that actually have players online right now
    for (const p of players) {
        const legionName = p.legion || "Без подразделения"; 
        
        const bucket = map.get(legionName);
        if (bucket) {
            bucket.push(p);
        } else {
            map.set(legionName, [p]);
        }
    }

    // Always ensure the 501st is in the map so your UI has a "home" row
    if (!map.has(LEGION_501)) {
        map.set(LEGION_501, []);
    }

    // Convert to an array and sort by player count (highest first)
    return [...map.entries()]
        .map(([legion, list]) => ({ legion, count: list.length, players: list }))
        .sort((a, b) => b.count - a.count);
}


/* ------------------------------------------------------------------ */
/* formatting                                                          */
/* ------------------------------------------------------------------ */

const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("ru-RU", { timeZone: SERVER_TZ, ...opts });

export const formatTime = (d: Date) =>
    fmt({ hour: "2-digit", minute: "2-digit" }).format(d);

export const formatDay = (d: Date) =>
    fmt({ day: "2-digit", month: "2-digit" }).format(d);

export const formatFull = (d: Date) =>
    fmt({
        day: "2-digit", month: "2-digit",
        hour: "2-digit", minute: "2-digit",
    }).format(d);

export function axisLabels(points: OnlinePoint[], interval: Interval): string[] {
    const out: string[] = [];
    let last: string | null = null;

    for (const p of points) {
        const label =
        interval === "day"
            ? fmt({ hour: "2-digit" }).format(p.date)
            : formatDay(p.date);
        out.push(label === last ? "" : label);
        last = label;
    }
    return out;
}
