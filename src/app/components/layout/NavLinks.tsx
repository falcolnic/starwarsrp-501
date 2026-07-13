import { NavLink } from "react-router";
import { navLinks } from "./navLinks";

export function NavLinks() {
    return (
        <div className="hidden md:flex gap-1">
        {navLinks.map((link) => (
            <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className="flex items-center gap-1.5 px-4 py-2 text-base tracking-[0.1em] no-underline transition-all duration-150 border-b-2 border-transparent"
            style={({ isActive }) => ({
                fontFamily: "var(--font-display)",
                color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                borderBottomColor: isActive ? "var(--primary)" : "transparent",
                background: isActive ? "rgba(61,111,196,0.08)" : "transparent",
            })}
            >
            {link.label}
            </NavLink>
        ))}
        </div>
    );
}