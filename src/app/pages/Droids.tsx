import { useState, useMemo } from "react";
import { droids } from "../../data/droids";
import { DroidCard } from "../components/database/DroidCard";

export function Droids() {
    const [query, setQuery] = useState("");

    const filtered = useMemo(
        () => droids.filter((d) => d.name.toLowerCase().includes(query.toLowerCase())),
        [query]
    );

    return (
        <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-col gap-6">
        <div>
            <h1
            className="text-2xl font-bold tracking-[0.08em] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
            Дроиды
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Боевые дроиды Конфедерации Независимых Систем.
            </p>
        </div>

        <input
            type="text"
            placeholder="Поиск по названию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm px-4 py-2 outline-none border"
            style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.3)", color: "var(--foreground)" }}
        />

        <div className="flex flex-col gap-3">
            {filtered.map((d) => (
            <DroidCard key={d.id} entry={d} />
            ))}
            {filtered.length === 0 && (
            <p className="font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
                Ничего не найдено.
            </p>
            )}
        </div>
        </div>
    );
}