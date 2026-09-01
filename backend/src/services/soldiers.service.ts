import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { soldiers } from "../db/schema.js";

export async function getAllSoldiers() {
    return db.select().from(soldiers);
}

export async function getSoldierByCid(cid: string) {
    const [soldier] = await db.select().from(soldiers).where(eq(soldiers.cid, cid)).limit(1);
    return soldier ?? null;
}

export async function createSoldier(data: {
    cid: string;
    rank?: string | null;
    steamId?: string | null;
    callsignOverride?: string | null;
    positions?: string[];
    squads?: string[];
    attached?: string[];
    medals?: string[];
    status?: string;
    joinDate?: string | null;
    discordId?: string | null;
    avatar?: string | null;
    leaveUntil?: string | null;
    reserveUntil?: string | null;
    unitLevel?: number;
    reprimands?: number;
    reprimandsFrozen?: boolean;
    commandRole?: string | null;
    commandOrder?: number | null;
}) {
    const existing = await getSoldierByCid(data.cid);
    if (existing) throw new Error("DUPLICATE_CID");

    await db.insert(soldiers).values({
        cid: data.cid,
        rank: data.rank ?? null,
        steamId: data.steamId ?? null,
        callsignOverride: data.callsignOverride ?? null,
        positions: data.positions ?? [],
        squads: data.squads ?? [],
        attached: data.attached ?? [],
        medals: data.medals ?? [],
        status: data.status ?? "active",
        joinDate: data.joinDate ?? null,
        discordId: data.discordId ?? null,
        avatar: data.avatar ?? null,
        leaveUntil: data.leaveUntil ?? null,
        reserveUntil: data.reserveUntil ?? null,
        unitLevel: data.unitLevel ?? 0,
        reprimands: data.reprimands ?? 0,
        reprimandsFrozen: data.reprimandsFrozen ?? false,
        commandRole: data.commandRole ?? null,
        commandOrder: data.commandOrder ?? null,
    });

    return getSoldierByCid(data.cid);
}

export async function updateSoldier(
    cid: string,
    data: Partial<{
        rank: string | null;
        steamId: string | null;
        callsignOverride: string | null;
        positions: string[];
        squads: string[];
        attached: string[];
        medals: string[];
        reprimands: number;
        reprimandsFrozen: boolean;
        status: string;
        leaveUntil: string | null;
        reserveUntil: string | null;
        joinDate: string | null;
        discordId: string | null;
        avatar: string | null;
        commandRole: string | null;
        commandOrder: number | null;
    }>
    ) {
    const before = await getSoldierByCid(cid);
    if (!before) return null;

    await db.update(soldiers).set(data).where(eq(soldiers.cid, cid));
    const after = await getSoldierByCid(cid);

    return { before, after };
}

export async function deleteSoldier(cid: string) {
    const before = await getSoldierByCid(cid);
    if (!before) return null;

    await db.delete(soldiers).where(eq(soldiers.cid, cid));
    return before;
}

export async function updateSoldierMedals(cid: string, medals: string[]) {
    const before = await getSoldierByCid(cid);
    if (!before) return null;

    await db.update(soldiers).set({ medals }).where(eq(soldiers.cid, cid));
    const after = await getSoldierByCid(cid);

    return { before, after };
}