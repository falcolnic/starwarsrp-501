import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { CustomMarker, BrushStroke, TACTICAL_MAPS, TOOL_CONFIGS, GRID_ROWS } from "./types";

interface MapViewportProps {
    activeMapId: string;
    activeMarkers: CustomMarker[];
    setMarkers: React.Dispatch<React.SetStateAction<CustomMarker[]>>;
    activeStrokes: BrushStroke[];
    addStroke: (stroke: BrushStroke) => void;
    brushColor: string;
    brushWidth: number;
    activeTool: keyof typeof TOOL_CONFIGS;
    pinLabel: string;
    setPinLabel: (label: string) => void;
    removeMarker: (id: string) => void;
}

export function MapViewport({
    activeMapId,
    activeMarkers,
    setMarkers,
    activeStrokes,
    addStroke,
    brushColor,
    brushWidth,
    activeTool,
    pinLabel,
    setPinLabel,
    removeMarker,
    }: MapViewportProps) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
    const isBrushingRef = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const mouseDownTime = useRef(0);
    const mouseDownPos = useRef({ x: 0, y: 0 });

    const activeMap = TACTICAL_MAPS.find((m) => m.id === activeMapId) || TACTICAL_MAPS[0];

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        setZoom((z) => Math.max(1, Math.min(4, z - e.deltaY * 0.001)));
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [handleWheel]);

    useEffect(() => {
        const clampPan = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const S = rect.width;
        const maxPan = Math.max(0, (S * (zoom - 1)) / 2);
        setPan((current) => ({
            x: Math.max(-maxPan, Math.min(maxPan, current.x)),
            y: Math.max(-maxPan, Math.min(maxPan, current.y)),
        }));
        };
        clampPan();
        window.addEventListener("resize", clampPan);
        return () => window.removeEventListener("resize", clampPan);
    }, [zoom, activeMapId]);

    const resetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Переводит координаты события мыши в проценты 0-100 относительно карты
    function getPercentPoint(clientX: number, clientY: number) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return null;
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        if (x < 0 || x > 100 || y < 0 || y > 100) return null;
        return { x, y };
    }

    function finishStroke() {
        if (drawingPoints.length > 1) {
        addStroke({
            id: crypto.randomUUID(),
            mapId: activeMapId,
            color: brushColor,
            width: brushWidth,
            points: drawingPoints,
        });
        }
        setDrawingPoints([]);
        isBrushingRef.current = false;
    }

    const onMouseDown = (e: React.MouseEvent) => {
        if (activeTool === "brush") {
        const point = getPercentPoint(e.clientX, e.clientY);
        if (!point) return;
        isBrushingRef.current = true;
        setDrawingPoints([point]);
        return;
        }

        mouseDownTime.current = Date.now();
        mouseDownPos.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (activeTool === "brush") {
        if (!isBrushingRef.current) return;
        const point = getPercentPoint(e.clientX, e.clientY);
        if (!point) return;
        setDrawingPoints((prev) => [...prev, point]);
        return;
        }

        if (isDragging) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const S = rect.width;
        const maxPan = Math.max(0, (S * (zoom - 1)) / 2);
        const newPanX = e.clientX - dragStart.current.x;
        const newPanY = e.clientY - dragStart.current.y;
        setPan({
            x: Math.max(-maxPan, Math.min(maxPan, newPanX)),
            y: Math.max(-maxPan, Math.min(maxPan, newPanY)),
        });
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        if (activeTool === "brush") {
        finishStroke();
        return;
        }

        setIsDragging(false);
        const clickDuration = Date.now() - mouseDownTime.current;
        const dragDistance = Math.hypot(e.clientX - mouseDownPos.current.x, e.clientY - mouseDownPos.current.y);
        if (clickDuration < 250 && dragDistance < 6) {
        handleMapClick(e);
        }
    };

    const calculateGridSector = (pctX: number, pctY: number): string => {
        const colIdx = Math.min(13, Math.max(0, Math.floor((pctX / 100) * 14)));
        const rowIdx = Math.min(13, Math.max(0, Math.floor((pctY / 100) * 14)));
        return `${GRID_ROWS[rowIdx]}${colIdx + 1}`;
    };

    const handleMapClick = (e: React.MouseEvent) => {
        if (activeTool === "pan" || activeTool === "brush") return;

        const point = getPercentPoint(e.clientX, e.clientY);
        if (!point) return;

        const sector = calculateGridSector(point.x, point.y);
        const newMarker: CustomMarker = {
        id: crypto.randomUUID(),
        mapId: activeMapId,
        x: point.x,
        y: point.y,
        sector,
        type: activeTool as CustomMarker["type"],
        label: pinLabel.trim() || `${TOOL_CONFIGS[activeTool].label} - ${sector}`,
        };

        setMarkers((prev) => [...prev, newMarker]);
        setPinLabel("");
    };

    function pointsToPath(points: { x: number; y: number }[]) {
        return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    }

    return (
        <div className="flex-1 relative border border-[var(--border)] rounded overflow-hidden select-none bg-[#0a0f1d] min-h-0 flex items-center justify-center p-4">
        <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => {
            setIsDragging(false);
            if (isBrushingRef.current) finishStroke();
            }}
            onTouchStart={(e) => {
            const t = e.touches[0];
            if (activeTool === "brush") {
                const point = getPercentPoint(t.clientX, t.clientY);
                if (!point) return;
                isBrushingRef.current = true;
                setDrawingPoints([point]);
                return;
            }
            setIsDragging(true);
            dragStart.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
            }}
            onTouchMove={(e) => {
            const t = e.touches[0];
            if (activeTool === "brush") {
                if (!isBrushingRef.current) return;
                const point = getPercentPoint(t.clientX, t.clientY);
                if (!point) return;
                setDrawingPoints((prev) => [...prev, point]);
                return;
            }
            if (isDragging) {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;
                const S = rect.width;
                const maxPan = Math.max(0, (S * (zoom - 1)) / 2);
                const newPanX = t.clientX - dragStart.current.x;
                const newPanY = t.clientY - dragStart.current.y;
                setPan({
                x: Math.max(-maxPan, Math.min(maxPan, newPanX)),
                y: Math.max(-maxPan, Math.min(maxPan, newPanY)),
                });
            }
            }}
            onTouchEnd={() => {
            if (activeTool === "brush") {
                finishStroke();
                return;
            }
            setIsDragging(false);
            }}
            className="aspect-square relative select-none"
            style={{
            width: "min(700px, 100%, calc(100vh - 180px))",
            height: "min(700px, 100%, calc(100vh - 180px))",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: isDragging ? "grabbing" : activeTool === "brush" ? "crosshair" : activeTool === "pan" ? "grab" : "crosshair",
            }}
        >
            <img
            src={activeMap.imageSrc}
            alt={activeMap.name}
            className="w-full h-full object-fill opacity-85 select-none pointer-events-none"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
            />

            {/* Слой линий — векторный, масштабируется вместе с картой автоматически */}
            <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            >
            {activeStrokes.map((stroke) => (
                <path
                key={stroke.id}
                d={pointsToPath(stroke.points)}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9}
                />
            ))}
            {drawingPoints.length > 1 && (
                <path
                d={pointsToPath(drawingPoints)}
                fill="none"
                stroke={brushColor}
                strokeWidth={brushWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.7}
                />
            )}
            </svg>

            {activeMarkers.map((marker) => {
            const config = TOOL_CONFIGS[marker.type];
            return (
                <div
                key={marker.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                <div
                    className="w-6 h-6 rounded-full border border-white flex items-center justify-center font-mono text-[0.52rem] font-bold text-white shadow-[0_0_8px_rgba(0,0,0,0.8)] cursor-pointer hover:scale-110 transition-transform duration-100"
                    style={{ backgroundColor: config.color }}
                    title={`${marker.label} (${marker.sector})`}
                    onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete tactical marker "${marker.label}"?`)) {
                        removeMarker(marker.id);
                    }
                    }}
                >
                    {(config as any).markerLabel}
                </div>
                </div>
            );
            })}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.25))} className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150">
            <ZoomIn size={16} />
            </button>
            <button onClick={() => setZoom((z) => Math.max(1, z - 0.25))} disabled={zoom <= 1} className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed">
            <ZoomOut size={16} />
            </button>
            <button onClick={resetView} className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150">
            <RotateCcw size={16} />
            </button>
        </div>

        <div className="absolute bottom-3 left-3 bg-[#0d1829]/80 border border-[var(--border)] px-3 py-2 rounded font-mono text-xs text-[var(--muted-foreground)] uppercase tracking-wider select-none pointer-events-none">
            GRID: {activeMap.name} · ZOOM: {Math.round(zoom * 100)}%
        </div>
        </div>
    );
}
