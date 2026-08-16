import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

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

export function AdminBlacklistPage() {
    const [entries, setEntries] = useState<BlacklistEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlacklistEntry | null>(null);
    const [creating, setCreating] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/blacklist", { credentials: "include" });
        if (res.ok) setEntries(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id: number) {
        if (!confirm("Удалить эту запись из чёрного списка?")) return;
        const res = await fetch(`/api/admin/blacklist/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) load();
    }

    return (
        <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="m-0">Чёрный список</h1>
            <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/15 border border-[var(--primary)]/50 text-[var(--primary)] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[var(--primary)]/25 transition-colors"
            >
            <Plus size={14} /> Добавить запись
            </button>
        </div>

        {loading ? (
            <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
        ) : (
            <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">Номер</th>
                <th className="py-2 pr-4">Позывной</th>
                <th className="py-2 pr-4">Причина</th>
                <th className="py-2 pr-4">Статус</th>
                <th className="py-2 pr-4"></th>
                </tr>
            </thead>
            <tbody>
                {entries.map((e) => (
                <tr key={e.id} className="border-b border-[var(--border)]/40">
                    <td className="py-2.5 pr-4 font-mono text-sm text-[var(--primary)]">{e.number}</td>
                    <td className="py-2.5 pr-4">{e.callsign}</td>
                    <td className="py-2.5 pr-4 text-sm text-[var(--muted-foreground)] max-w-xs truncate">{e.reason}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{STATUS_LABELS[e.status]}</td>
                    <td className="py-2.5 pr-4 flex gap-2">
                    <button onClick={() => setEditing(e)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                        <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="text-[var(--muted-foreground)] hover:text-red-400">
                        <Trash2 size={15} />
                    </button>
                    </td>
                </tr>
                ))}
                {entries.length === 0 && (
                <tr>
                    <td colSpan={5} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                    Список пуст
                    </td>
                </tr>
                )}
            </tbody>
            </table>
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
            className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-6 max-h-[85vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between mb-5">
            <h2 className="m-0 text-lg">{isEdit ? "Редактировать запись" : "Новая запись"}</h2>
            <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white">
                <X size={18} />
            </button>
            </div>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Номер</span>
            <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Позывной</span>
            <input
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">SteamID</span>
            <input
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Причина</span>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={2}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] resize-none"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Дата внесения</span>
            <input
                value={addedDate}
                onChange={(e) => setAddedDate(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Отработка</span>
            <input
                value={workoff}
                onChange={(e) => setWorkoff(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-4">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Статус</span>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlacklistEntry["status"])}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
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
            className="w-full py-2.5 bg-[var(--primary)]/15 border border-[var(--primary)]/50 hover:bg-[var(--primary)]/25 text-[var(--primary)] font-mono text-sm uppercase tracking-[0.1em] disabled:opacity-50"
            >
            {saving ? "Сохранение..." : "Сохранить"}
            </button>
        </form>
        </div>
    );
}