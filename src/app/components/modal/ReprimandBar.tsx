export function ReprimandBar({ count, frozen }: { count: number; frozen: boolean }) {
    return (
        <div className="p-3 bg-black/30 border border-[var(--border)]/40 rounded-xs">
        <div className="font-mono text-sm tracking-[0.18em] text-[var(--muted-foreground)] uppercase mb-2">
            Взыскания
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-8 h-2.5 border"
                    style={{
                    background: i < count ? (count >= 3 ? "#E74C3C" : "#F5C518") : "rgba(61,111,196,0.08)",
                    borderColor: i < count ? (count >= 3 ? "rgba(231,76,60,0.5)" : "rgba(245,197,24,0.5)") : "rgba(61,111,196,0.2)",
                    boxShadow: i < count && count >= 3 ? "0 0 6px rgba(231,76,60,0.4)" : "none",
                    }}
                />
                ))}
            </div>
            <div
                className="font-mono text-base font-bold"
                style={{ color: count >= 3 ? "#E74C3C" : count > 0 ? "#F5C518" : "var(--muted-foreground)" }}
            >
                {count}/3
            </div>
            </div>

            {frozen && (
            <div className="font-mono text-[10px] tracking-[0.1em] text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/25 px-2 py-0.5">
                ❄ ЗАМОРОЖЕНО
            </div>
            )}
        </div>
        </div>
    );
}