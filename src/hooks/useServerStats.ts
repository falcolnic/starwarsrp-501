import { useCallback, useEffect, useRef, useState } from "react";
import {
    fetchOnline,
    fetchPlayers,
    fetchStatus,
    type Interval,
    type OnlinePoint,
    type PlayerEntry,
    type ServerStatus,
} from "../services/statsService";

interface Async<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
}

function useAsync<T>(
    load: () => Promise<T>,
    deps: unknown[],
    every = 0,
): Async<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nonce, setNonce] = useState(0);

    const loadRef = useRef(load);
    loadRef.current = load;

    useEffect(() => {
        let alive = true;

        const run = async (showSpinner: boolean) => {
        if (showSpinner) setLoading(true);
        try {
            const result = await loadRef.current();
            if (!alive) return;
            setData(result);
            setError(null);
        } catch (err) {
            if (alive) setError(err instanceof Error ? err.message : String(err));
        } finally {
            if (alive) setLoading(false);
        }
        };

        run(true);

        if (every > 0) {
        const id = setInterval(() => run(false), every);
        return () => {
            alive = false;
            clearInterval(id);
        };
        }
        return () => {
        alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, every, nonce]);

    const reload = useCallback(() => setNonce((n) => n + 1), []);
    return { data, loading, error, reload };
}

export function useOnlineHistory(interval: Interval) {
    const { data, ...rest } = useAsync<OnlinePoint[]>(
        () => fetchOnline(interval),
        [interval],
        5 * 60 * 1000,
    );
    return { points: data ?? [], ...rest };
}

export function useServerStatus() {
    const { data, ...rest } = useAsync<ServerStatus>(fetchStatus, [], 30 * 1000);
    return { status: data, ...rest };
}

export function useLivePlayers() {
    const { data, ...rest } = useAsync<PlayerEntry[]>(
        fetchPlayers,
        [],
        60 * 1000,
    );
    return { players: data ?? [], ...rest };
}
