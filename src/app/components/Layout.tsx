import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { Shield, Users, TrendingUp, Menu, X, ChevronRight } from "lucide-react";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Home Base", end: true },
    { to: "/roster", label: "Roster", end: false },
    { to: "/promotion", label: "Promotions", end: false },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <nav style={{
        background: "linear-gradient(180deg, #080d17 0%, #0d1829 100%)",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <UnitEmblem size={36} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--foreground)", lineHeight: 1 }}>
                  501ST ELITE ASSAULT LEGION
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted-foreground)", letterSpacing: "0.15em", marginTop: 2 }}>
                  GALACTIC REPUBLIC · GRAND ARMY
                </div>
              </div>
            </button>

            <div className="hidden md:flex" style={{ gap: 4 }}>
              {navLinks.map(link => (
                <NavLink key={link.to} to={link.to} end={link.end} style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 16px",
                  fontFamily: "var(--font-display)", fontSize: "0.78rem", letterSpacing: "0.1em",
                  textDecoration: "none",
                  color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                  background: isActive ? "rgba(61,111,196,0.08)" : "transparent",
                  transition: "all 0.15s ease",
                })}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", color: "var(--foreground)", cursor: "pointer", padding: 4, display: "flex" }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden" style={{ background: "#0d1829", borderTop: "1px solid var(--border)", padding: "8px 0" }}>
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 8, padding: "12px 24px",
                  fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: "0.08em",
                  textDecoration: "none",
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                  borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                  background: isActive ? "rgba(61,111,196,0.1)" : "transparent",
                })}>
                {link.label}
                <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", background: "#080d17", padding: "16px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted-foreground)", letterSpacing: "0.12em" }}>
          501ST ELITE ASSAULT LEGION — CLASSIFIED INTERNAL NETWORK — GAR-501-NET v2.4.1
          <span style={{ marginLeft: 24, color: "rgba(61,111,196,0.5)" }}>████████ ENCRYPTED ████████</span>
        </div>
      </footer>
    </div>
  );
}

function UnitEmblem({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#0d1829" stroke="#3D6FC4" strokeWidth="1.5" />
      <polygon points="20,7 32,14 32,26 20,33 8,26 8,14" fill="none" stroke="rgba(61,111,196,0.35)" strokeWidth="0.75" />
      <circle cx="20" cy="20" r="6" fill="none" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="20" y1="8" x2="20" y2="14" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="20" y1="26" x2="20" y2="32" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="8" y1="14" x2="14" y2="17" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="26" y1="23" x2="32" y2="26" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="8" y1="26" x2="14" y2="23" stroke="#3D6FC4" strokeWidth="1" />
      <line x1="26" y1="17" x2="32" y2="14" stroke="#3D6FC4" strokeWidth="1" />
      <circle cx="20" cy="20" r="2" fill="#3D6FC4" />
    </svg>
  );
}
