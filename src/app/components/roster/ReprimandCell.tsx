export function ReprimandCell({ count, frozen }: { count: number; frozen: boolean }) {
    const colorClass = count >= 3 ? "text-red-500" : count > 0 ? "text-[#F5C518]" : "text-[var(--muted-foreground)]/25";

    return (
        <span className={`font-mono text-sm flex items-center gap-1.5 ${colorClass}`}>
        {frozen ? (
            <span className="text-xl font-bold text-[#F5C518]">
                ❄
            </span>
        ) : (
            <span>{count}/3</span>
        )}
        </span>
    );
}