interface DangerBadgeProps {
    level: string;
}

function getDangerColor(level: string) {
    const normalized = level.toLowerCase();
    if (normalized.includes("высок")) return { color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
    if (normalized.includes("средн")) return { color: "#F5C518", bg: "rgba(245,197,24,0.1)" };
    return { color: "#4ADE80", bg: "rgba(74,222,128,0.1)" };
}

export function DangerBadge({ level }: DangerBadgeProps) {
    const { color, bg } = getDangerColor(level);
    return (
        <span
        className="font-mono text-xs uppercase tracking-[0.08em] px-2 py-1 border"
        style={{ color, background: bg, borderColor: color }}
        >
        {level}
        </span>
    );
}