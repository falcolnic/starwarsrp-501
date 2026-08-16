import { Trash2, Download, Undo2 } from "lucide-react";
import { CustomMarker, TOOL_CONFIGS, BRUSH_COLORS } from "./types";

interface MapSidebarProps {
    activeTool: keyof typeof TOOL_CONFIGS;
    setActiveTool: (tool: keyof typeof TOOL_CONFIGS) => void;
    pinLabel: string;
    setPinLabel: (label: string) => void;
    activeMarkers: CustomMarker[];
    removeMarker: (id: string) => void;
    clearAllMarkers: () => void;
    brushColor: string;
    setBrushColor: (color: string) => void;
    brushWidth: number;
    setBrushWidth: (width: number) => void;
    strokeCount: number;
    onUndoStroke: () => void;
    onClearStrokes: () => void;
    onExport: () => void;
}

export function MapSidebar({
    activeTool,
    setActiveTool,
    pinLabel,
    setPinLabel,
    activeMarkers,
    removeMarker,
    clearAllMarkers,
    brushColor,
    setBrushColor,
    brushWidth,
    setBrushWidth,
    strokeCount,
    onUndoStroke,
    onClearStrokes,
    onExport,
    }: MapSidebarProps) {
    return (
        <div className="w-full lg:w-80 shrink-0 bg-[#0d1829] border border-[var(--border)] rounded p-4 flex flex-col h-full overflow-hidden">
        <div className="shrink-0 mb-4">
            <h3 className="font-display text-sm tracking-[0.1em] text-[var(--primary)] uppercase mb-2">
            Tactical Tools
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(TOOL_CONFIGS).map(([toolKey, config]) => (
                <button
                key={toolKey}
                onClick={() => {
                    setActiveTool(toolKey as any);
                    if (toolKey === "pan" || toolKey === "brush") setPinLabel("");
                }}
                className={`flex items-center gap-2 p-2.5 rounded text-xs font-mono tracking-wider cursor-pointer border text-left transition-all duration-150 ${
                    activeTool === toolKey
                    ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                    : "bg-[#080d17] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
                }`}
                >
                <span style={{ color: activeTool === toolKey ? "#fff" : config.color }}>{config.icon}</span>
                {config.label.toUpperCase()}
                </button>
            ))}
            </div>
        </div>

        {activeTool !== "pan" && activeTool !== "brush" && (
            <div className="shrink-0 mb-4 bg-[#080d17] p-3 rounded border border-[var(--border)]">
            <label className="block font-mono text-xs tracking-widest text-[var(--muted-foreground)] uppercase mb-1.5">
                Marker Details
            </label>
            <input
                type="text"
                value={pinLabel}
                onChange={(e) => setPinLabel(e.target.value)}
                placeholder="e.g. Squad Command"
                className="w-full bg-[#0d1829] border border-[var(--border)] p-2 text-sm text-white placeholder-white/20 rounded focus:border-[var(--primary)] outline-none"
            />
            </div>
        )}

        {activeTool === "brush" && (
            <div className="shrink-0 mb-4 bg-[#080d17] p-3 rounded border border-[var(--border)] space-y-3">
            <div>
                <label className="block font-mono text-xs tracking-widest text-[var(--muted-foreground)] uppercase mb-2">
                Цвет линии
                </label>
                <div className="flex gap-2">
                {BRUSH_COLORS.map((c) => (
                    <button
                    key={c}
                    onClick={() => setBrushColor(c)}
                    className="w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
                    style={{
                        backgroundColor: c,
                        borderColor: brushColor === c ? "#fff" : "transparent",
                    }}
                    />
                ))}
                </div>
            </div>

            <div>
                <label className="flex justify-between font-mono text-xs tracking-widest text-[var(--muted-foreground)] uppercase mb-2">
                <span>Толщина</span>
                <span className="text-[var(--primary)]">{brushWidth.toFixed(1)}</span>
                </label>
                <input
                type="range"
                min={0.5}
                max={4}
                step={0.5}
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
                />
            </div>

            <div className="flex gap-2">
                <button
                onClick={onUndoStroke}
                disabled={strokeCount === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#0d1829] border border-[var(--border)] hover:border-[var(--primary)] text-xs font-mono text-[var(--muted-foreground)] rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                <Undo2 size={13} /> Отменить
                </button>
                <button
                onClick={onClearStrokes}
                disabled={strokeCount === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[#0d1829] border border-[var(--border)] hover:border-red-500/60 text-xs font-mono text-red-400/70 hover:text-red-400 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                <Trash2 size={13} /> Очистить
                </button>
            </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1 min-h-0 flex flex-col">
            <div className="flex justify-between items-center mb-1.5 shrink-0">
            <h3 className="font-display text-sm tracking-[0.1em] text-[var(--primary)] uppercase">
                Plotted Coordinates
            </h3>
            {activeMarkers.length > 0 && (
                <button onClick={clearAllMarkers} className="text-red-400/70 hover:text-red-400 bg-transparent border-none cursor-pointer flex p-0.5" title="Clear active tactical plans">
                <Trash2 size={16} />
                </button>
            )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 min-h-[120px] max-h-full">
            {activeMarkers.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4 border border-dashed border-[var(--border)] rounded">
                <span className="font-mono text-xs text-[var(--muted-foreground)]/60 tracking-wider">
                    NO PLOTS REGISTERED ON THIS PLAN
                </span>
                </div>
            ) : (
                activeMarkers.map((m) => (
                <div key={m.id} className="flex justify-between items-center bg-[#080d17] p-2.5 rounded border border-[var(--border)] group">
                    <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TOOL_CONFIGS[m.type].color }} />
                        <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-widest font-bold">[{m.sector}]</span>
                    </div>
                    <p className="font-sans font-medium text-sm text-white/90 truncate uppercase mt-0.5">{m.label}</p>
                    </div>
                    <button onClick={() => removeMarker(m.id)} className="opacity-0 group-hover:opacity-100 bg-transparent border-none text-red-400/50 hover:text-red-400 cursor-pointer p-0.5 transition-all duration-150 flex shrink-0 ml-2">
                    <Trash2 size={16} />
                    </button>
                </div>
                ))
            )}
            </div>
        </div>

        <div className="shrink-0 mt-4 border-t border-[var(--border)] pt-4">
            <button
            onClick={onExport}
            disabled={activeMarkers.length === 0 && strokeCount === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 border border-[var(--primary)] rounded font-display text-sm tracking-[0.1em] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
            <Download size={14} />
            EXPORT INTEL (.PNG)
            </button>
        </div>
        </div>
    );
}