import { useMemo, useState } from "react";
import { Activity, AlertTriangle } from "lucide-react";

import {
    useLivePlayers,
    useOnlineHistory,
    useServerStatus,
} from "../../hooks/useServerStats";
import {
    LEGION_501,
    formatDay,
    formatTime,
    groupByLegion,
    hourlyProfile,
    summarize,
    type Interval,
} from "../../services/statsService";
import { OnlineChart } from "../components/stats/OnlineChart";
import {
    HourProfile,
    LegionBreakdown,
    OnlineRoster,
    StatTile,
} from "../components/stats/StatsPanels";

const INTERVALS: Array<{ key: Interval; label: string }> = [
    { key: "day", label: "СУТКИ" },
    { key: "week", label: "НЕДЕЛЯ" },
    { key: "month", label: "МЕСЯЦ" },
];

export function Stats() {
    const [interval, setInterval] = useState<Interval>("week");
    const [legion, setLegion] = useState<string>(LEGION_501);

    const { points, loading, error } = useOnlineHistory(interval);
    const { points: monthPoints } = useOnlineHistory("month");
    const { status } = useServerStatus();
    const { players } = useLivePlayers();

    const stats = useMemo(() => summarize(points), [points]);
    const profile = useMemo(() => hourlyProfile(monthPoints), [monthPoints]);
    const groups = useMemo(() => groupByLegion(players), [players]);

    const selectedGroup = groups.find((g) => g.legion === legion);
    const offline = status?.error === true;

    return (
        <div className="relative flex-1">
        <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
            backgroundImage: "url('/topography.png')",
            backgroundRepeat: "repeat",
            }}
        />

        <div className="relative z-2 mx-auto max-w-7xl px-6 py-10">
            <header className="anim-fade-up mb-7">
            <div className="mb-2 font-mono text-sm tracking-[0.22em] text-[var(--primary)]">
                501-Й Э.Ш.Л // ТЕЛЕМЕТРИЯ СЕРВЕРА
            </div>
            <div className="flex flex-wrap items-center gap-5">
                <h1>СТАТИСТИКА ОНЛАЙНА</h1>
                {status && (
                <div className="flex items-center gap-1.5 font-mono text-sm tracking-[0.1em]">
                    <span
                    className={offline ? "" : "status-dot-active"}
                    style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: offline ? "#E05252" : "#2ECC71",
                        display: "inline-block",
                    }}
                    />
                    <span style={{ color: offline ? "#E05252" : "#2ECC71" }}>
                    {offline
                        ? "СЕРВЕР НЕДОСТУПЕН"
                        : `${status.name.toUpperCase()} · ${status.location} · ${status.players}/${status.max_players}`}
                    </span>
                </div>
                )}
            </div>
            </header>

            {error && (
            <div className="mb-5 flex items-center gap-2 border border-[#E05252]/40 bg-[#E05252]/10 px-4 py-3 font-mono text-sm text-[#E05252]">
                <AlertTriangle size={16} />
                Не удалось получить данные: {error}
            </div>
            )}

            {/* interval switch */}
            <div className="anim-fade-up mb-5 flex flex-wrap items-center gap-2">
            {INTERVALS.map((item) => {
                const isActive = item.key === interval;
                return (
                <button
                    key={item.key}
                    onClick={() => setInterval(item.key)}
                    className={`border px-4 py-2 font-mono text-sm tracking-[0.15em] transition-colors ${
                    isActive
                        ? "border-[#3D6FC4] bg-[#3D6FC4]/15 text-[var(--foreground)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#3D6FC4]/50 hover:text-[var(--foreground)]"
                    }`}
                >
                    {item.label}
                </button>
                );
            })}
            <span className="ml-1 flex items-center gap-1.5 font-mono text-xs text-[var(--muted-foreground)]/60">
                <Activity size={13} />
                {stats.step
                ? `замер каждые ${Math.round(stats.step / 60)} мин`
                : "—"}
            </span>
            </div>

            <div className="anim-fade-up mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 [animation-delay:60ms]">
            <StatTile
                label="СЕЙЧАС"
                value={status?.players ?? stats.current}
                sub={status ? `из ${status.max_players}` : undefined}
                accent
            />
            <StatTile
                label="ПИК"
                value={stats.peak}
                sub={
                stats.peakAt
                    ? `${formatDay(stats.peakAt)} в ${formatTime(stats.peakAt)}`
                    : undefined
                }
            />
            <StatTile
                label="МЕДИАНА"
                value={stats.median.toFixed(0)}
                sub={`среднее ${stats.average.toFixed(1)}`}
            />
            <StatTile
                label="ДИНАМИКА"
                value={
                <span
                    style={{ color: stats.trend >= 0 ? "#2ECC71" : "#E05252" }}
                >
                    {stats.trend >= 0 ? "+" : ""}
                    {stats.trend.toFixed(1)}%
                </span>
                }
                sub="вторая половина к первой"
            />
            </div>

            <div className="anim-fade-up mb-5 [animation-delay:120ms]">
            {loading && points.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center border border-[var(--border)] bg-[var(--card)] font-mono text-sm tracking-[0.1em] text-[var(--muted-foreground)]">
                ЗАГРУЗКА ТЕЛЕМЕТРИИ...
                </div>
            ) : (
                <OnlineChart
                points={points}
                interval={interval}
                reference={{
                    value: stats.median,
                    label: `медиана ${stats.median.toFixed(0)}`,
                }}
                />
            )}
            </div>

            <div className="anim-fade-up mb-5 grid grid-cols-1 gap-3 lg:grid-cols-2 [animation-delay:180ms]">
            <LegionBreakdown
                groups={groups}
                total={players.length}
                selected={legion}
                onSelect={setLegion}
            />
            {profile.some((v) => v > 0) && <HourProfile profile={profile} />}
            </div>

            <div className="anim-fade-up [animation-delay:240ms]">
            <OnlineRoster
                legion={legion}
                players={selectedGroup?.players ?? []}
                updatedAt={new Date()}
            />
            </div>

            <p className="mt-4 font-mono text-xs tracking-[0.1em] text-[var(--muted-foreground)]/25">
            ★ ИСТОЧНИК: NGG.SU · ГРАФИК СТРОИТСЯ ПО 96 ЗАМЕРАМ ЗА ПЕРИОД · ВРЕМЯ МСК
            </p>
        </div>
        </div>
    );
}