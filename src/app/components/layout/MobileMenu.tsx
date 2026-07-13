import { NavLink } from "react-router";
import { ChevronRight } from "lucide-react";
import { navLinks } from "./navLinks";

interface MobileMenuProps {
    onLinkClick: () => void;
}

export function MobileMenu({ onLinkClick }: MobileMenuProps) {
    return (
        <div
        className="md:hidden border-t py-2"
        style={{ background: "#0d1829", borderColor: "var(--border)" }}
        >
        {navLinks.map((link) => (
            <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onLinkClick}
            className="flex items-center gap-2 px-6 py-3 text-[0.95rem] tracking-[0.08em] no-underline border-l-[3px] border-transparent"
            style={({ isActive }) => ({
                fontFamily: "var(--font-display)",
                color: isActive ? "var(--primary)" : "var(--foreground)",
                borderLeftColor: isActive ? "var(--primary)" : "transparent",
                background: isActive ? "rgba(61,111,196,0.1)" : "transparent",
            })}
            >
            {link.label}
            <ChevronRight size={14} className="ml-auto opacity-50" />
            </NavLink>
        ))}
        </div>
    );
}