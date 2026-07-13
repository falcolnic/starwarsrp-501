import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
import mapData from "../../data/map.json";

interface MarkerData {
  id: string;
  mapId: string;
  x: number;
  y: number;
  type: string;
  title: string;
  description: string;
}

const MARKER_COLORS: Record<string, string> = {
  command: "#3D6FC4", supply: "#2ECC71", extraction: "#F5C518",
  hostile: "#C42B2B", training: "#8B5CF6", barracks: "#3D6FC4",
};
const MARKER_LABELS: Record<string, string> = {
  command: "CMD", supply: "SUP", extraction: "EXT",
  hostile: "HOT", training: "TRN", barracks: "BRK",
};

function getBarcodeWidths(value: string): number[] {
  return Array.from({ length: 32 }, (_, i) => {
    const code = value.charCodeAt(i % value.length);
    return ((code * 7 + i * 13) % 5 === 0) ? 3 : ((code + i) % 3 === 0) ? 2 : 1;
  });
}

export function MapViewer() {
  const [activeMapId, setActiveMapId] = useState(mapData.maps[0].id);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMap = mapData.maps.find(m => m.id === activeMapId)!;
  const markers = (mapData.markers as MarkerData[]).filter(m => m.mapId === activeMapId);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.4, Math.min(4, z - e.deltaY * 0.001)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".map-marker")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setActiveMarker(null);
  };
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onMouseUp = () => setIsDragging(false);
  const onTouchStart = (e: React.TouchEvent) => { const t = e.touches[0]; setIsDragging(true); setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y }); };
  const onTouchMove = (e: React.TouchEvent) => { if (isDragging) { const t = e.touches[0]; setPan({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }); } };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); setActiveMarker(null); };
  const switchMap = (id: string) => { setActiveMapId(id); resetView(); };

  const markerColor = (type: string) => MARKER_COLORS[type] ?? "#8FA3C0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {mapData.maps.map(m => (
          <button key={m.id} onClick={() => switchMap(m.id)} style={{
            padding: "5px 14px", fontFamily: "var(--font-display)", fontSize: "0.72rem", letterSpacing: "0.08em",
            background: activeMapId === m.id ? "var(--primary)" : "var(--secondary)",
            color: "var(--foreground)",
            border: `1px solid ${activeMapId === m.id ? "var(--primary)" : "var(--border)"}`,
            cursor: "pointer", transition: "all 0.15s",
          }}>{m.name}</button>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <div ref={containerRef}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}
          style={{
            width: "100%", height: 380, overflow: "hidden",
            background: activeMap.bgColor, border: "1px solid var(--border)",
            cursor: isDragging ? "grabbing" : "grab", position: "relative", userSelect: "none",
          }}>
          <div style={{
            position: "absolute", inset: 0,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center", width: "100%", height: "100%",
          }}>
            <MapGrid name={activeMap.name} description={activeMap.description} />
            {markers.map(marker => (
              <button key={marker.id} className="map-marker"
                onClick={e => { e.stopPropagation(); setActiveMarker(activeMarker?.id === marker.id ? null : marker); }}
                style={{
                  position: "absolute", left: `${marker.x}%`, top: `${marker.y}%`,
                  transform: "translate(-50%, -100%)", background: "none", border: "none",
                  cursor: "pointer", padding: 0, zIndex: 10,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}>
                <div style={{
                  background: markerColor(marker.type),
                  border: `2px solid ${activeMarker?.id === marker.id ? "#fff" : "rgba(255,255,255,0.4)"}`,
                  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.55rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#fff",
                  boxShadow: `0 0 8px ${markerColor(marker.type)}88`,
                  transform: activeMarker?.id === marker.id ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.1s",
                }}>
                  {MARKER_LABELS[marker.type] ?? "OBJ"}
                </div>
                <div style={{ width: 2, height: 10, background: markerColor(marker.type), opacity: 0.8 }} />
              </button>
            ))}
          </div>

          {activeMarker && (
            <div style={{
              position: "absolute", bottom: 10, left: 10, right: 10,
              background: "rgba(13,24,41,0.97)",
              border: `1px solid ${markerColor(activeMarker.type)}`,
              padding: "12px 14px", zIndex: 20,
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.06em", color: markerColor(activeMarker.type), marginBottom: 4 }}>
                    [{MARKER_LABELS[activeMarker.type] ?? "OBJ"}] {activeMarker.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                    {activeMarker.description}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(143,163,192,0.45)", marginTop: 5, letterSpacing: "0.1em" }}>
                    COORDS: {String(activeMarker.x).padStart(3,"0")}-{String(activeMarker.y).padStart(3,"0")} · {activeMap.name.toUpperCase()}
                  </div>
                </div>
                <button onClick={() => setActiveMarker(null)} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer", flexShrink: 0, padding: 2, display: "flex" }}>
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "column", gap: 2, zIndex: 15 }}>
          {[
            { icon: <ZoomIn size={14} />, action: () => setZoom(z => Math.min(4, z + 0.25)) },
            { icon: <ZoomOut size={14} />, action: () => setZoom(z => Math.max(0.4, z - 0.25)) },
            { icon: <RotateCcw size={14} />, action: resetView },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} style={{
              width: 28, height: 28, background: "rgba(13,24,41,0.9)", border: "1px solid var(--border)",
              color: "var(--muted-foreground)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
              {btn.icon}
            </button>
          ))}
        </div>

        <div style={{ position: "absolute", top: 8, left: 8, fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted-foreground)", background: "rgba(13,24,41,0.8)", padding: "3px 8px", border: "1px solid var(--border)", letterSpacing: "0.1em" }}>
          ZOOM {Math.round(zoom * 100)}%
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Object.entries(MARKER_LABELS).map(([type, label]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 12, height: 12, background: MARKER_COLORS[type], border: "1px solid rgba(255,255,255,0.15)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--muted-foreground)", letterSpacing: "0.06em" }}>
              {label}
            </span>
          </div>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(143,163,192,0.4)", letterSpacing: "0.08em" }}>
          DRAG · SCROLL to zoom · CLICK marker
        </span>
      </div>
    </div>
  );
}

function MapGrid({ name, description }: { name: string; description: string }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
        <defs>
          <pattern id="grid-sm" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3D6FC4" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-lg" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#3D6FC4" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-sm)" />
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
      </svg>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#3D6FC4" strokeWidth="1" strokeDasharray="4,8" />
        <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#3D6FC4" strokeWidth="1" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#3D6FC4" strokeWidth="0.5" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3D6FC4" strokeWidth="0.5" />
      </svg>
      <div style={{ position: "absolute", bottom: 12, right: 12, fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "rgba(61,111,196,0.35)", letterSpacing: "0.1em", textAlign: "right", lineHeight: 1.6 }}>
        <div style={{ opacity: 0.8 }}>{name.toUpperCase()}</div>
        <div>{description?.toUpperCase()}</div>
        <div style={{ opacity: 0.5 }}>AWAITING MAP ASSET</div>
      </div>
    </div>
  );
}
