import { Logo } from "./Logo";

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
        <div className="relative w-[180px] h-[180px]">
            <div className="anim-rotate-ccw absolute inset-0 flex items-center justify-center">
                <svg width="190" height="190" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(61,111,196,0.3)" strokeWidth="1" strokeDasharray="6,12" />
                </svg>
            </div>
            <div className="anim-rotate absolute inset-0 flex items-center justify-center">
                <svg width="190" height="190" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(61,111,196,0.18)" strokeWidth="1" strokeDasharray="3,9" />
                {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i * 30 * Math.PI) / 180;
                    return <line key={i} x1={80 + 56 * Math.cos(a)} y1={80 + 56 * Math.sin(a)} x2={80 + 62 * Math.cos(a)} y2={80 + 62 * Math.sin(a)} stroke="rgba(61,111,196,0.4)" strokeWidth="1.5" />;
                })}
                </svg>
            </div>
            <Logo imgSize={140} divSize={180} />
            <div className="anim-border-glow absolute inset-[10px] rounded-full border border-[rgba(61,111,196,0.15)] pointer-events-none" />
        </div>
    );
}
