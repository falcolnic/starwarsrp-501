const items = ["GAR-501-EAL", "CLEARANCE: INTERNAL", "STATUS: OPERATIONAL", "THEATRE: ACTIVE", "UNIT STRENGTH: FULL", "COMMAND: SECURE", "NET: ENCRYPTED"];

export function InfoTicker() {
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden border-t border-b border-[var(--border)] py-[5px] mb-0">
        <div className="marquee-track gap-0">
            {doubled.map((item, i) => (
            <span key={i} className="font-[var(--font-mono)] text-sm tracking-[0.2em] text-[rgba(143,163,192,0.5)] px-[28px]">
                <span className="text-[rgba(61,111,196,0.6)] mr-[12px]">▸</span>
                {item}
            </span>
            ))}
        </div>
        </div>
    );
}