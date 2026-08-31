import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, Copy, Check } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination"; // Убедитесь, что путь правильный

interface BlacklistEntry {
    id: number;
    number: string;
    callsign: string;
    steamId: string;
    reason: string;
    addedDate: string;
    workoff: string;
    status: "TRIALS" | "EXILED" | "BANNED";
}

const STATUS_LABELS: Record<BlacklistEntry["status"], string> = {
    TRIALS: "Под судом",
    EXILED: "Изгнан",
    BANNED: "Забанен",
};

const ITEMS_PER_PAGE = 15;

export function AdminBlacklistPage() {
    const [entries, setEntries] = useState<BlacklistEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlacklistEntry | null>(null);
    const [creating, setCreating] = useState(false);
    
    // Новые состояния для поиска, пагинации и копирования
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/blacklist", { credentials: "include" });
        if (res.ok) setEntries(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    // Сброс страницы при поиске
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    async function handleDelete(id: number) {
        if (!confirm("Удалить эту запись из чёрного списка?")) return;
        const res = await fetch(`/api/admin/blacklist/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) load();
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // 1. Фильтрация
    const filteredEntries = useMemo(() => {
        if (!searchQuery.trim()) return entries;
        const q = searchQuery.toLowerCase();
        
        return entries.filter(e => 
            e.number.toLowerCase().includes(q) ||
            e.callsign.toLowerCase().includes(q) ||
            e.steamId.toLowerCase().includes(q) ||
            e.reason.toLowerCase().includes(q)
        );
    }, [entries, searchQuery]);

    // 2. Пагинация
    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEntries, currentPage]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="m-0">Чёрный список</h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 justify-end">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <input
                            type="text"
                            placeholder="Поиск (номер, позывной, ID)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                        />
                    </div>

                    <button
                        onClick={() => setCreating(true)}
                        className="flex shrink-0 items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-[var(--primary)]/15 border border-[var(--primary)]/50 text-[var(--primary)] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[var(--primary)]/25 transition-colors cursor-pointer"
                    >
                        <Plus size={14} /> Добавить запись
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                                <th className="py-2 px-4">Номер</th>
                                <th className="py-2 px-4">Позывной</th>
                                <th className="py-2 px-4">Steam ID</th>
                                <th className="py-2 px-4">Причина</th>
                                <th className="py-2 px-4">Отработка</th>
                                <th className="py-2 px-4">Статус</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            ) : (
                                paginatedEntries.map((e) => (
                                    <tr key={e.id} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 px-4 font-mono text-sm text-[var(--primary)]">{e.number}</td>
                                        <td className="py-2.5 px-4">{e.callsign}</td>
                                        
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--muted-foreground)]">
                                            <div 
                                                onClick={() => handleCopy(e.steamId)}
                                                className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                                                title="Нажмите, чтобы скопировать Steam ID"
                                            >
                                                <span>{e.steamId}</span>
                                                {copiedId === e.steamId ? (
                                                    <Check size={12} className="text-green-500 shrink-0" />
                                                ) : (
                                                    <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-2.5 px-4 text-sm text-[var(--muted-foreground)] max-w-xs truncate" title={e.reason}>
                                            {e.reason}
                                        </td>
                                        <td className="py-2.5 px-4 text-sm text-[var(--muted-foreground)] truncate max-w-[150px]" title={e.workoff}>
                                            {e.workoff}
                                        </td>
                                        <td className="py-2.5 px-4 font-mono text-xs whitespace-nowrap">{STATUS_LABELS[e.status]}</td>
                                        <td className="py-2.5 px-4 flex gap-2 justify-end">
                                            <button onClick={() => setEditing(e)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] p-1 cursor-pointer transition-colors">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(e.id)} className="text-[var(--muted-foreground)] hover:text-red-400 p-1 cursor-pointer transition-colors">
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredEntries.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {creating && <BlacklistFormModal onClose={() => setCreating(false)} onSaved={load} />}
            {editing && <BlacklistFormModal entry={editing} onClose={() => setEditing(null)} onSaved={load} />}
        </div>
    );
}

function BlacklistFormModal({
    entry,
    onClose,
    onSaved,
}: {
    entry?: BlacklistEntry;
    onClose: () => void;
    onSaved: () => void;
}) {
    const isEdit = !!entry;
    const [number, setNumber] = useState(entry?.number ?? "");
    const [callsign, setCallsign] = useState(entry?.callsign ?? "");
    const [steamId, setSteamId] = useState(entry?.steamId ?? "");
    const [reason, setReason] = useState(entry?.reason ?? "");
    const [addedDate, setAddedDate] = useState(entry?.addedDate ?? new Date().toLocaleDateString("ru-RU"));
    const [workoff, setWorkoff] = useState(entry?.workoff ?? "");
    const [status, setStatus] = useState<BlacklistEntry["status"]>(entry?.status ?? "BANNED");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const body = { number, callsign, steamId, reason, addedDate, workoff, status };

        try {
            const url = isEdit ? `/api/admin/blacklist/${entry!.id}` : "/api/admin/blacklist";
            const method = isEdit ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Ошибка сохранения");
                return;
            }

            onSaved();
            onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-6 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="m-0 text-lg">{isEdit ? "Редактировать запись" : "Новая запись"}</h2>
                    <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white cursor-pointer transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Номер</span>
                    <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </label>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Позывной</span>
                    <input
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </label>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">SteamID</span>
                    <input
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </label>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Причина</span>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={2}
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] resize-none transition-colors"
                    />
                </label>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Дата внесения</span>
                    <input
                        value={addedDate}
                        onChange={(e) => setAddedDate(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </label>

                <label className="block mb-3">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Отработка</span>
                    <input
                        value={workoff}
                        onChange={(e) => setWorkoff(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    />
                </label>

                <label className="block mb-4">
                    <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Статус</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as BlacklistEntry["status"])}
                        className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
                    >
                        <option value="TRIALS">Под судом</option>
                        <option value="EXILED">Изгнан</option>
                        <option value="BANNED">Забанен</option>
                    </select>
                </label>

                {error && (
                    <div className="mb-4 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-[var(--primary)]/15 border border-[var(--primary)]/50 hover:bg-[var(--primary)]/25 text-[var(--primary)] font-mono text-sm uppercase tracking-[0.1em] disabled:opacity-50 cursor-pointer transition-colors"
                >
                    {saving ? "Сохранение..." : "Сохранить"}
                </button>
            </form>
        </div>
    );
}
