import { DbRank } from "../../../services/rankService";

export function RankBar({ rank, ranks }: { rank: string; ranks: DbRank[] }) {
    const idx = ranks.findIndex((r) => r.name === rank);
    const totalRanks = ranks.length > 0 ? ranks.length : 1;
    const isUnknown = idx < 0;
    const pct = isUnknown ? 0 : Math.round((idx / (totalRanks - 1 || 1)) * 100);

    return (
        <div className="mb-5">
        <div className="font-mono text-sm tracking-[0.18em] text-[var(--muted-foreground)] uppercase mb-1.5 flex justify-between">
            <span>Прогресс Звания</span>
            <span className={isUnknown ? "text-[var(--muted-foreground)]" : "text-[var(--primary)]"}>
            {isUnknown ? "НЕДОСТУПНО" : `${idx + 1} / ${totalRanks}`}
            </span>
        </div>
        <div className="h-[3px] bg-[var(--primary)]/10 border border-[var(--primary)]/10 relative">
            {!isUnknown && (
            <div
                className="absolute top-0 left-0 bottom-0 bg-[var(--primary)] shadow-[0_0_8px_rgba(61,111,196,0.5)]"
                style={{ width: `${pct}%`, animation: "progress-fill 1.2s ease both" }}
            />
            )}
        </div>
        </div>
    );
}