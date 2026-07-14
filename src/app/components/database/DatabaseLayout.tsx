import { NavLink, Outlet } from "react-router";
import { Users2, Bot, ShieldHalf } from "lucide-react";
import { TrooperPDA } from "../pda/TrooperPDA";

const databaseTabs = [
        { to: "/zergs", label: "Зерги", icon: Users2 },
        { to: "/droids", label: "Дроиды", icon: Bot },
        { to: "/equipment", label: "Снаряжение", icon: ShieldHalf },
];

export function DatabaseLayout() {
    return (
        <>
        <div
            className="sticky top-[76px] z-20 border-b"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
        >
            <div className="max-w-[900px] mx-auto px-6 flex gap-1">
            {databaseTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <NavLink
                        key={tab.to}
                        to={tab.to}
                        className="flex items-center gap-2 px-4 py-3 font-mono text-sm uppercase tracking-[0.08em] border-b-2 transition-colors"
                        style={({ isActive }) => ({
                        color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                        borderColor: isActive ? "var(--primary)" : "transparent",
                        background: isActive ? "rgba(61,111,196,0.08)" : "transparent",
                        })}
                    >
                        <Icon size={14} />
                        {tab.label}
                    </NavLink>
                );
            })}
            </div>
        </div>

        <Outlet />
        <TrooperPDA />
        </>
    );
}