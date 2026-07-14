import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";

export function HUDSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [warpEnabled, setWarpEnabled] = useState(true);
    const [easterEggsEnabled, setEasterEggsEnabled] = useState(true);

    useEffect(() => {
        const savedWarp = localStorage.getItem("fx_warp_enabled");
        const savedEaster = localStorage.getItem("fx_easter_eggs_enabled");

        if (savedWarp !== null) setWarpEnabled(savedWarp === "true");
        if (savedEaster !== null) setEasterEggsEnabled(savedEaster === "true");
    }, []);

    const toggleWarp = () => {
        const nextState = !warpEnabled;
        setWarpEnabled(nextState);
        localStorage.setItem("fx_warp_enabled", String(nextState));
        window.dispatchEvent(new CustomEvent("hudFxChanged", { detail: { type: "warp", enabled: nextState } }));
    };

    const toggleEasterEggs = () => {
        const nextState = !easterEggsEnabled;
        setEasterEggsEnabled(nextState);
        localStorage.setItem("fx_easter_eggs_enabled", String(nextState));
        window.dispatchEvent(new CustomEvent("hudFxChanged", { detail: { type: "easterEggs", enabled: nextState } }));
    };

    return (
        <div 
        className="fixed top-[86px] left-6 z-[10] flex flex-col items-start"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        >
        {/* Trigger button */}
        <button
            className={`p-2 bg-[#0c1424]/90 border rounded transition-all duration-300 cursor-pointer ${
            isOpen 
                ? "border-[var(--primary)] text-[var(--primary)] shadow-[0_0_10px_rgba(61,111,196,0.3)]" 
                : "border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
        >
            <Settings size={16} className={isOpen ? "animate-spin [animation-duration:8s]" : ""} />
        </button>

        <div 
            className={`mt-2 bg-[#0c1424]/95 border border-slate-800 rounded p-3 w-56 space-y-3 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] font-mono ${
            isOpen 
                ? "opacity-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
            <div className="text-[10px] text-[var(--primary)] tracking-widest border-b border-slate-800 pb-1.5 uppercase font-bold">
            НАСТРОЙКИ ИНТЕРФЕЙСА
            </div>

            {/* Easter Eggs */}
            <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">Пасхалки</span>
            <button 
                onClick={toggleEasterEggs}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] transition-colors cursor-pointer ${
                easterEggsEnabled 
                    ? "bg-[var(--primary)]/10 border-[var(--primary)]/50 text-[var(--primary)]" 
                    : "bg-slate-900/50 border-slate-800 text-slate-500"
                }`}
            >
                {easterEggsEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{easterEggsEnabled ? "ВКЛ" : "ВЫКЛ"}</span>
            </button>
            </div>
        </div>
        </div>
    );
}