import { useState } from "react";

export function R2D2Peeker() {
    const [isBeeping, setIsBeeping] = useState(false);

    return (
        <div 
        onMouseEnter={() => setIsBeeping(true)}
        onMouseLeave={() => setIsBeeping(false)}
        className="absolute right-0 top-12 z-30 select-none cursor-pointer group/r2d2
                    translate-x-[65%] hover:translate-x-[10%] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        >
        <div className="absolute -top-8 left-0 -translate-x-1/4 opacity-0 group-hover/r2d2:opacity-100 
                        transition-opacity duration-300 pointer-events-none font-mono text-[9px] 
                        text-[#3D6FC4] border border-[#3D6FC4]/30 bg-[#080d17]/90 px-2 py-1 uppercase tracking-widest whitespace-nowrap">
            {isBeeping ? "🤖 [ BEEP-BOOP-BOP ]" : "SYS_AUX_DROID"}
        </div>

        <svg 
            width="110" 
            height="100" 
            viewBox="0 0 110 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_10px_rgba(61,111,196,0.15)]"
        >
            <path 
            d="M10 90C10 43.0558 41.3401 5 80 5C118.66 5 150 43.0558 150 90H10Z" 
            fill="#cbd5e1" 
            stroke="#1e293b" 
            strokeWidth="3"
            className="transition-transform duration-500 origin-[80px_90px] group-hover/r2d2:rotate-[6deg]"
            />

            <path 
            d="M12 80H148V90H12V80Z" 
            fill="#3D6FC4" 
            className="transition-transform duration-500 origin-[80px_90px] group-hover/r2d2:rotate-[6deg]"
            />

            {/* Panel Details (Dark Grey & Blue Panels) */}
            <g className="transition-transform duration-500 origin-[80px_90px] group-hover/r2d2:rotate-[6deg]">
            {/* Top Blue Panel */}
            <path d="M72 15H88V28H72V15Z" fill="#3D6FC4" />
            {/* Left Panel */}
            <path d="M30 45H48V60H30V45Z" fill="#475569" />
            {/* Right Panel */}
            <path d="M112 45H130V60H112V45Z" fill="#3D6FC4" />
            </g>

            {/* Primary Lens (Eye) */}
            <g className="transition-transform duration-500 origin-[80px_90px] group-hover/r2d2:rotate-[6deg]">
            {/* Black Housing */}
            <circle cx="80" cy="48" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
            {/* Inner Lens */}
            <circle cx="80" cy="48" r="8" fill="#1e293b" />
            {/* Red Processor Glow (Always pulsing, flashes faster on hover) */}
            <circle 
                cx="80" 
                cy="48" 
                r="4" 
                fill="#ef4444" 
                className={`animate-pulse ${isBeeping ? "duration-100" : "duration-1000"}`} 
            />
            </g>

            {/* Auxiliary Holoprojector */}
            <g className="transition-transform duration-500 origin-[80px_90px] group-hover/r2d2:rotate-[6deg]">
            <circle cx="48" cy="30" r="6" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="48" cy="30" r="3" fill="#0f172a" />
            </g>
        </svg>
        </div>
    );
}