import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { blacklist } from "../db/schema.js";

export async function getAllBlacklistEntries() {
    return db.select().from(blacklist);
}

export async function createBlacklistEntry(data: {
    number: string;
    callsign: string;
    steamId: string;
    reason: string;
    addedBy: number;
    addedDate: string;
    workoff: string;
    status?: "TRIALS" | "EXILED" | "BANNED";
}) {
    const result = await db.insert(blacklist).values({
        number: data.number,
        callsign: data.callsign,
        steamId: data.steamId,
        reason: data.reason,
        addedBy: data.addedBy,
        addedDate: data.addedDate,
        workoff: data.workoff,
        status: data.status ?? "BANNED",
    });

    const [created] = await db.select().from(blacklist).where(eq(blacklist.id, result[0].insertId)).limit(1);
    return created;
}

export async function updateBlacklistEntry(
    id: number,
    data: Partial<{
        number: string;
        callsign: string;
        steamId: string;
        reason: string;
        workoff: string;
        status: "TRIALS" | "EXILED" | "BANNED";
    }>
) {
    const [before] = await db.select().from(blacklist).where(eq(blacklist.id, id)).limit(1);
    if (!before) return null;

    await db.update(blacklist).set(data).where(eq(blacklist.id, id));
    const [after] = await db.select().from(blacklist).where(eq(blacklist.id, id)).limit(1);

    return { before, after };
}

export async function deleteBlacklistEntry(id: number) {
    const [before] = await db.select().from(blacklist).where(eq(blacklist.id, id)).limit(1);
    if (!before) return null;

    await db.delete(blacklist).where(eq(blacklist.id, id));
    return before;
}