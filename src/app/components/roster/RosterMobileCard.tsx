import type { Soldier } from "../../../services/soldierService";
import { StatusChip } from "./StatusChip";
import { MedalSlots } from "./MedalSlots";
import { ReprimandCell } from "./ReprimandCell";

interface RosterMobileCardProps {
    soldier: Soldier;
    index: number;
    onClick: () => void;
}

export function RosterMobileCard({ soldier, index, onClick }: RosterMobileCardProps) {
    const callsign = soldier.callsignOverride || soldier.nickname || `CT-${soldier.cid}`;

    return (
        <button
        onClick={onClick}
        className="anim-fade-up block w-full text-left bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors px-4 py-3.5 cursor-pointer"
        style={{
            animationDelay: `${50 + index * 55}ms`,
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
        }}
        >
        <div className="flex justify-between items-start gap-2 mb-2">
            <div>
            <div className="font-mono text-[0.62rem] text-[var(--primary)] tracking-[0.12em] mb-0.5">
                CID-{soldier.cid}
            </div>
            <div className="font-[var(--font-display)] text-base tracking-[0.06em]">{callsign}</div>
            <div className="font-[var(--font-display)] text-sm text-[var(--muted-foreground)] tracking-[0.04em] mt-0.5">
                {soldier.rank ?? "—"}
            </div>
            </div>
            <StatusChip status={soldier.status ?? "active"} />
        </div>

        <div className="flex gap-3 items-center">
            <MedalSlots medals={soldier.medals ?? []} />
            <span className="font-mono text-xs text-[var(--muted-foreground)]">
            {soldier.positions?.[0] ?? "—"}
            </span>
            <ReprimandCell count={soldier.reprimands ?? 0} frozen={soldier.reprimandsFrozen ?? false} />
        </div>
        </button>
    );
}