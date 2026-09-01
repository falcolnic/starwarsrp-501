import { useEffect, useState, useMemo } from "react";
import { useAdminAuth } from "../../admin/AdminAuthContext";
import { ExternalLink, Copy, Check, Search, Trash2 } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";

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
    admin: "Интендант",
    superadmin: "Адмиралы",
};

const ITEMS_PER_PAGE = 25;

export function AdminUsersPage() {
    const { user: currentUser } = useAdminAuth();
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedSteamId, setCopiedSteamId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (res.ok) setUsers(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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

    async function handleDeleteUser(id: number) {
        if (!window.confirm("Вы уверены, что хотите безвозвратно удалить этого пользователя?")) return;
        
        setError("");
        setDeletingId(id);

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Не удалось удалить пользователя");
                return;
            }

            await load();
        } finally {
            setDeletingId(null);
        }
    }

    const handleCopySteamId = (steamId: string) => {
        navigator.clipboard.writeText(steamId);
        setCopiedSteamId(steamId);
        setTimeout(() => setCopiedSteamId(null), 2000);
    };

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const lowerQuery = searchQuery.toLowerCase();
        
        return users.filter(u => 
            u.displayName.toLowerCase().includes(lowerQuery) ||
            (u.username && u.username.toLowerCase().includes(lowerQuery)) ||
            (u.steamId && u.steamId.toLowerCase().includes(lowerQuery))
        );
    }, [users, searchQuery]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1>Пользователи</h1>
                
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Поиск (имя, логин, Steam ID)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-center font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                                <th className="py-2 px-4 text-left">Имя (Ник)</th>
                                <th className="py-2 px-4 text-left">Логин</th>
                                <th className="py-2 px-4 text-left">Steam ID</th>
                                <th className="py-2 px-4 text-left">Роль</th>
                                <th className="py-2 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((u) => {
                                    const isSelf = u.id === currentUser?.id;
                                    const isOtherSuperAdmin = u.role === "superadmin" && !isSelf;
                                    const isDisabled = isSelf || isOtherSuperAdmin;
                                    const isRowLoading = savingId === u.id || deletingId === u.id;

                                    return (
                                        <tr key={u.id} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                            <td className="py-2.5 px-4 text-left">
                                                {u.displayName}
                                                {isSelf && (
                                                    <span className="ml-2 font-mono text-[0.6rem] text-[var(--primary)] uppercase">(вы)</span>
                                                )}
                                            </td>
                                            
                                            <td className="py-2.5 px-4 text-left font-mono text-xs text-[var(--muted-foreground)]">
                                                {u.username ? u.username : <span className="opacity-30">—</span>}
                                            </td>

                                            <td className="py-2.5 px-4 text-left font-mono text-xs text-[var(--muted-foreground)]">
                                                {u.steamId ? (
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            onClick={() => handleCopySteamId(u.steamId!)}
                                                            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                                                            title="Нажмите, чтобы скопировать"
                                                        >
                                                            <span>{u.steamId}</span>
                                                            {copiedSteamId === u.steamId ? (
                                                                <Check size={12} className="text-green-500" />
                                                            ) : (
                                                                <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            )}
                                                        </div>
                                                        
                                                        <a 
                                                            href={`https://steamcommunity.com/profiles/${u.steamId}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="text-[var(--muted-foreground)] hover:text-white transition-colors"
                                                            title="Открыть профиль Steam в новой вкладке"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="opacity-30">—</span>
                                                )}
                                            </td>

                                            <td className="py-2.5 px-4 text-left">
                                                <select
                                                    value={u.role}
                                                    disabled={isDisabled || isRowLoading}
                                                    title={isOtherSuperAdmin ? "Вы не можете изменить роль другого супер-администратора" : ""}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value as AdminUserRow["role"])}
                                                    className="px-2 py-1.5 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <option value="user">{ROLE_LABELS.user}</option>
                                                    <option value="admin">{ROLE_LABELS.admin}</option>
                                                    <option value="superadmin">{ROLE_LABELS.superadmin}</option>
                                                </select>
                                            </td>

                                            <td className="py-2.5 px-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    disabled={isDisabled || isRowLoading}
                                                    title={isOtherSuperAdmin ? "Вы не можете удалить другого супер-администратора" : "Удалить пользователя"}
                                                    className="p-1.5 text-red-500/80 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
