import { STATUS_CONFIG } from "../FighterModal";

export function StatusChip({ status }: { status: string }) {
    const sc = STATUS_CONFIG[status] ?? {
        label: status.toUpperCase(),
        color: "var(--muted-foreground)",
        dot: "",
        freeze: false,
    };

    return (
        <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.12em] whitespace-nowrap border"
            style={{ background: `${sc.color}15`, borderColor: `${sc.color}45`, color: sc.color }}
        >
        <div
            className={sc.dot ? sc.dot : "opacity-60"}
            style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: sc.color,
            boxShadow: sc.dot ? `0 0 6px ${sc.color}` : undefined,
            }}
        />
        {sc.label}
        </div>
    );
}