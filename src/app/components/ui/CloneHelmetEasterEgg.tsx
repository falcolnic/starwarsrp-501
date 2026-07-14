import { useState, useEffect, useRef } from "react";

const CLONE_QUOTES = [
    "ЗА РЕСПУБЛИКУ!",
    "ПРОСТО КАК В СИМУЛЯЦИЯХ!",
    "ХОРОШИЕ СОЛДАТЫ СЛЕДУЮТ ЗА РАСПОРЯЖЕНИЯМИ.",
    "501-Й ЭШЛ ГОТОВ, КОМАНДУЙ!",
    "МЫ КЛОНЫ! МЫ БЬЕМСЯ, МЫ ПОБЕЖДАЕМ!",
    "ОПЫТ ПРЕВОСХОДИТ ВСЕ.",
];

export function CloneHelmetEasterEgg() {
    const [position, setPosition] = useState({ x: 10, y: 30 });
    const [quote, setQuote] = useState<string | null>(null);
    const [isEnabled, setIsEnabled] = useState(true);
    const velocity = useRef({ dx: 0.05, dy: 0.03 });

    useEffect(() => {
        const saved = localStorage.getItem("fx_easter_eggs_enabled");
        if (saved !== null) {
        setIsEnabled(saved === "true");
        }

        const handleSettingsChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.type === "easterEggs") {
                setIsEnabled(customEvent.detail.enabled);
            }
        };

        window.addEventListener("hudFxChanged", handleSettingsChange);
        return () => window.removeEventListener("hudFxChanged", handleSettingsChange);
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        let frameId: number;
        const updatePhysics = () => {
        setPosition((prev) => {
            let nextX = prev.x + velocity.current.dx;
            let nextY = prev.y + velocity.current.dy;

            if (nextX <= 2 || nextX >= 85) {
            velocity.current.dx *= -1;
            nextX = Math.max(2, Math.min(85, nextX));
            }
            if (nextY <= 10 || nextY >= 75) {
            velocity.current.dy *= -1;
            nextY = Math.max(10, Math.min(75, nextY));
            }

            return { x: nextX, y: nextY };
        });

        frameId = requestAnimationFrame(updatePhysics);
        };

        frameId = requestAnimationFrame(updatePhysics);
        return () => cancelAnimationFrame(frameId);
    }, [isEnabled]);

    const handleClick = () => {
        const randomQuote = CLONE_QUOTES[Math.floor(Math.random() * CLONE_QUOTES.length)];
        setQuote(randomQuote);
        
        setTimeout(() => {
        setQuote(null);
        }, 3200);
    };

    if (!isEnabled) return null;
    return (
        <>
        <style>{`
            @keyframes holo-drift {
            0%, 90% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1.5deg); }
            }
            .holo-glow {
            filter: drop-shadow(0 0 10px rgba(61, 111, 196, 0.5));
            animation: holo-drift 6s ease-in-out infinite;
            cursor: pointer;
            }
        `}</style>

        <div
            className="fixed z-0 pointer-events-auto transition-transform duration-100 ease-linear select-none"
            style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            }}
        >
            <div className="relative flex flex-col items-center">
            {quote && (
                <div className="absolute bottom-full bg-[#0d1829]/95 border-1 border-[var(--primary)] text-[var(--primary)] text-[8px] font-mono font-bold tracking-widest px-3 py-1 rounded shadow-[0_0_15px_rgba(61,111,196,0.5)] animate-bounce text-center uppercase whitespace-nowrap z-10">
                {quote}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--primary)]" />
                </div>
            )}

            <svg
                onClick={handleClick}
                className="w-20 h-20 opacity-25 hover:opacity-35 transition-opacity duration-300 holo-glow"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Mounting Joint */}
                <path d="M 52 108 L 58 108 L 58 118 L 52 118 Z" fill="#64748B" stroke="#0F172A" strokeWidth="1" />
                {/* Metal Stalk */}
                <line x1="55" y1="110" x2="55" y2="35" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Target Head Unit */}
                <path d="M 40 35 L 70 35 L 70 25 L 45 25 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                <rect x="52" y="27" width="14" height="6" fill="#0F172A" />

                {/* MAIN HELMET SILHOUETTE (White Base) */}
                <path 
                d="M 60 110 
                    C 60 50, 140 50, 140 119
                    C 140 115, 144 159, 110 160
                    C 56 165, 60 135, 60 110 Z" 
                fill="#F8FAFC" 
                stroke="#0F172A" 
                strokeWidth="3.5" 
                />

                {/* Bottom Vocoder (Black mouth piece) */}
                <path d="M 94 175 L 106 175 L 104 185 L 96 185 Z" fill="#0F172A" />
                {/* DOME PAINT MARKINGS (Rex 501st Cross & Eyes) */}
                <path d="M 65 92 C 65 60, 85 55, 96 58 L 96 74 C 85 72, 72 78, 72 92 Z" fill="#1D4ED8" />
                <path d="M 135 92 C 135 60, 115 55, 104 58 L 104 74 C 115 72, 128 78, 128 92 Z" fill="#1D4ED8" />
                
                {/* Forehead Command Chevron (Red symbol) */}
                <path d="M 93 83 L 100 90 L 107 83 L 104 81 L 100 85 L 96 81 Z" fill="#EF4444" />

                {/* Main Visor Shape */}
                <path 
                d="M 68 102 
                    C 68 102, 100 97, 132 102 
                    Q 132 112, 130 114 
                    Q 112 114, 106 122 
                    L 106 150 
                    L 94 150 
                    L 94 122 
                    Q 88 114, 70 114 
                    Q 68 112, 68 102 Z" 
                fill="#0F172A" 
                stroke="#0F172A" 
                strokeWidth="2" 
                />
            </svg>
            </div>
        </div>
        </>
    );
}