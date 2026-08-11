import { useEffect, useState } from "react";
import { getSoldiers, type Soldier } from "../services/soldierService";

export function useSoldiers() {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        getSoldiers()
        .then(setSoldiers)
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    return { soldiers, loading, refetch: loadData };
}