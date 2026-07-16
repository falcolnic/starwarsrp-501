import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { navLinks } from "./navLinks";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav
        className="sticky top-0 z-15 border-b shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
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
                <div>
                    <div className="text-2xl font-bold leading-none tracking-[0.12em] text-[var(--foreground)] font-[family:var(--font-display)]">
                        501ST ELITE ASSAULT LEGION
                    </div>
                    <div className="text-sm tracking-[0.15em] mt-2 text-[var(--muted-foreground)] font-[family:var(--font-mono)]">
                        Великая · Армия · Республики
                    </div>
                </div>
            </button>

            <div className="hidden md:flex items-center gap-8 h-full">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => 
                            `h-[84px] flex items-center px-1 border-b-2 text-base font-medium tracking-[0.12em] uppercase transition-all duration-200 no-underline ${
                                isActive 
                                    ? "text-[var(--primary)] border-[var(--primary)] [text-shadow:0_0_8px_rgba(61,111,196,0.6)]" 
                                    : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
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