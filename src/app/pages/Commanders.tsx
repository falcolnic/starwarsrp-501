import { useRef } from "react";
import { CommandersRegistry } from "../components/commanders/CommandersRegistry";
import { HelmetScene } from "../components/commanders/HelmetScene";

export function Commanders() {
    const heroRef = useRef<HTMLDivElement>(null);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        heroRef.current.style.setProperty("--px", `${x}`);
        heroRef.current.style.setProperty("--py", `${y}`);
    }

    return (
        <div>
            <section
                ref={heroRef}
                onMouseMove={handleMouseMove}
                className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden bg-[#080d17]"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none opacity-40 animate-fade-in"
                    style={{ 
                        backgroundImage: "linear-gradient(to bottom, #080d17 0%, rgba(8,13,23,0.1) 0%, #080d17 100%), url('/bg-comanders1.png')" 
                    }} 
                />

                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out z-1"
                    style={{
                        transform: "translate(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -14px))",
                    }}
                >
                    <span
                        className="uppercase leading-none select-none text-transparent font-['Oswald'] tracking-[0.06em] text-[clamp(1.7rem,11vw,14rem)]"
                        style={{ WebkitTextStroke: "3px rgba(255, 255, 255, 0.08)" }}
                    >
                        КОМАНДОВАНИЕ
                    </span>
                </div>
                <div
                    className="relative z-10 transition-transform duration-100 ease-out"
                    style={{
                        transform: "translate(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -12px))",
                    }}
                >
                    <HelmetScene />
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 pointer-events-none">
                    <span className="font-['Oswald'] text-lg tracking-[0.15em] text-[var(--muted-foreground)] uppercase">
                        КМД состав 501-го легиона
                    </span>
                </div>
            </section>

            <div className="py-16 bg-[#080d17]">
                <CommandersRegistry />
            </div>
        </div>
    );
}