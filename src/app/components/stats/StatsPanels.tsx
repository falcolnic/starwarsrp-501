// src/app/components/stats/StatsPanels.tsx
import type { ReactNode } from "react";
import {
    LEGION_501,
    type PlayerEntry,
    formatFull,
} from "../../../services/statsService";

/* ------------------------------------------------------------------ */

export function StatTile({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: ReactNode;
    sub?: string;
    accent?: boolean;
}) {
    return (
        <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 transition-colors hover:bg-white/[0.01]">
            {accent && (
                <>
                    {/* Added a subtle background glow behind the accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#3D6FC4]/10 to-transparent pointer-events-none" />
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#3D6FC4]" />
                </>
            )}
            <div className="font-mono text-xs tracking-[0.18em] text-[var(--muted-foreground)]">
                {label}
            </div>
            <div
                className="mt-1.5 font-[family:var(--font-display)] text-3xl leading-none tracking-tight"
                style={{ color: accent ? "#3D6FC4" : "var(--foreground)" }}
            >
                {value}
            </div>
            {sub && (
                <div className="mt-1.5 font-mono text-xs text-[var(--muted-foreground)]">
                    {sub}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */

export function HourProfile({ profile }: { profile: number[] }) {
    const max = Math.max(...profile, 1);
    const bestHour = profile.indexOf(Math.max(...profile));

    return (
        <div className="border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col h-full">
            <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap shrink-0">
                <div className="font-mono text-xs tracking-[0.18em] text-[var(--muted-foreground)]">
                    СРЕДНИЙ ОНЛАЙН ПО ЧАСАМ · МСК
                </div>
                <div className="font-mono text-xs text-[#3D6FC4]">
                    пик в {String(bestHour).padStart(2, "0")}:00
                </div>
            </div>

            <div className="flex items-end gap-[3px] flex-1 min-h-[120px]">
                {profile.map((value, hour) => (
                    <div
                        key={hour}
                        className="group/bar relative flex-1 flex flex-col justify-end h-full cursor-crosshair"
                        title={`${String(hour).padStart(2, "0")}:00 — ${value.toFixed(0)}`}
                    >
                        <div
                            className="w-full transition-all duration-300 opacity-80 group-hover/bar:opacity-100 group-hover/bar:brightness-125"
                            style={{
                                height: `${Math.max(2, (value / max) * 100)}%`,
                                background:
                                    hour === bestHour ? "#3D6FC4" : "rgba(61,111,196,0.32)",
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-2 flex justify-between font-mono text-xs text-[var(--muted-foreground)] shrink-0">
                {[0, 6, 12, 18, 23].map((h) => (
                    <span key={h}>{String(h).padStart(2, "0")}</span>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

export function LegionBreakdown({
    groups,
    total,
    onSelect,
    selected,
}: {
    groups: Array<{ legion: string; count: number }>;
    total: number;
    onSelect: (legion: string) => void;
    selected: string;
}) {
    const max = Math.max(...groups.map((g) => g.count), 1);

    return (
        <div className="border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col h-full">
            <div className="mb-3 font-mono text-xs tracking-[0.18em] text-[var(--muted-foreground)]">
                СЕЙЧАС НА СЕРВЕРЕ ПО ПОДРАЗДЕЛЕНИЯМ · {total}
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
                {groups.map((group) => {
                    const isOwn = group.legion === LEGION_501;
                    const isActive = group.legion === selected;
                    return (
                        <button
                            key={group.legion}
                            onClick={() => onSelect(group.legion)}
                            className={`group/row grid grid-cols-[minmax(110px,150px)_1fr_40px] items-center gap-3 border-l-2 px-2 py-1.5 text-left transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#3D6FC4] ${
                                isActive
                                    ? "border-[#3D6FC4] bg-[#3D6FC4]/10"
                                    : "border-transparent hover:bg-white/[0.03] hover:border-[var(--border)]"
                            }`}
                        >
                            <span
                                className={`font-mono text-xs tracking-[0.08em] truncate ${
                                    isOwn ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                                }`}
                            >
                                {group.legion}
                            </span>
                            <span className="h-2.5 bg-black/40 overflow-hidden">
                                {/* Added transition-all duration-700 ease-out for smooth bar loading */}
                                <span
                                    className="block h-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${(group.count / max) * 100}%`,
                                        background: isOwn ? "#3D6FC4" : "rgba(61,111,196,0.35)",
                                    }}
                                />
                            </span>
                            <span className={`text-right font-mono text-xs ${isActive ? "text-[#3D6FC4]" : "text-[var(--foreground)]"}`}>
                                {group.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

export function OnlineRoster({
    legion,
    players,
    updatedAt,
}: {
    legion: string;
    players: PlayerEntry[];
    updatedAt: Date;
}) {
    return (
        <div className="border border-[var(--border)] bg-[var(--card)] flex flex-col h-full">
            <div className="flex items-baseline justify-between gap-3 flex-wrap border-b border-[var(--border)] px-4 py-3 shrink-0">
                <div className="font-mono text-xs tracking-[0.18em] text-[var(--foreground)]">
                    <span className="text-[#3D6FC4]">{legion}</span> · В СЕТИ {players.length}
                </div>
                <div className="font-mono text-xs text-[var(--muted-foreground)]/60">
                    обновлено {formatFull(updatedAt)}
                </div>
            </div>

            {players.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center font-mono text-sm text-[var(--muted-foreground)]">
                    <div className="mb-2 text-[#3D6FC4]/40">{"//"}</div>
                    Никого нет в сети
                </div>
            ) : (
                <div className="max-h-[320px] overflow-y-auto">
                    <table className="w-full border-collapse font-mono text-sm">
                        {/* Added Sticky Header for better UX when scrolling */}
                        <thead className="sticky top-0 bg-[var(--card)] z-10 text-xs text-[var(--muted-foreground)] tracking-[0.1em] border-b border-[var(--border)] shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                            <tr>
                                <th className="text-left font-normal px-4 py-2 w-24">КН</th>
                                <th className="text-left font-normal px-2 py-2">ПОЗЫВНОЙ</th>
                                <th className="text-right font-normal px-4 py-2">ЗВАНИЕ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => (
                                <tr
                                    key={player.uid ?? `${player.cid}-${player.nick}`}
                                    className="border-b border-[var(--border)]/30 last:border-0 transition-colors hover:bg-white/[0.02]"
                                >
                                    <td className="w-24 px-4 py-2 text-[var(--muted-foreground)]">
                                        {player.cid}
                                    </td>
                                    <td className="px-2 py-2 text-[var(--foreground)]">
                                        {player.nick}
                                    </td>
                                    <td className="px-4 py-2 text-right text-[var(--muted-foreground)]">
                                        {player.rank}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
