import { useMemo, useState } from "react";
import {
    axisLabels,
    formatFull,
    type Interval,
    type OnlinePoint,
} from "../../../services/statsService";

const W = 1000;
const H = 320;
const PAD = { top: 20, right: 16, bottom: 34, left: 44 };

interface Props {
    points: OnlinePoint[];
    interval: Interval;
    reference?: { value: number; label: string };
}

function niceMax(value: number): number {
    if (value <= 10) return 10;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
}

/** Catmull-Rom → cubic bezier, clamped so the curve never dips below zero. */
function smoothPath(pts: Array<{ x: number; y: number }>, floor: number) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = Math.min(floor, p1.y + (p2.y - p0.y) / 6);
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = Math.min(floor, p2.y - (p3.y - p1.y) / 6);

        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

export function OnlineChart({ points, interval, reference }: Props) {
    const [hover, setHover] = useState<number | null>(null);

    const chart = useMemo(() => {
        if (points.length === 0) return null;

        const plotW = W - PAD.left - PAD.right;
        const plotH = H - PAD.top - PAD.bottom;
        const top = niceMax(Math.max(...points.map((p) => p.value)));
        const baseline = PAD.top + plotH;

        const x = (i: number) =>
        PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
        const y = (v: number) => PAD.top + plotH - (v / top) * plotH;

        const coords = points.map((p, i) => ({ x: x(i), y: y(p.value) }));
        const line = smoothPath(coords, baseline);

        return {
        coords,
        line,
        area: `${line} L ${coords[coords.length - 1].x} ${baseline} L ${coords[0].x} ${baseline} Z`,
        baseline,
        top,
        y,
        ticks: [0, 0.25, 0.5, 0.75, 1].map((f) => ({
            value: Math.round(top * f),
            y: y(top * f),
        })),
        labels: axisLabels(points, interval),
        };
    }, [points, interval]);

    if (!chart) {
        return (
        <div className="h-[260px] flex items-center justify-center border border-[var(--border)] bg-[var(--card)] font-mono text-sm tracking-[0.1em] text-[var(--muted-foreground)]">
            НЕТ ДАННЫХ
        </div>
        );
    }

    const active = hover !== null ? points[hover] : null;
    const activeX = hover !== null ? chart.coords[hover].x : 0;

    const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * W;
        const plotW = W - PAD.left - PAD.right;
        const ratio = (px - PAD.left) / plotW;
        const i = Math.round(ratio * (points.length - 1));
        setHover(Math.max(0, Math.min(points.length - 1, i)));
    };

    return (
        <div className="relative border border-[var(--border)] bg-[var(--card)]">
        {/* corner brackets, same language as the rest of the site */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#3D6FC4]" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#3D6FC4]" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#3D6FC4]" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#3D6FC4]" />

        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto block touch-none"
            onPointerMove={handleMove}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label="График онлайна сервера"
        >
            <defs>
            <linearGradient id="onlineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3D6FC4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3D6FC4" stopOpacity="0.02" />
            </linearGradient>
            </defs>

            {chart.ticks.map((tick) => (
            <g key={tick.value}>
                <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={tick.y}
                y2={tick.y}
                stroke="rgba(61,111,196,0.14)"
                strokeDasharray="3 6"
                />
                <text
                x={PAD.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-[var(--muted-foreground)]"
                style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
                >
                {tick.value}
                </text>
            </g>
            ))}

            {reference && (
            <g>
                <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={chart.y(reference.value)}
                y2={chart.y(reference.value)}
                stroke="#E8B84B"
                strokeOpacity="0.55"
                strokeDasharray="8 5"
                />
                <text
                x={W - PAD.right}
                y={chart.y(reference.value) - 7}
                textAnchor="end"
                fill="#E8B84B"
                fillOpacity="0.8"
                style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
                >
                {reference.label}
                </text>
            </g>
            )}

            <path d={chart.area} fill="url(#onlineFill)" />
            <path
            d={chart.line}
            fill="none"
            stroke="#3D6FC4"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(61,111,196,0.55))" }}
            />

            {chart.labels.map((label, i) =>
            label ? (
                <text
                key={i}
                x={chart.coords[i].x}
                y={H - 12}
                textAnchor="middle"
                className="fill-[var(--muted-foreground)]"
                style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
                >
                {label}
                </text>
            ) : null,
            )}

            {active && (
            <g>
                <line
                x1={activeX}
                x2={activeX}
                y1={PAD.top}
                y2={chart.baseline}
                stroke="#3D6FC4"
                strokeOpacity="0.45"
                />
                <circle
                cx={activeX}
                cy={chart.y(active.value)}
                r="5"
                fill="#080d17"
                stroke="#3D6FC4"
                strokeWidth="2.5"
                />
            </g>
            )}
        </svg>

        {active && (
            <div
            className="pointer-events-none absolute top-3 -translate-x-1/2 border border-[#3D6FC4]/50 bg-[#080d17]/95 px-2.5 py-1.5 font-mono text-xs whitespace-nowrap"
            style={{
                left: `${Math.min(88, Math.max(12, (activeX / W) * 100))}%`,
            }}
            >
            <div className="text-[var(--muted-foreground)]">
                {formatFull(active.date)}
            </div>
            <div className="text-[var(--foreground)] text-sm">
                {active.value} игроков
            </div>
            </div>
        )}
        </div>
    );
}
