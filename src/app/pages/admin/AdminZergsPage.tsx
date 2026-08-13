import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { ZergEntry, ZergAttack } from "../../../data/zergs";

export function AdminZergsPage() {
    const [zergs, setZergs] = useState<ZergEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<ZergEntry | null>(null);
    const [creating, setCreating] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/zergs", { credentials: "include" });
        if (res.ok) setZergs(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm(`Удалить запись «${id}»?`)) return;
        const res = await fetch(`/api/admin/zergs/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) load();
    }

    return (
        <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="m-0">Зерги</h1>
            <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/15 border border-[var(--primary)]/50 text-[var(--primary)] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[var(--primary)]/25 transition-colors"
            >
            <Plus size={14} /> Добавить
            </button>
        </div>

        {loading ? (
            <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
        ) : (
            <table className="w-full border-collapse">
            <thead>
                <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Имя</th>
                <th className="py-2 pr-4">Опасность</th>
                <th className="py-2 pr-4">HP</th>
                <th className="py-2 pr-4"></th>
                </tr>
            </thead>
            <tbody>
                {zergs.map((z) => (
                <tr key={z.id} className="border-b border-[var(--border)]/40">
                    <td className="py-2.5 pr-4 font-mono text-sm text-[var(--primary)]">{z.id}</td>
                    <td className="py-2.5 pr-4">{z.name}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{z.danger}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs">{z.hp}</td>
                    <td className="py-2.5 pr-4 flex gap-2">
                    <button onClick={() => setEditing(z)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                        <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(z.id)} className="text-[var(--muted-foreground)] hover:text-red-400">
                        <Trash2 size={15} />
                    </button>
                    </td>
                </tr>
                ))}
                {zergs.length === 0 && (
                <tr>
                    <td colSpan={5} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                    Список пуст
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        )}

        {creating && <ZergFormModal onClose={() => setCreating(false)} onSaved={load} />}
        {editing && <ZergFormModal entry={editing} onClose={() => setEditing(null)} onSaved={load} />}
        </div>
    );
}

function ZergFormModal({
    entry,
    onClose,
    onSaved,
    }: {
    entry?: ZergEntry;
    onClose: () => void;
    onSaved: () => void;
    }) {
    const isEdit = !!entry;
    const [id, setId] = useState(entry?.id ?? "");
    const [name, setName] = useState(entry?.name ?? "");
    const [danger, setDanger] = useState<ZergEntry["danger"]>(entry?.danger ?? "средний");
    const [hp, setHp] = useState(entry?.hp?.toString() ?? "");
    const [recommendations, setRecommendations] = useState(entry?.recommendations ?? "");
    const [description, setDescription] = useState(entry?.description ?? "");
    const [image, setImage] = useState(entry?.image ?? "");
    const [attacks, setAttacks] = useState<ZergAttack[]>(entry?.attacks ?? []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function addAttack() {
        setAttacks([...attacks, { type: "", range: "ближняя", damage: "" }]);
    }

    function updateAttack(i: number, field: keyof ZergAttack, value: string) {
        setAttacks(attacks.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)));
    }

    function removeAttack(i: number) {
        setAttacks(attacks.filter((_, idx) => idx !== i));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const body = {
        name,
        danger,
        hp: Number(hp) || 0,
        attacks,
        recommendations,
        description,
        image: image || null,
        };

        try {
        const url = isEdit ? `/api/admin/zergs/${entry!.id}` : "/api/admin/zergs";
        const method = isEdit ? "PATCH" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(isEdit ? body : { id, ...body }),
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
            <h2 className="m-0 text-lg">{isEdit ? `Редактировать «${entry!.id}»` : "Новая запись"}</h2>
            <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white">
                <X size={18} />
            </button>
            </div>

            {!isEdit && (
            <label className="block mb-3">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">ID (латиницей)</span>
                <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                placeholder="roach"
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)]"
                />
            </label>
            )}

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Название</span>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            />
            </label>

            <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="block">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Опасность</span>
                <select
                value={danger}
                onChange={(e) => setDanger(e.target.value as ZergEntry["danger"])}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
                >
                <option value="низкий">Низкий</option>
                <option value="средний">Средний</option>
                <option value="высокий">Высокий</option>
                </select>
            </label>

            <label className="block">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">HP</span>
                <input
                type="number"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)]"
                />
            </label>
            </div>

            <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Атаки</span>
                <button type="button" onClick={addAttack} className="text-xs text-[var(--primary)] hover:underline">
                + добавить
                </button>
            </div>
            <div className="flex flex-col gap-2">
                {attacks.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input
                    value={a.type}
                    onChange={(e) => updateAttack(i, "type", e.target.value)}
                    placeholder="Тип атаки"
                    className="flex-1 px-2 py-1.5 bg-black/30 border border-[var(--border)] text-xs outline-none"
                    />
                    <select
                    value={a.range}
                    onChange={(e) => updateAttack(i, "range", e.target.value)}
                    className="px-2 py-1.5 bg-black/30 border border-[var(--border)] text-xs outline-none"
                    >
                    <option value="ближняя">Ближняя</option>
                    <option value="дальняя">Дальняя</option>
                    </select>
                    <input
                    value={a.damage}
                    onChange={(e) => updateAttack(i, "damage", e.target.value)}
                    placeholder="Урон"
                    className="w-24 px-2 py-1.5 bg-black/30 border border-[var(--border)] text-xs outline-none"
                    />
                    <button type="button" onClick={() => removeAttack(i)} className="text-[var(--muted-foreground)] hover:text-red-400">
                    <X size={14} />
                    </button>
                </div>
                ))}
            </div>
            </div>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Рекомендации</span>
            <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                required
                rows={2}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] resize-none"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Описание</span>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] resize-none"
            />
            </label>

            <label className="block mb-4">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Путь к изображению</span>
            <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/database/zergs/roach.jpg"
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] font-mono text-sm outline-none focus:border-[var(--primary)]"
            />
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