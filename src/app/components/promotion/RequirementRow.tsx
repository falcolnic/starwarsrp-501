import { CheckCircle2, Circle, Zap, User } from "lucide-react";
import { RequirementStatus } from "../../../services/promotionRules";

interface ProgressBarProps {
    value: number;
    max: number;
}

function ProgressBar({ value, max }: ProgressBarProps) {
    const pct = Math.min(100, Math.round((value / max) * 100));

    return (
        <div className="flex items-center gap-2 w-full mt-1.5">
        <div className="flex-1 h-1.5 bg-[#0d1829]/80 border border-[var(--border)] rounded overflow-hidden relative">
            <div
            className={`h-full transition-all duration-700 ease-out ${
                pct >= 100 ? "bg-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.5)]" : "bg-[var(--primary)] shadow-[0_0_6px_rgba(61,111,196,0.4)]"
            }`}
            style={{ width: `${pct}%` }}
            />
        </div>
        <span
            className={`font-mono text-sm min-w-[32px] text-right ${
            pct >= 100 ? "text-[#2ECC71] font-bold" : "text-[var(--muted-foreground)]"
            }`}
        >
            {pct}%
        </span>
        </div>
    );
}

interface RequirementRowProps {
    rs: RequirementStatus;
}

export function RequirementRow({ rs }: RequirementRowProps) {
    const isAuto = rs.requirement.type === "auto";

    return (
        <div
        className={`flex items-start gap-4 p-3 border-b border-[var(--border)] last:border-b-0 transition-colors duration-200 ${
            rs.completed ? "bg-[#2ecc71]/5 anim-fade-up" : "hover:bg-white/[0.01]"
        }`}
        >
        <div className="shrink-0 mt-0.5">
            {rs.completed ? (
            <CheckCircle2 size={16} className="text-[#2ECC71]" />
            ) : (
            <Circle size={16} className="text-[var(--muted-foreground)] opacity-40" />
            )}
        </div>

        <div className="flex-1 min-w-0">
            <div
            className={`font-sans text-sm md:text-sm leading-relaxed ${
                rs.completed ? "text-white" : "text-[var(--muted-foreground)]"
            }`}
            >
            {rs.requirement.label}
            </div>
            {isAuto && rs.current !== undefined && rs.target !== undefined && (
            <div className="max-w-md">
                <ProgressBar value={rs.current} max={rs.target} />
                <div className="font-mono text-xs text-[var(--muted-foreground)] mt-1 tracking-wider">
                {rs.current} / {rs.target}
                </div>
            </div>
            )}
        </div>

        <div
            className={`shrink-0 flex items-center gap-1.5 px-2 py-0.5 border text-xs font-mono tracking-widest uppercase rounded select-none ${
            isAuto
                ? "border-[var(--primary)]/30 text-[var(--primary)]"
                : "border-[var(--border)] text-[var(--muted-foreground)]"
            }`}
        >
            {isAuto ? <Zap size={10} /> : <User size={10} />}
            {isAuto ? "АВТО" : "РУЧНОЕ"}
        </div>
        </div>
    );
}