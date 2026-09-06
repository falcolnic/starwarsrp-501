import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";

export interface CommanderEntry {
    id: number;
    rank: string;
    period: string;
    orderNum: number;
    idNumber: string;
    callsign: string;
}

const RANKS = ["Маршал", "Коммандер", "Командир первого класса", "Командир"];
const ITEMS_PER_PAGE = 20;

export function AdminCommandersPage() {
    const [commanders, setCommanders] = useState<CommanderEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<CommanderEntry | null>(null);
    const [creating, setCreating] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/commanders");
            if (res.ok) setCommanders(await res.json());
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    async function handleDelete(id: number) {
        if (!confirm(`Удалить запись из архива?`)) return;
        const res = await fetch(`/api/admin/commanders/${id}`, { 
            method: "DELETE", 
            credentials: "include" 
        });
        if (res.ok) load();
    }

    const filteredCommanders = useMemo(() => {
        if (!searchQuery.trim()) return commanders;
        const lowerQuery = searchQuery.toLowerCase();

        return commanders.filter((c) => 
            c.callsign.toLowerCase().includes(lowerQuery) ||
            c.idNumber.toLowerCase().includes(lowerQuery) ||
            c.rank.toLowerCase().includes(lowerQuery) ||
            c.period.toLowerCase().includes(lowerQuery)
        );
    }, [commanders, searchQuery]);

    const sortedCommanders = useMemo(() => {
        return [...filteredCommanders].sort((a, b) => {
            const rankDiff = RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank);
            if (rankDiff !== 0) return rankDiff;
            const periodDiff = a.period.localeCompare(b.period);
            if (periodDiff !== 0) return periodDiff;
            return a.orderNum - b.orderNum;
        });
    }, [filteredCommanders]);

    const paginatedCommanders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedCommanders.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedCommanders, currentPage]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="m-0 text-white font-bold text-xl">Архив Командования</h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 justify-end">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <input
                            type="text"
                            placeholder="Поиск (Имя, Ранг, Период)..."
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
                                <th className="py-2 px-4 w-12">ID</th>
                                <th className="py-2 px-4">Звание</th>
                                <th className="py-2 px-4">Период</th>
                                <th className="py-2 px-4">Порядок</th>
                                <th className="py-2 px-4">Рег. Номер</th>
                                <th className="py-2 px-4">Позывной</th>
                                <th className="py-2 px-4 w-20 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCommanders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            ) : (
                                paginatedCommanders.map((c) => (
                                    <tr key={c.id} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--muted-foreground)]">{c.id}</td>
                                        <td className="py-2.5 px-4 font-bold text-white">{c.rank}</td>
                                        <td className="py-2.5 px-4 text-[var(--primary)] font-mono text-sm">{c.period}</td>
                                        <td className="py-2.5 px-4 font-mono text-sm text-slate-300">{c.orderNum}</td>
                                        <td className="py-2.5 px-4 font-mono text-slate-400">{c.idNumber}</td>
                                        <td className="py-2.5 px-4 text-[var(--primary)] italic font-bold tracking-wide">{c.callsign}</td>
                                        <td className="py-2.5 px-4 flex gap-2 justify-end">
                                            <button onClick={() => setEditing(c)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer p-1">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer p-1">
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
                        totalItems={filteredCommanders.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {creating && <CommanderFormModal onClose={() => setCreating(false)} onSaved={load} />}
            {editing && <CommanderFormModal entry={editing} onClose={() => setEditing(null)} onSaved={load} />}
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">{children}</span>;
}

const inputClass = "w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)] transition-colors";

function CommanderFormModal({
    entry,
    onClose,
    onSaved,
}: {
    entry?: CommanderEntry;
    onClose: () => void;
    onSaved: () => void;
}) {
    const isEdit = !!entry;
    const [rank, setRank] = useState(entry?.rank ?? RANKS[0]);
    const [period, setPeriod] = useState(entry?.period ?? "2024-2025");
    const [orderNum, setOrderNum] = useState<number | "">(entry?.orderNum ?? 1);
    const [idNumber, setIdNumber] = useState(entry?.idNumber ?? "");
    const [callsign, setCallsign] = useState(entry?.callsign ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const body = {
            rank,
            period,
            orderNum: Number(orderNum),
            idNumber: idNumber || "—",
            callsign,
        };

        try {
            const url = isEdit ? `/api/admin/commanders/${entry!.id}` : "/api/admin/commanders";
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
                className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="m-0 text-lg text-white font-bold uppercase tracking-wider">
                        {isEdit ? "Редактировать запись" : "Новая запись"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <label className="block mb-4">
                    <FieldLabel>Звание (Категория)</FieldLabel>
                    <select value={rank} onChange={(e) => setRank(e.target.value)} required className={inputClass}>
                        {RANKS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </label>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="block">
                        <FieldLabel>Эпоха (Период)</FieldLabel>
                        <input 
                            value={period} 
                            onChange={(e) => setPeriod(e.target.value)} 
                            placeholder="2025-2026" 
                            required 
                            className={`${inputClass} font-mono`} 
                        />
                    </label>
                    <label className="block">
                        <FieldLabel>Порядковый номер</FieldLabel>
                        <input 
                            type="number"
                            min="1"
                            value={orderNum} 
                            onChange={(e) => setOrderNum(Number(e.target.value))} 
                            required 
                            className={`${inputClass} font-mono`} 
                        />
                    </label>
                </div>

                <label className="block mb-4">
                    <FieldLabel>Позывной</FieldLabel>
                    <input 
                        value={callsign} 
                        onChange={(e) => setCallsign(e.target.value)} 
                        placeholder="Напр. Rex" 
                        required 
                        className={inputClass} 
                    />
                </label>

                <label className="block mb-6">
                    <FieldLabel>Регистрационный Токен (ID)</FieldLabel>
                    <input 
                        value={idNumber} 
                        onChange={(e) => setIdNumber(e.target.value)} 
                        placeholder="Напр. 7567 (или '—')" 
                        required 
                        className={`${inputClass} font-mono`} 
                    />
                    {rank === "Маршал" && (
                        <p className="text-xs text-slate-500 font-mono mt-1">Если не знаете номер — используйте знак "—"</p>
                    )}
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
