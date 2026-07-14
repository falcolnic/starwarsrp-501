import { MousePointer, Shield, Sword, Navigation, CheckCircle } from "lucide-react";

export interface CustomMarker {
    id: string;
    mapId: string;
    x: number; // percentage 0 - 100
    y: number; // percentage 0 - 100
    sector: string; // e.g. "G7"
    type: "waypoint" | "attack" | "defend" | "checkpoint";
    label: string;
}

interface TacticalMapConfig {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    bgColor: string;
}

export const TACTICAL_MAPS: TacticalMapConfig[] = [
    { id: "scifi", name: "Anaxes Outpost", description: "Standard Imperial Hub Grid", imageSrc: "/maps/scifi.png", bgColor: "#111622" },
    { id: "desert", name: "Geonosis Canyon", description: "Arid Ravine Strike Zone", imageSrc: "/maps/Ryloth.webp", bgColor: "#1a120b" },
    { id: "grass", name: "Ryloth Plains", description: "Vegetated River Sector", imageSrc: "/maps/Corellia.webp", bgColor: "#0c140d" }
];

export const TOOL_CONFIGS = {
        pan: { label: "Navigation", icon: <MousePointer size={16} />, color: "var(--muted-foreground)" },
        waypoint: { label: "Waypoint", icon: <Navigation size={16} />, color: "#3D6FC4", markerLabel: "WAY" },
        attack: { label: "Attack Target", icon: <Sword size={16} />, color: "#C42B2B", markerLabel: "ATK" },
        defend: { label: "Defend Objective", icon: <Shield size={16} />, color: "#2ECC71", markerLabel: "DEF" },
        checkpoint: { label: "Checkpoint", icon: <CheckCircle size={16} />, color: "#F5C518", markerLabel: "CHK" }
};

export const GRID_ROWS = ["N", "M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
