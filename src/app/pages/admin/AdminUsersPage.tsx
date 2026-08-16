import { useEffect, useState } from "react";
import { useAdminAuth } from "../../admin/AdminAuthContext";

interface AdminUserRow {
    id: number;
    username: string | null;
    steamId: string | null;
    displayName: string;
    role: "user" | "admin" | "superadmin";
    createdAt: string;
}

const ROLE_LABELS: Record<AdminUserRow["role"], string> = {
    user: "Пользователь",
    admin: "Админ",
    superadmin: "Супер-админ",
};

export function AdminUsersPage() {
    const { user: currentUser } = useAdminAuth();
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (res.ok) setUsers(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleRoleChange(id: number, role: AdminUserRow["role"]) {
        setError("");
        setSavingId(id);

        try {
        const res = await fetch(`/api/admin/users/${id}/role`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ role }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error ?? "Не удалось изменить роль");
            return;
        }

        await load();
        } finally {
        setSavingId(null);
        }
    }

    return (
        <div>
        <h1 className="mb-6">Пользователи</h1>

        {error && (
            <div className="mb-4 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
            {error}
            </div>
        )}

        {loading ? (
            <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
        ) : (
            <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">Имя</th>
                <th className="py-2 pr-4">Вход через</th>
                <th className="py-2 pr-4">Роль</th>
                </tr>
            </thead>
            <tbody>
                {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                    <tr key={u.id} className="border-b border-[var(--border)]/40">
                    <td className="py-2.5 pr-4">
                        {u.displayName}
                        {isSelf && (
                        <span className="ml-2 font-mono text-[0.6rem] text-[var(--primary)] uppercase">(вы)</span>
                        )}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-[var(--muted-foreground)]">
                        {u.username ? `логин: ${u.username}` : u.steamId ? "Steam" : "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                        <select
                        value={u.role}
                        disabled={isSelf || savingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUserRow["role"])}
                        className="px-2 py-1.5 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] disabled:opacity-40"
                        >
                        <option value="user">{ROLE_LABELS.user}</option>
                        <option value="admin">{ROLE_LABELS.admin}</option>
                        <option value="superadmin">{ROLE_LABELS.superadmin}</option>
                        </select>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        )}
        </div>
    );
}