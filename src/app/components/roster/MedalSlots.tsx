interface MedalSlotsProps {
    medals: string[];
}

export function MedalSlots({ medals }: MedalSlotsProps) {
    if (!medals || medals.length === 0) {
        return <span className="text-[var(--muted-foreground)] text-xs">—</span>;
    }

    return (
        <div className="flex gap-1 flex-wrap">
        {medals.slice(0, 2).map((medal, i) => (
            <span
            key={i}
            title={medal}
            className="px-1.5 py-0.5 bg-[var(--primary)]/[0.08] border border-[var(--primary)]/20 text-[10px] font-mono text-[var(--primary)] truncate max-w-[120px]"
            >
            {medal}
            </span>
        ))}
        {medals.length > 2 && (
            <span className="text-[10px] font-mono text-[var(--muted-foreground)] font-bold">
            +{medals.length - 2}
            </span>
        )}
        </div>
    );
}