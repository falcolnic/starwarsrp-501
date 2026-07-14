import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { CustomMarker, TACTICAL_MAPS, TOOL_CONFIGS, GRID_ROWS } from "./types";

interface MapViewportProps {
    activeMapId: string;
    activeMarkers: CustomMarker[];
    setMarkers: React.Dispatch<React.SetStateAction<CustomMarker[]>>;
    activeTool: keyof typeof TOOL_CONFIGS;
    pinLabel: string;
    setPinLabel: (label: string) => void;
    removeMarker: (id: string) => void;
}

export function MapViewport({
    activeMapId,
    activeMarkers,
    setMarkers,
    activeTool,
    pinLabel,
    setPinLabel,
    removeMarker,
    }: MapViewportProps) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const mouseDownTime = useRef(0);
    const mouseDownPos = useRef({ x: 0, y: 0 });

    const activeMap = TACTICAL_MAPS.find((m) => m.id === activeMapId) || TACTICAL_MAPS[0];

    // Restricts Zoom-out past 1.0 (100% full view)
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

    // Snaps and clamps pan offsets when zooming out or resizing window
    useEffect(() => {
        const clampPan = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const S = rect.width; // Width and height are identical since container is a perfect square
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

    // Drag listeners
    const onMouseDown = (e: React.MouseEvent) => {
        mouseDownTime.current = Date.now();
        mouseDownPos.current = { x: e.clientX, y: e.clientY };

        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };

    const onMouseMove = (e: React.MouseEvent) => {
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
        setIsDragging(false);

        const clickDuration = Date.now() - mouseDownTime.current;
        const dragDistance = Math.hypot(
        e.clientX - mouseDownPos.current.x,
        e.clientY - mouseDownPos.current.y
        );

        if (clickDuration < 250 && dragDistance < 6) {
        handleMapClick(e);
        }
    };

    const calculateGridSector = (pctX: number, pctY: number): string => {
        const colIdx = Math.min(13, Math.max(0, Math.floor((pctX / 100) * 14)));
        const rowIdx = Math.min(13, Math.max(0, Math.floor((pctY / 100) * 14)));
        return `${GRID_ROWS[rowIdx]}${colIdx + 1}`;
    };

    // Mathematically perfect point positioning relative to the map canvas bounding box
    const handleMapClick = (e: React.MouseEvent) => {
        if (activeTool === "pan") return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Browser bounding box coordinates already include scaling and panning shifts
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const pctX = (clickX / rect.width) * 100;
        const pctY = (clickY / rect.height) * 100;

        if (pctX < 0 || pctX > 100 || pctY < 0 || pctY > 100) return;

        const sector = calculateGridSector(pctX, pctY);

        const newMarker: CustomMarker = {
        id: crypto.randomUUID(),
        mapId: activeMapId,
        x: pctX,
        y: pctY,
        sector,
        type: activeTool as CustomMarker["type"],
        label: pinLabel.trim() || `${TOOL_CONFIGS[activeTool].label} - ${sector}`,
        };

        setMarkers((prev) => [...prev, newMarker]);
        setPinLabel("");
    };

    return (
        <div className="flex-1 relative border border-[var(--border)] rounded overflow-hidden select-none bg-[#0a0f1d] min-h-0 flex items-center justify-center p-4">
        <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
            const t = e.touches[0];
            setIsDragging(true);
            dragStart.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
            }}
            onTouchMove={(e) => {
            if (isDragging) {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                const S = rect.width;
                const maxPan = Math.max(0, (S * (zoom - 1)) / 2);

                const t = e.touches[0];
                const newPanX = t.clientX - dragStart.current.x;
                const newPanY = t.clientY - dragStart.current.y;

                setPan({
                x: Math.max(-maxPan, Math.min(maxPan, newPanX)),
                y: Math.max(-maxPan, Math.min(maxPan, newPanY)),
                });
            }
            }}
            onTouchEnd={() => setIsDragging(false)}
            // Aspect-square scaling bounds
            className="aspect-square relative select-none"
            style={{
            width: "min(700px, 100%, calc(100vh - 180px))",
            height: "min(700px, 100%, calc(100vh - 180px))",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            cursor: isDragging ? "grabbing" : activeTool === "pan" ? "grab" : "crosshair",
            }}
        >
            {/* Base map */}
            <img
            src={activeMap.imageSrc}
            alt={activeMap.name}
            className="w-full h-full object-fill opacity-85 select-none pointer-events-none"
            style={{ imageRendering: "pixelated" }} 
            draggable={false}
            />

            {/* Tactical interactive pins */}
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
                    {config.markerLabel}
                </div>
                </div>
            );
            })}
        </div>

        {/* Floating Zoom overlay controllers */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
            <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
            className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150"
            >
            <ZoomIn size={16} />
            </button>
            <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            disabled={zoom <= 1}
            className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            >
            <ZoomOut size={16} />
            </button>
            <button
            onClick={resetView}
            className="w-8 h-8 bg-[#0d1829]/95 border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors duration-150"
            >
            <RotateCcw size={16} />
            </button>
        </div>

        {/* Details HUD panel */}
        <div className="absolute bottom-3 left-3 bg-[#0d1829]/80 border border-[var(--border)] px-3 py-1.5 rounded font-mono text-[0.62rem] text-[var(--muted-foreground)] uppercase tracking-wider select-none pointer-events-none">
            GRID: {activeMap.name} · ZOOM: {Math.round(zoom * 100)}%
        </div>
        </div>
    );
}