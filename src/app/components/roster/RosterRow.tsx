import { useState } from "react";
import { StatusChip } from "./StatusChip";
import { MedalSlots } from "./MedalSlots";
import { ReprimandCell } from "./ReprimandCell";
import { Check } from "lucide-react";
import { Soldier } from "../../../services/soldierService";

interface RosterRowProps {
    soldier: Soldier;
    index: number;
    onClick: () => void;
}

export function RosterRow({ soldier, index, onClick }: RosterRowProps) {
    const callsign = soldier.callsignOverride || soldier.nickname || `CT-${soldier.cid}`;
    const [copiedType, setCopiedType] = useState<"steam" | "discord" | null>(null);

    const steamId = soldier.steamId;
    const discordId = soldier.discordId;

    const handleCopy = (e: React.MouseEvent, text: string | null, type: "steam" | "discord") => {
        e.stopPropagation();
        if (!text) return;

        navigator.clipboard.writeText(text);
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 1500);
    };

    return (
        <tr
        onClick={onClick}
        className="anim-fade-up cursor-pointer group hover:bg-[var(--primary)]/[0.07] transition-colors"
        style={{ animationDelay: `${40 + index * 45}ms` }}
        >
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <span className="font-mono text-sm text-[var(--primary)] tracking-[0.08em]">{soldier.cid}</span>
        </td>
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <span className="font-[var(--font-display)] text-base tracking-[0.04em]">{callsign}</span>
        </td>
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <span className="font-[var(--font-display)] text-base text-[var(--muted-foreground)]">
            {soldier.rank ?? "—"}
            </span>
        </td>
        <td className="px-2 py-2.5 border-t border-[var(--border)]">
            <span className="font-mono text-sm text-[var(--muted-foreground)]">
            {soldier.positions.slice(0, 2).join(", ") || "—"}
            </span>
        </td>
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <span className="font-mono text-sm text-[var(--muted-foreground)]">
            {soldier.squads.slice(0, 1).join(", ") || "—"}
            </span>
        </td>
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <MedalSlots medals={soldier.medals} />
        </td>
        <td className="px-4 py-2.5 border-t border-[var(--border)] text-center">
            <ReprimandCell count={soldier.reprimands} frozen={soldier.reprimandsFrozen} />
        </td>
        <td className="px-1 py-2.5 border-t border-[var(--border)]">
            <StatusChip status={soldier.status} />
        </td>

        <td className="px-2 py-2.5 border-t border-[var(--border)] text-right">
            <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
                type="button"
                title={steamId ? `Скопировать Steam ID: ${steamId}` : "Steam ID отсутствует"}
                disabled={!steamId}
                onClick={(e) => handleCopy(e, steamId, "steam")}
                className="p-1 rounded hover:bg-[var(--primary)]/20 text-[var(--muted-foreground)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative cursor-pointer"
            >
                {copiedType === "steam" ? (
                <Check size={14} className="text-[#2ECC71]" />
                ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c.002.052.006.105.006.158 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12z" />
                </svg>
                )}
            </button>

            <button
                type="button"
                title={discordId ? `Скопировать Discord ID: ${discordId}` : "Discord ID отсутствует"}
                disabled={!discordId}
                onClick={(e) => handleCopy(e, discordId, "discord")}
                className="p-1 rounded hover:bg-[var(--primary)]/20 text-[var(--muted-foreground)] hover:text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors relative cursor-pointer"
            >
                {copiedType === "discord" ? (
                <Check size={17} className="text-[#2ECC71]" />
                ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                )}
            </button>
            </div>
        </td>
        </tr>
    );
}