import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, Home, Users, TrendingUp, ShieldAlert, Map } from "lucide-react";
import { Logo } from "../ui/Logo";
import { navLinks } from "./navLinks";
import { MobileMenu } from "./MobileMenu";

const getNavIcon = (to: string) => {
    if (to === "/") return <Home size={24} />;
    if (to === "/roster") return <Users size={24} />;
    if (to === "/promotion") return <TrendingUp size={24} />;
    if (to === "/blacklist") return <ShieldAlert size={24} />;
    return <Map size={24} />;
};

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredTo, setHoveredTo] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <nav
        className="sticky top-0 z-15 border-b border-slate-800/80 shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
        style={{
            background: "linear-gradient(180deg, #080d17 0%, #0d1829 100%)",
        }}
        >
        <div className="max-w-full mx-auto px-8">
            <div className="flex items-center justify-between h-[70px]">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
            >
                <Logo className="w-14 h-14" imgSize={76} divSize={76} />
                <div className="text-left">
                    <div className="text-2xl font-bold leading-none tracking-[0.12em] text-[var(--foreground)] font-[family:var(--font-display)]">
                        501ST ELITE ASSAULT LEGION
                    </div>
                    <div className="text-sm tracking-[0.15em] mt-2 text-[var(--muted-foreground)] font-[family:var(--font-mono)]">
                        Великая · Армия · Республики
                    </div>
                </div>
            </button>

            <div className="hidden md:flex items-center gap-3 h-full">
                {navLinks.map((link) => {
                const icon = getNavIcon(link.to);

                return (
                    <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onMouseEnter={() => setHoveredTo(link.to)}
                    onMouseLeave={() => setHoveredTo(null)}
                    className={({ isActive }) => {
                                const isExpanded = hoveredTo === link.to || (hoveredTo === null && isActive);
                                return `group/nav relative h-11 flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] no-underline rounded-none border-b-0
                                ${isExpanded ? "w-56 bg-slate-800/30" : "w-14 bg-transparent "} 
                                ${isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`;
                            }}
                            >
                            {({ isActive }) => {
                                const isExpanded = hoveredTo === link.to || (hoveredTo === null && isActive);

                                return (
                                <>
                                    <div 
                                    className={`absolute left-0 top-2 bottom-2 w-[2px] transition-all duration-300
                                        ${isActive ? "bg-[#3D6FC4]" : "bg-transparent"}`} 
                                    />
                                    
                                    <div className="flex items-center w-56 shrink-0 px-4">
                                    <span className={`shrink-0 transition-colors duration-200
                                        ${isActive ? "text-[#3D6FC4]" : "text-slate-500 group-hover/nav:text-slate-300"}`}
                                    >
                                        {icon}
                                    </span>

                                    <span 
                                        className={`ml-3.5 text-base font-bold uppercase tracking-[0.15em] transition-all duration-200
                                            ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3 pointer-events-none"}
                                            ${isActive ? "text-white" : "text-slate-400 group-hover/nav:text-slate-200"}`}
                                    >
                                        {link.label}
                                    </span>
                                    </div>

                                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150">
                                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#3D6FC4] -translate-x-1 -translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/nav:translate-x-0 group-hover/nav:translate-y-0" />
                                    <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#3D6FC4] translate-x-1 -translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/nav:translate-x-0 group-hover/nav:translate-y-0" />
                                    <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#3D6FC4] -translate-x-1 translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/nav:translate-x-0 group-hover/nav:translate-y-0" />
                                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#3D6FC4] translate-x-1 translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/nav:translate-x-0 group-hover/nav:translate-y-0" />
                                    </div>
                                </>
                                );
                            }}
                            </NavLink>
                        );
                        })}
                    </div>
            <button
                className="md:hidden bg-transparent border-none cursor-pointer p-1 flex"
                style={{ color: "var(--foreground)" }}
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            </div>
        </div>

        {menuOpen && <MobileMenu onLinkClick={() => setMenuOpen(false)} />}
        </nav>
    );
}