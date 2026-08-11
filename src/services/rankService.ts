const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface DbRank {
    id: number;
    name: string;
    order: number;
    description: string | null;
}

export interface DbRankRequirement {
    id: number;
    rankId: number;
    description: string;
    type: "auto" | "manual";
    metric: string | null;
    threshold: number | null;
}

export async function fetchRanks(): Promise<DbRank[]> {
    const res = await fetch(`${API_BASE}/ranks`);
    if (!res.ok) throw new Error("Не удалось загрузить список званий");
    return res.json();
}

export async function fetchRankRequirements(rankId: number): Promise<DbRankRequirement[]> {
    const res = await fetch(`${API_BASE}/ranks/${rankId}/requirements`);
    if (!res.ok) throw new Error("Не удалось загрузить требования к званию");
    return res.json();
}