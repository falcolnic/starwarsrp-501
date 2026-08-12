import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router";

export interface AdminUser {
    id: number;
    username: string | null;
    displayName: string;
    role: "user" | "admin" | "superadmin";
}

interface AdminAuthContextValue {
    user: AdminUser | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
            setUser(await res.json());
        } else {
            setUser(null);
        }
        } catch {
        setUser(null);
        } finally {
        setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setUser(null);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <AdminAuthContext.Provider value={{ user, loading, refresh, logout }}>
            <Outlet />
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error("useAdminAuth should be used within AdminAuthProvider");
    return ctx;
}