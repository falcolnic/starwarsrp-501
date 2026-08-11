export interface Soldier {
    cid: string;
    steamId: string | null;
    discordId: string | null;
    nickname: string | null;
    rank: string | null;
    rankSince: string | null;
    onlineTotalHours: number;
    onlineSessions: number;
    unitLevel: number;
    recentSessions: Array<{ date: string; duration: number }>;
    lastSyncedAt: string | null;

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
    avatar: string | null;
    commandRole: string | null;
    commandOrder: number | null;
}

export async function getSoldiers(): Promise<Soldier[]> {
    const res = await fetch("/api/soldiers");
    if (!res.ok) throw new Error("Failed to fetch soldiers");
    return res.json() as Promise<Soldier[]>;
}