import { MousePointer, Shield, Sword, Navigation, CheckCircle, Pencil } from "lucide-react";

export interface CustomMarker {
    id: string;
    mapId: string;
    x: number;
    y: number;
    sector: string;
    type: "waypoint" | "attack" | "defend" | "checkpoint";
    label: string;
}

export interface BrushStroke {
    id: string;
    mapId: string;
    color: string;
    width: number;
    points: { x: number; y: number }[];
}
interface TacticalMapConfig {
    id: string;
    name: string;
    description: string;
    imageSrc: string;
    bgColor: string;
}


export const TACTICAL_MAPS: TacticalMapConfig[] = [
    { id: "alderaan", name: "Альдераан", description: "Мирная столичная планета", imageSrc: "/maps/Alderaan.webp", bgColor: "#1a2a3a" },
    { id: "anaxes", name: "База Анаксис", description: "Военный база Республики", imageSrc: "/maps/Anaxes.webp", bgColor: "#111622" },
    { id: "corellia", name: "Кореллиа", description: "Индустриальный мир", imageSrc: "/maps/Corellia.webp", bgColor: "#1a242a" },
    { id: "felucia", name: "Фелуция", description: "Тропические джунгли-споры", imageSrc: "/maps/Felucia.webp", bgColor: "#1a2210" },
    { id: "geonosis-base", name: "Геонозис, База", description: "Промышленная зона дроидов", imageSrc: "/maps/geonosis_base.webp", bgColor: "#2a1a0f" },
    { id: "geonosis-centre", name: "Геонозис, Главный улей", description: "Центральный сектор арены", imageSrc: "/maps/geonosis_centre.webp", bgColor: "#2a1a0f" },
    { id: "geonosis-droids", name: "Геонозис, Завод Дроидов", description: "Фабрика боевых дроидов", imageSrc: "/maps/Geonosis_droids.webp", bgColor: "#2a1a0f" },
    { id: "geonosis-snail", name: "Геонозис, Улитка", description: "Пещерный сектор", imageSrc: "/maps/Geonosis_snail.webp", bgColor: "#2a1a0f" },
    { id: "coruscant", name: "Корусант", description: "Столица Галактической Республики", imageSrc: "/maps/korusant.webp", bgColor: "#141a24" },
    { id: "moraband", name: "Морабанд", description: "Мир ситхов", imageSrc: "/maps/Moraband.webp", bgColor: "#241412" },
    { id: "mygeeto-2", name: "Мигетто (Сектор 2)", description: "Ледяная кристальная равнина", imageSrc: "/maps/Mygeeto_2.webp", bgColor: "#182430" },
    { id: "mygeeto", name: "Мигетто", description: "Ледяная кристальная равнина", imageSrc: "/maps/Myggeto.webp", bgColor: "#182430" },
    { id: "naboo", name: "Набу, Ангар", description: "Ангар Набу", imageSrc: "/maps/Naboo.webp", bgColor: "#122414" },
    { id: "naboo-forest", name: "Набу, Леса", description: "Лесной сектор Набу", imageSrc: "/maps/Naboo_forest.webp", bgColor: "#122414" },
    { id: "rhen-var", name: "Рен Вар", description: "Заснеженные руины", imageSrc: "/maps/Rhen_var.webp", bgColor: "#1c1f26" },
    { id: "rhen-var-mountain", name: "Рен Вар: Горы", description: "Горный ледяной хребет", imageSrc: "/maps/Rhen_var_mountain.webp", bgColor: "#1c1f26" },
    { id: "rishi-moon", name: "Риши", description: "Спутник с укреплённой базой", imageSrc: "/maps/Rishi_moon.webp", bgColor: "#141c22" },
    { id: "ryloth", name: "Рилот", description: "Пустынный мир с базой", imageSrc: "/maps/Ryloth.webp", bgColor: "#2a1a0f" },
    { id: "takodana", name: "Такodana", description: "Лесное озёрное убежище", imageSrc: "/maps/Takodana.webp", bgColor: "#16221a" },
    { id: "tatooine", name: "Татуин, Город", description: "Пустынный город двух солнц", imageSrc: "/maps/Tatooine.webp", bgColor: "#2a2010" },
    { id: "tatooine-desert", name: "Татуин, Ущелье", description: "Открытая песчаная зона", imageSrc: "/maps/Tatooine_desert.webp", bgColor: "#2a2010" },
    { id: "utapau", name: "Утапау", description: "Каньонный мир синкхолов", imageSrc: "/maps/Utapau.webp", bgColor: "#20241c" },
];

export const TOOL_CONFIGS = {
    pan: { label: "Navigation", icon: <MousePointer size={16} />, color: "var(--muted-foreground)" },
    waypoint: { label: "Waypoint", icon: <Navigation size={16} />, color: "#3D6FC4", markerLabel: "WAY" },
    attack: { label: "Attack Target", icon: <Sword size={16} />, color: "#C42B2B", markerLabel: "ATK" },
    defend: { label: "Defend Objective", icon: <Shield size={16} />, color: "#2ECC71", markerLabel: "DEF" },
    checkpoint: { label: "Checkpoint", icon: <CheckCircle size={16} />, color: "#F5C518", markerLabel: "CHK" },
    brush: { label: "Draw Route", icon: <Pencil size={16} />, color: "#E67E22" }, // НОВОЕ
};

export const BRUSH_COLORS = ["#3D6FC4", "#C42B2B", "#2ECC71", "#F5C518", "#E67E22", "#ffffff"];

export const GRID_ROWS = ["N", "M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
