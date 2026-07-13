import { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav
        className="sticky top-0 z-[2] border-b shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
        style={{
            background: "linear-gradient(180deg, #080d17 0%, #0d1829 100%)",
        }}
        >
        <div className="max-w-full mx-auto px-8">
            <div className="flex items-center justify-between h-[84px]">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
            >
                <Logo className="w-14 h-14" imgSize={76} divSize={76} />
                <div>
                    <div className="text-[2rem] font-bold leading-none tracking-[0.12em]"
                        style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
                    >
                        501ST ELITE ASSAULT LEGION
                    </div>
                    <div className="text-[0.9rem] tracking-[0.15em] mt-1"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--muted-foreground)" }}
                    >
                        GALACTIC REPUBLIC · GRAND ARMY
                    </div>
                </div>
            </button>

            <NavLinks />

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