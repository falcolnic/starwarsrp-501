import { Navigate, NavLink, Outlet } from "react-router";
import { Users, Shield, Ban, UserCog, LogOut, Cpu, Bug } from "lucide-react";
import { useAdminAuth } from "../../admin/AdminAuthContext";

const NAV_ITEMS = [
    { to: "/admin/roster", label: "Личный состав", icon: Users, minRole: "admin" as const },
    { to: "/admin/ranks", label: "Звания и требования", icon: Shield, minRole: "superadmin" as const },
    { to: "/admin/blacklist", label: "Чёрный список", icon: Ban, minRole: "admin" as const },
    { to: "/admin/users", label: "Пользователи", icon: UserCog, minRole: "superadmin" as const },
    { to: "/admin/zergs", label: "Зерги", icon: Bug, minRole: "superadmin" as const },
    { to: "/admin/droids", label: "Дроиды", icon: Cpu, minRole: "superadmin" as const },
    { to: "/admin/content", label: "Контент сайта", icon: Shield, minRole: "superadmin" as const },
    { to: "/admin/commanders", label: "Командиры", icon: Shield, minRole: "superadmin" as const },
    { to: "/admin/audit", label: "Аудит действий", icon: LogOut, minRole: "superadmin" as const },
];

export function AdminLayout() {
    const { user, loading, logout } = useAdminAuth();

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-[#080d17] font-mono text-sm text-[var(--muted-foreground)]">
            Проверка доступа...
        </div>
        );
    }

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        return <Navigate to="/admin/login" replace />;
    }

    const visibleNav = NAV_ITEMS.filter((item) => item.minRole !== "superadmin" || user.role === "superadmin");

    return (
        <div className="min-h-screen flex bg-[#080d17]">
        <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col">
            <div className="px-5 py-5 border-b border-[var(--border)]">
            <div className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--primary)] uppercase mb-1">
                501st Admin
            </div>
            <div className="text-sm text-[var(--foreground)]">{user.displayName}</div>
            <div className="font-mono text-[0.65rem] text-[var(--muted-foreground)] uppercase">{user.role}</div>
            </div>

            <nav className="flex-1 py-3">
            {visibleNav.map((item) => {
                const Icon = item.icon;
                return (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2.5 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors"
                    style={({ isActive }) => ({
                        color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                        background: isActive ? "rgba(61,111,196,0.08)" : "transparent",
                        borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                    })}
                >
                    <Icon size={14} />
                    {item.label}
                </NavLink>
                );
            })}
            </nav>

            <button
            onClick={logout}
            className="flex items-center gap-2.5 px-5 py-3 border-t border-[var(--border)] font-mono text-xs uppercase tracking-[0.08em] text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
            >
            <LogOut size={14} />
            Выйти
            </button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
        </main>
        </div>
    );
}