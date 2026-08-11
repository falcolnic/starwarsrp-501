// frontend/src/hooks/useRanks.ts
import { useState, useEffect } from "react";
import { fetchRanks, fetchRankRequirements, DbRank, DbRankRequirement } from "../services/rankService";

export function useRanks() {
    const [ranks, setRanks] = useState<DbRank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRanks()
        .then((data) => {
            const sorted = [...data].sort((a, b) => a.order - b.order);
            setRanks(sorted);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    return { ranks, loading, error };
}

export function useRankRequirements(rankId: number | null) {
    const [requirements, setRequirements] = useState<DbRankRequirement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (rankId === null) return;

        setLoading(true);
        fetchRankRequirements(rankId)
        .then((data) => setRequirements(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [rankId]);

    return { requirements, loading, error };
}