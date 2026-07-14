import { useState, useEffect } from "react";
import { CustomMarker, TACTICAL_MAPS, TOOL_CONFIGS } from "./types";
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

    const [activeTool, setActiveTool] = useState<keyof typeof TOOL_CONFIGS>("pan");
    const [pinLabel, setPinLabel] = useState("");

    const activeMap = TACTICAL_MAPS.find((m) => m.id === activeMapId) || TACTICAL_MAPS[0];
    const activeMarkers = markers.filter((m) => m.mapId === activeMapId);

    useEffect(() => {
        localStorage.setItem("501st_tactical_markers", JSON.stringify(markers));
    }, [markers]);
    useEffect(() => {
        localStorage.setItem("501st_active_map", activeMapId);
    }, [activeMapId]);

    const removeMarker = (id: string) => {
        setMarkers((prev) => prev.filter((m) => m.id !== id));
    };
    const clearAllMarkers = () => {
        if (window.confirm("Are you sure you want to wipe all tactical markers on this map?")) {
        setMarkers((prev) => prev.filter((m) => m.mapId !== activeMapId));
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

        activeMarkers.forEach((marker) => {
            const posX = (marker.x / 100) * canvas.width;
            const posY = (marker.y / 100) * canvas.height;
            const config = TOOL_CONFIGS[marker.type];

            ctx.save();
            ctx.shadowBlur = 6;
            ctx.shadowColor = config.color;

            // Circular Core Pin
            ctx.beginPath();
            ctx.arc(posX, posY, 11, 0, 2 * Math.PI);
            ctx.fillStyle = config.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

            // Marker shorthand code
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 8px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(config.markerLabel || "OBJ", posX, posY);

            // Map labels text
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

        {/* LEFT PORTION: ACTIONS + VIEWPORT */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 h-full relative">
            <div className="flex items-center justify-between gap-4 flex-wrap z-10 shrink-0">
            <div className="flex gap-1.5 bg-[#0d1829]/90 p-1 border border-[var(--border)] rounded">
                {TACTICAL_MAPS.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setActiveMapId(m.id)}
                    className={`px-4 py-1.5 font-display text-[0.72rem] tracking-[0.1em] cursor-pointer rounded transition-all duration-150 ${
                    activeMapId === m.id
                        ? "bg-[var(--primary)] text-white"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                >
                    {m.name.toUpperCase()}
                </button>
                ))}
            </div>

            <span className="hidden md:inline font-mono text-[0.62rem] text-[var(--muted-foreground)]/50 tracking-widest uppercase">
                PLANNER MODE · CLICK TO INSTANTLY DROP ACTIVE TOOL
            </span>
            </div>

            {/* Scaled Interactive Map Canvas Container */}
            <MapViewport
                activeMapId={activeMapId}
                activeMarkers={activeMarkers}
                setMarkers={setMarkers}
                activeTool={activeTool}
                pinLabel={pinLabel}
                setPinLabel={setPinLabel}
                removeMarker={removeMarker}
            />
        </div>

        {/* RIGHT SIDEBAR PANEL */}
        <MapSidebar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            pinLabel={pinLabel}
            setPinLabel={setPinLabel}
            activeMarkers={activeMarkers}
            removeMarker={removeMarker}
            clearAllMarkers={clearAllMarkers}
            onExport={exportTacticalMap}
        />
        </div>
    );
}