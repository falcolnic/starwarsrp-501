interface InfoBlockProps {
    label: string;
    value: string;
    accent?: boolean;
    mono?: boolean;
}

export function InfoBlock({ label, value, accent, mono }: InfoBlockProps) {
    return (
        <div className="bg-[#0c1424]/40 border border-[var(--border)]/40 p-3.5 rounded">
        <div className="font-mono text-xs tracking-widest text-[var(--muted-foreground)] mb-1 uppercase">
            {label}
        </div>
        <div
            className={`text-sm lg:text-lg font-semibold tracking-wide truncate ${
            accent ? "text-[var(--primary)]" : "text-white"
            } ${mono ? "font-mono" : "font-display"}`}
        >
            {value}
        </div>
        </div>
    );
}