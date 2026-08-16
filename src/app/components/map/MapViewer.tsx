import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { CustomMarker, BrushStroke, TACTICAL_MAPS, TOOL_CONFIGS } from "./types";
import { MapViewport } from "./MapViewport";
import { MapSidebar } from "./MapSidebar";

export function MapViewer() {
    const [activeMapId, setActiveMapId] = useState<string>(() => {
        return localStorage.getItem("501st_active_map") || TACTICAL_MAPS[0].id;
    });
    const [markers, setMarkers] = useState<CustomMarker[]>(() => {
        const saved = localStorage.getItem("501st_tactical_markers");
        return saved ? JSON.parse(saved) : [];
    });
    const [strokes, setStrokes] = useState<BrushStroke[]>(() => {
        const saved = localStorage.getItem("501st_tactical_strokes");
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTool, setActiveTool] = useState<keyof typeof TOOL_CONFIGS>("pan");
    const [pinLabel, setPinLabel] = useState("");
    const [brushColor, setBrushColor] = useState("#3D6FC4");
    const [brushWidth, setBrushWidth] = useState(1.5);

    const [mapPickerOpen, setMapPickerOpen] = useState(false);
    const [mapSearch, setMapSearch] = useState("");
    const pickerRef = useRef<HTMLDivElement>(null);

    const activeMap = TACTICAL_MAPS.find((m) => m.id === activeMapId) || TACTICAL_MAPS[0];
    const activeMarkers = markers.filter((m) => m.mapId === activeMapId);
    const activeStrokes = strokes.filter((s) => s.mapId === activeMapId);

    const filteredMaps = TACTICAL_MAPS.filter(
        (m) =>
        m.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
        m.description.toLowerCase().includes(mapSearch.toLowerCase())
    );

    useEffect(() => {
        localStorage.setItem("501st_tactical_markers", JSON.stringify(markers));
    }, [markers]);
    useEffect(() => {
        localStorage.setItem("501st_tactical_strokes", JSON.stringify(strokes));
    }, [strokes]);
    useEffect(() => {
        localStorage.setItem("501st_active_map", activeMapId);
    }, [activeMapId]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
        if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
            setMapPickerOpen(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const removeMarker = (id: string) => {
        setMarkers((prev) => prev.filter((m) => m.id !== id));
    };
    const clearAllMarkers = () => {
        if (window.confirm("Удалить все метки на этой карте?")) {
        setMarkers((prev) => prev.filter((m) => m.mapId !== activeMapId));
        }
    };

    const addStroke = (stroke: BrushStroke) => {
        setStrokes((prev) => [...prev, stroke]);
    };
    const undoLastStroke = () => {
        setStrokes((prev) => {
        const lastIndex = [...prev].reverse().findIndex((s) => s.mapId === activeMapId);
        if (lastIndex === -1) return prev;
        const realIndex = prev.length - 1 - lastIndex;
        return prev.filter((_, i) => i !== realIndex);
        });
    };
    const clearAllStrokes = () => {
        if (window.confirm("Удалить все линии на этой карте?")) {
        setStrokes((prev) => prev.filter((s) => s.mapId !== activeMapId));
        }
    };

    const exportTacticalMap = () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = activeMap.imageSrc;
        img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Сначала линии — они "под" маркерами по смыслу (маршрут ниже точек интереса)
        activeStrokes.forEach((stroke) => {
            if (stroke.points.length < 2) return;
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = (stroke.width / 100) * canvas.width;
            ctx.shadowBlur = 4;
            ctx.shadowColor = stroke.color;
            ctx.beginPath();
            stroke.points.forEach((p, i) => {
            const px = (p.x / 100) * canvas.width;
            const py = (p.y / 100) * canvas.height;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.restore();
        });

        activeMarkers.forEach((marker) => {
            const posX = (marker.x / 100) * canvas.width;
            const posY = (marker.y / 100) * canvas.height;
            const config = TOOL_CONFIGS[marker.type];

            ctx.save();
            ctx.shadowBlur = 6;
            ctx.shadowColor = config.color;

            ctx.beginPath();
            ctx.arc(posX, posY, 11, 0, 2 * Math.PI);
            ctx.fillStyle = config.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText((config as any).markerLabel || "OBJ", posX, posY);

            ctx.font = "bold 11px sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "#000000";
            ctx.shadowBlur = 4;
            ctx.fillText(marker.label.toUpperCase(), posX, posY + 24);

            ctx.restore();
        });

        const downloadLink = document.createElement("a");
        downloadLink.download = `501st-tactical-${activeMap.id}.png`;
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
        };
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)] w-full text-white bg-[#080d17]">
        <div className="flex-1 flex flex-col gap-3 min-w-0 h-full relative">
            <div className="flex items-center justify-between gap-4 flex-wrap z-10 pt-3 shrink-0">
            <div ref={pickerRef} className="relative w-full sm:w-80">
                <button
                onClick={() => setMapPickerOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-[#0d1829]/90 border border-[var(--border)] rounded text-white cursor-pointer hover:border-[var(--primary)] transition-colors duration-150"
                >
                <div className="flex items-center gap-2.5 min-w-0">
                    <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: activeMap.bgColor, border: "1px solid rgba(255,255,255,0.3)" }}
                    />
                    <span className="font-display text-sm tracking-[0.08em] truncate">{activeMap.name.toUpperCase()}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-[var(--muted-foreground)] transition-transform duration-200 shrink-0 ${
                    mapPickerOpen ? "rotate-180" : ""
                    }`}
                />
                </button>

                {mapPickerOpen && (
                <div className="absolute top-[105%] left-0 right-0 bg-[#0d1829] border border-[var(--border)] rounded shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="p-2 border-b border-[var(--border)]">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" />
                        <input
                        autoFocus
                        type="text"
                        placeholder="Поиск карты..."
                        value={mapSearch}
                        onChange={(e) => setMapSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#080d17] border border-[var(--border)] rounded text-sm text-white outline-none focus:border-[var(--primary)]"
                        />
                    </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                    {filteredMaps.length === 0 ? (
                        <div className="px-4 py-6 text-center font-mono text-sm text-[var(--muted-foreground)]">
                        Ничего не найдено
                        </div>
                    ) : (
                        filteredMaps.map((m) => {
                        const isActive = m.id === activeMapId;
                        return (
                            <button
                            key={m.id}
                            onClick={() => {
                                setActiveMapId(m.id);
                                setMapPickerOpen(false);
                                setMapSearch("");
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-b border-[var(--border)]/20 last:border-0 cursor-pointer transition-colors duration-150 ${
                                isActive ? "bg-[var(--primary)]/15" : "hover:bg-[#121f35]"
                            }`}
                            >
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: m.bgColor, border: "1px solid rgba(255,255,255,0.3)" }}
                            />
                            <div className="min-w-0">
                                <div className="font-display text-sm tracking-[0.05em] text-white truncate">{m.name}</div>
                                <div className="font-mono text-xs text-[var(--muted-foreground)] truncate">{m.description}</div>
                            </div>
                            </button>
                        );
                        })
                    )}
                    </div>
                </div>
                )}
            </div>

            <span className="hidden md:inline font-mono text-xs text-[var(--muted-foreground)]/60 tracking-widest uppercase">
                PLANNER MODE · CLICK TO INSTANTLY DROP ACTIVE TOOL
            </span>
            </div>

            <MapViewport
            activeMapId={activeMapId}
            activeMarkers={activeMarkers}
            setMarkers={setMarkers}
            activeStrokes={activeStrokes}
            addStroke={addStroke}
            brushColor={brushColor}
            brushWidth={brushWidth}
            activeTool={activeTool}
            pinLabel={pinLabel}
            setPinLabel={setPinLabel}
            removeMarker={removeMarker}
            />
        </div>

        <MapSidebar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            pinLabel={pinLabel}
            setPinLabel={setPinLabel}
            activeMarkers={activeMarkers}
            removeMarker={removeMarker}
            clearAllMarkers={clearAllMarkers}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushWidth={brushWidth}
            setBrushWidth={setBrushWidth}
            strokeCount={activeStrokes.length}
            onUndoStroke={undoLastStroke}
            onClearStrokes={clearAllStrokes}
            onExport={exportTacticalMap}
        />
        </div>
    );
}