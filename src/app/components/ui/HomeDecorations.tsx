export function SectionDecor() {
    return (
        <div className="flex items-center gap-[12px] my-[36px]">
        <div className="h-[1px] flex-1 bg-[var(--border)]" />
        <div className="w-[6px] h-[6px] bg-[var(--primary)] rotate-45 shadow-[0_0_8px_rgba(61,111,196,0.6)]" />
        <div className="w-[4px] h-[4px] border border-[var(--primary)] rotate-45" />
        <div className="w-[6px] h-[6px] bg-[var(--primary)] rotate-45 shadow-[0_0_8px_rgba(61,111,196,0.6)]" />
        <div className="h-[1px] flex-1 bg-[var(--border)]" />
        </div>
    );
}

export function CornerDecoration({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
    const variants = {
        "top-left":     "top-[20px] left-[20px] border-t-2 border-l-2",
        "top-right":    "top-[20px] right-[20px] border-t-2 border-r-2",
        "bottom-left":  "bottom-[60px] left-[20px] border-b-2 border-l-2",
        "bottom-right": "bottom-[60px] right-[20px] border-b-2 border-r-2",
    };

    return (
        <div className={`absolute w-[40px] h-[40px] border-[rgba(61,111,196,0.5)] border-solid pointer-events-none anim-scale-in ${variants[position]}`} />
    );
}

export function HeroEmblem() {
    return (
        <div className="relative w-[160px] h-[160px]">
        <div className="anim-rotate-ccw absolute inset-0 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(61,111,196,0.3)" strokeWidth="1" strokeDasharray="6,12" />
            </svg>
        </div>
        <div className="anim-rotate absolute inset-0 flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(61,111,196,0.18)" strokeWidth="1" strokeDasharray="3,9" />
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                return <line key={i} x1={80 + 56 * Math.cos(a)} y1={80 + 56 * Math.sin(a)} x2={80 + 62 * Math.cos(a)} y2={80 + 62 * Math.sin(a)} stroke="rgba(61,111,196,0.4)" strokeWidth="1.5" />;
            })}
            </svg>
        </div>
        <svg width="160" height="160" viewBox="0 0 160 160" className="absolute inset-0">
            <polygon points="80,14 130,43 130,97 80,126 30,97 30,43" fill="#0d1829" stroke="#3D6FC4" strokeWidth="2" />
            <polygon points="80,24 118,46 118,90 80,112 42,90 42,46" fill="none" stroke="rgba(61,111,196,0.25)" strokeWidth="1" />
            <circle cx="80" cy="70" r="24" fill="none" stroke="#3D6FC4" strokeWidth="1.5" />
            <circle cx="80" cy="70" r="10" fill="rgba(61,111,196,0.2)" stroke="#3D6FC4" strokeWidth="1" />
            {[0,60,120,180,240,300].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return <line key={i} x1={80 + 32 * Math.cos(r)} y1={70 + 32 * Math.sin(r)} x2={80 + 46 * Math.cos(r)} y2={70 + 46 * Math.sin(r)} stroke="#3D6FC4" strokeWidth="1.5" />;
            })}
            <circle cx="80" cy="70" r="4" fill="#3D6FC4" style={{ filter: "drop-shadow(0 0 4px #3D6FC4)" }} />
            <text x="80" y="118" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="rgba(143,163,192,0.5)" letterSpacing="4">501 · EAL</text>
        </svg>
        <div className="anim-border-glow absolute inset-[10px] rounded-full border border-[rgba(61,111,196,0.15)] pointer-events-none" />
        </div>
    );
}

export function InfoTicker() {
    const items = ["GAR-501-EAL", "CLEARANCE: INTERNAL", "STATUS: OPERATIONAL", "THEATRE: ACTIVE", "UNIT STRENGTH: FULL", "COMMAND: SECURE", "NET: ENCRYPTED"];
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden border-t border-b border-[var(--border)] py-[5px] mb-0">
        <div className="marquee-track gap-0">
            {doubled.map((item, i) => (
            <span key={i} className="font-[var(--font-mono)] text-[0.6rem] tracking-[0.2em] text-[rgba(143,163,192,0.5)] px-[28px]">
                <span className="text-[rgba(61,111,196,0.6)] mr-[12px]">▸</span>
                {item}
            </span>
            ))}
        </div>
        </div>
    );
}