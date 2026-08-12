import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Medal as MedalIcon } from "lucide-react";

interface Soldier {
    cid: string;
    steamId: string | null;
    nickname: string | null;
    rank: string | null;
    callsignOverride: string | null;
    positions: string[];
    squads: string[];
    status: string;
    reprimands: number;
    reprimandsFrozen: boolean;
    medals: string[];
}

export function AdminRosterPage() {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Soldier | null>(null);
    const [creating, setCreating] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/soldiers", { credentials: "include" });
        if (res.ok) setSoldiers(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(cid: string) {
        if (!confirm(`Удалить бойца CID-${cid} из реестра?`)) return;
        const res = await fetch(`/api/admin/soldiers/${cid}`, { method: "DELETE", credentials: "include" });
        if (res.ok) load();
    }

    return (
        <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="m-0 text-white font-bold text-xl">Личный состав</h1>
            <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/15 border border-[var(--primary)]/50 text-[var(--primary)] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[var(--primary)]/25 transition-colors cursor-pointer"
            >
            <Plus size={14} /> Добавить бойца
            </button>
        </div>

        {loading ? (
            <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
        ) : (
            <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">CID</th>
                <th className="py-2 pr-4">Позывной</th>
                <th className="py-2 pr-4">Звание</th>
                <th className="py-2 pr-4">Статус</th>
                <th className="py-2 pr-4">Медали</th>
                <th className="py-2 pr-4"></th>
                </tr>
            </thead>
            <tbody>
                {soldiers.map((s) => (
                <tr key={s.cid} className="border-b border-[var(--border)]/40">
                    <td className="py-2.5 pr-4 font-mono text-sm text-[var(--primary)]">{s.cid}</td>
                    <td className="py-2.5 pr-4 text-white">{s.callsignOverride || s.nickname || "—"}</td>
                    <td className="py-2.5 pr-4 text-[var(--muted-foreground)]">{s.rank || "—"}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{s.status}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-[var(--primary)]">{s.medals?.length ?? 0}</td>
                    <td className="py-2.5 pr-4 flex gap-2">
                    <button onClick={() => setEditing(s)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer">
                        <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(s.cid)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer">
                        <Trash2 size={15} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        {creating && <SoldierFormModal onClose={() => setCreating(false)} onSaved={load} />}
        {editing && <SoldierFormModal soldier={editing} onClose={() => setEditing(null)} onSaved={load} />}
        </div>
    );
}

function SoldierFormModal({
    soldier,
    onClose,
    onSaved,
    }: {
    soldier?: Soldier;
    onClose: () => void;
    onSaved: () => void;
    }) {
    const isEdit = !!soldier;
    const [cid, setCid] = useState(soldier?.cid ?? "");
    const [callsignOverride, setCallsignOverride] = useState(soldier?.callsignOverride ?? "");
    const [status, setStatus] = useState(soldier?.status ?? "active");
    const [positions, setPositions] = useState(soldier?.positions.join(", ") ?? "");
    const [squads, setSquads] = useState(soldier?.squads.join(", ") ?? "");
    const [medals, setMedals] = useState<string[]>(soldier?.medals ?? []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function addMedal() {
        setMedals([...medals, ""]);
    }

    function updateMedal(index: number, value: string) {
        setMedals(medals.map((m, idx) => (idx === index ? value : m)));
    }

    function removeMedal(index: number) {
        setMedals(medals.filter((_, idx) => idx !== index));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const body = {
        callsignOverride: callsignOverride || null,
        status,
        positions: positions.split(",").map((p) => p.trim()).filter(Boolean),
        squads: squads.split(",").map((s) => s.trim()).filter(Boolean),
        medals: medals.map((m) => m.trim()).filter(Boolean),
        };

        try {
        const url = isEdit ? `/api/admin/soldiers/${soldier!.cid}` : "/api/admin/soldiers";
        const method = isEdit ? "PATCH" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(isEdit ? body : { cid, ...body }),
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
            className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] p-6 max-h-[85vh] overflow-y-auto"
        >
            <div className="flex items-center justify-between mb-5">
            <h2 className="m-0 text-lg text-white font-bold">{isEdit ? `Редактировать CID-${soldier!.cid}` : "Добавить бойца"}</h2>
            <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white cursor-pointer">
                <X size={18} />
            </button>
            </div>

            {!isEdit && (
            <label className="block mb-3">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">CID</span>
                <input
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm text-white outline-none focus:border-[var(--primary)]"
                />
            </label>
            )}

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Позывной (override)</span>
            <input
                value={callsignOverride}
                onChange={(e) => setCallsignOverride(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Статус</span>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)]"
            >
                <option value="active">Активен</option>
                <option value="leave">Отпуск</option>
                <option value="reserve">Резерв</option>
                <option value="medical">Мед. отвод</option>
                <option value="training">Обучение</option>
                <option value="detached">Прикомандирован</option>
                <option value="suspended">Отстранён</option>
                <option value="awol">Самоволка</option>
                <option value="dismissed">Уволен</option>
            </select>
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Должности (через запятую)</span>
            <input
                value={positions}
                onChange={(e) => setPositions(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)]"
            />
            </label>

            <label className="block mb-4">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Отряды (через запятую)</span>
            <input
                value={squads}
                onChange={(e) => setSquads(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)]"
            />
            </label>

            <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase flex items-center gap-1.5">
                <MedalIcon size={12} /> Награды
                </span>
                <button type="button" onClick={addMedal} className="text-xs text-[var(--primary)] hover:underline cursor-pointer">
                + добавить
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {medals.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input
                    value={m}
                    onChange={(e) => updateMedal(i, e.target.value)}
                    placeholder="Название медали"
                    className="flex-1 px-3 py-1.5 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)] font-mono"
                    />
                    <button type="button" onClick={() => removeMedal(i)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer">
                    <X size={14} />
                    </button>
                </div>
                ))}
            </div>
            </div>

            {error && (
            <div className="mb-4 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">
                {error}
            </div>
            )}

            <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[var(--primary)]/15 border border-[var(--primary)]/50 hover:bg-[var(--primary)]/25 text-[var(--primary)] font-mono text-sm uppercase tracking-[0.1em] disabled:opacity-50 cursor-pointer"
            >
            {saving ? "Сохранение..." : "Сохранить"}
            </button>
        </form>
        </div>
    );
}