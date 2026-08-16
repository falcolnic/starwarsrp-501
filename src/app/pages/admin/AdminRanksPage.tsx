import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X } from "lucide-react";

interface Rank {
    id: number;
    name: string;
    order: number;
    description: string | null;
}

interface Requirement {
    id: number;
    rankId: number;
    description: string;
    type: "auto" | "manual";
    metric: string | null;
    threshold: number | null;
}

export function AdminRanksPage() {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [requirements, setRequirements] = useState<Record<number, Requirement[]>>({});
    const [editingReq, setEditingReq] = useState<{ rankId: number; req?: Requirement } | null>(null);

    useEffect(() => {
        fetch("/api/ranks", { credentials: "include" })
        .then((r) => r.json())
        .then(setRanks);
    }, []);

    async function toggleExpand(rankId: number) {
        if (expanded === rankId) {
        setExpanded(null);
        return;
        }
        setExpanded(rankId);
        if (!requirements[rankId]) {
        const res = await fetch(`/api/admin/ranks/${rankId}/requirements`, { credentials: "include" });
        if (res.ok) {
            const data = await res.json();
            setRequirements((prev) => ({ ...prev, [rankId]: data }));
        }
        }
    }

    async function refreshRequirements(rankId: number) {
        const res = await fetch(`/api/admin/ranks/${rankId}/requirements`, { credentials: "include" });
        if (res.ok) {
        const data = await res.json();
        setRequirements((prev) => ({ ...prev, [rankId]: data }));
        }
    }

    async function handleDeleteReq(id: number, rankId: number) {
        if (!confirm("Удалить это требование?")) return;
        const res = await fetch(`/api/admin/requirements/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) refreshRequirements(rankId);
    }

    return (
        <div>
        <h1 className="mb-6">Звания и требования</h1>

        <div className="flex flex-col gap-2">
            {ranks
            .sort((a, b) => a.order - b.order)
            .map((rank) => (
                <div key={rank.id} className="border border-[var(--border)] bg-[var(--card)]">
                <button
                    onClick={() => toggleExpand(rank.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                    <div className="flex items-center gap-2">
                    {expanded === rank.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="font-mono text-xs text-[var(--primary)]">#{rank.order}</span>
                    <span>{rank.name}</span>
                    </div>
                </button>

                {expanded === rank.id && (
                    <div className="px-4 pb-4 border-t border-[var(--border)] pt-3">
                    <div className="flex justify-end mb-2">
                        <button
                        onClick={() => setEditingReq({ rankId: rank.id })}
                        className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:underline"
                        >
                        <Plus size={12} /> Добавить требование
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {(requirements[rank.id] ?? []).map((req) => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between gap-3 px-3 py-2 bg-black/20 border border-[var(--border)]/50 text-sm"
                        >
                            <div className="flex-1">
                            <div>{req.description}</div>
                            <div className="font-mono text-[0.65rem] text-[var(--muted-foreground)] mt-0.5">
                                {req.type === "auto" ? `АВТО: ${req.metric} ≥ ${req.threshold}` : "РУЧНОЕ"}
                            </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => setEditingReq({ rankId: rank.id, req })}
                                className="text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                            >
                                <Pencil size={13} />
                            </button>
                            <button
                                onClick={() => handleDeleteReq(req.id, rank.id)}
                                className="text-[var(--muted-foreground)] hover:text-red-400"
                            >
                                <Trash2 size={13} />
                            </button>
                            </div>
                        </div>
                        ))}
                        {(requirements[rank.id] ?? []).length === 0 && (
                        <div className="font-mono text-xs text-[var(--muted-foreground)]">Требований пока нет</div>
                        )}
                    </div>
                    </div>
                )}
                </div>
            ))}
        </div>

        {editingReq && (
            <RequirementFormModal
            rankId={editingReq.rankId}
            requirement={editingReq.req}
            onClose={() => setEditingReq(null)}
            onSaved={() => refreshRequirements(editingReq.rankId)}
            />
        )}
        </div>
    );
}

function RequirementFormModal({
    rankId,
    requirement,
    onClose,
    onSaved,
    }: {
    rankId: number;
    requirement?: Requirement;
    onClose: () => void;
    onSaved: () => void;
    }) {
    const isEdit = !!requirement;
    const [description, setDescription] = useState(requirement?.description ?? "");
    const [type, setType] = useState<"auto" | "manual">(requirement?.type ?? "manual");
    const [metric, setMetric] = useState(requirement?.metric ?? "");
    const [threshold, setThreshold] = useState(requirement?.threshold?.toString() ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const body = {
        description,
        type,
        metric: type === "auto" ? metric : null,
        threshold: type === "auto" ? Number(threshold) || 0 : null,
        };

        try {
        const url = isEdit ? `/api/admin/requirements/${requirement!.id}` : `/api/admin/ranks/${rankId}/requirements`;
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
            className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] p-6"
        >
            <div className="flex items-center justify-between mb-5">
            <h2 className="m-0 text-lg">{isEdit ? "Редактировать требование" : "Новое требование"}</h2>
            <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white">
                <X size={18} />
            </button>
            </div>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Описание</span>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)] resize-none"
            />
            </label>

            <label className="block mb-3">
            <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Тип</span>
            <select
                value={type}
                onChange={(e) => setType(e.target.value as "auto" | "manual")}
                className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            >
                <option value="manual">Ручное (галочка старшего)</option>
                <option value="auto">Автоматическое (из данных бота)</option>
            </select>
            </label>

            {type === "auto" && (
            <>
                <label className="block mb-3">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Метрика</span>
                <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
                >
                    <option value="">Выбрать...</option>
                    <option value="totalHours">Часы онлайн</option>
                    <option value="sessions">Количество сессий</option>
                    <option value="daysAtRank">Дней в звании</option>
                    <option value="unitLevel">Уровень подразделения</option>
                </select>
                </label>

                <label className="block mb-4">
                <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">Порог</span>
                <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
                />
                </label>
            </>
            )}

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