import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Medal as MedalIcon, Search, Copy, Check } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";

interface Rank {
    id: number;
    name: string;
    order: number;
}

interface Soldier {
    cid: string;
    steamId: string | null;
    discordId: string | null;
    nickname: string | null;
    rank: string | null;
    rankId: number | null;
    callsignOverride: string | null;
    positions: string[];
    squads: string[];
    attached: string[];
    status: string;
    joinDate: string | null;
    leaveUntil: string | null;
    reserveUntil: string | null;
    reprimands: number;
    reprimandsFrozen: boolean;
    medals: string[];
    avatar: string | null;
    unitLevel: number;
}

function ReprimandCell({ count, frozen }: { count: number; frozen: boolean }) {
    if (frozen) {
        return (
            <span className="flex items-center justify-center">
                <span className="text-xs text-[#F5C518] border border-[#F5C518]/30 px-1.5 py-0.5">❄ заморожено</span>
            </span>
        );
    }

    const colorClass =
        count >= 3 ? "text-red-500" : count > 0 ? "text-[#F5C518]" : "text-[var(--muted-foreground)]/25";

    return <span className={`font-mono text-sm flex items-center justify-center ${colorClass}`}>{count}/3</span>;
}

const STATUS_LABELS: Record<string, string> = {
    active: "Активен",
    leave: "Отпуск",
    reserve: "Резерв",
    medical: "Мед. отвод",
    training: "Обучение",
    detached: "Прикомандирован",
    suspended: "Отстранён",
    awol: "Самоволка",
    dismissed: "Уволен",
};

function truncateId(id: string | null, visible = 6) {
    if (!id) return "—";
    return id.length > visible + 2 ? `…${id.slice(-visible)}` : id;
}

const ITEMS_PER_PAGE = 25;

export function AdminRosterPage() {
    const [soldiers, setSoldiers] = useState<Soldier[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Soldier | null>(null);
    const [creating, setCreating] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Состояние для отображения иконки скопированного ID
    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        const [soldiersRes, ranksRes] = await Promise.all([
            fetch("/api/admin/soldiers", { credentials: "include" }),
            fetch("/api/admin/ranks", { credentials: "include" }),
        ]);
        if (soldiersRes.ok) setSoldiers(await soldiersRes.json());
        if (ranksRes.ok) setRanks(await ranksRes.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    async function handleDelete(cid: string) {
        if (!confirm(`Удалить бойца CID-${cid} из реестра?`)) return;
        const res = await fetch(`/api/admin/soldiers/${cid}`, { method: "DELETE", credentials: "include" });
        if (res.ok) load();
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredSoldiers = useMemo(() => {
        if (!searchQuery.trim()) return soldiers;
        const lowerQuery = searchQuery.toLowerCase();
        
        return soldiers.filter(s => 
            s.cid.toLowerCase().includes(lowerQuery) ||
            (s.nickname && s.nickname.toLowerCase().includes(lowerQuery)) ||
            (s.callsignOverride && s.callsignOverride.toLowerCase().includes(lowerQuery)) ||
            (s.steamId && s.steamId.toLowerCase().includes(lowerQuery)) ||
            (s.discordId && s.discordId.toLowerCase().includes(lowerQuery)) ||
            (s.rank && s.rank.toLowerCase().includes(lowerQuery))
        );
    }, [soldiers, searchQuery]);

    const paginatedSoldiers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSoldiers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredSoldiers, currentPage]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="m-0 text-white font-bold text-xl">Личный состав</h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto flex-1 justify-end">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                        <input
                            type="text"
                            placeholder="Поиск (CID, имя, ID)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                        />
                    </div>

                    <button
                        onClick={() => setCreating(true)}
                        className="flex shrink-0 items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-[var(--primary)]/15 border border-[var(--primary)]/50 text-[var(--primary)] font-mono text-xs uppercase tracking-[0.1em] hover:bg-[var(--primary)]/25 transition-colors cursor-pointer"
                    >
                        <Plus size={14} /> Добавить бойца
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
                                <th className="py-2 px-4">CID</th>
                                <th className="py-2 px-4">Позывной</th>
                                <th className="py-2 px-4">Звание</th>
                                <th className="py-2 px-4">Steam ID</th>
                                <th className="py-2 px-4">Discord ID</th>
                                <th className="py-2 px-4">Статус</th>
                                <th className="py-2 px-4 text-center">Взыскания</th>
                                <th className="py-2 px-4">Медали</th>
                                <th className="py-2 px-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSoldiers.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            ) : (
                                paginatedSoldiers.map((s) => (
                                    <tr key={s.cid} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 px-4 font-mono text-sm text-[var(--primary)]">{s.cid}</td>
                                        <td className="py-2.5 px-4 text-white">{s.callsignOverride || s.nickname || "—"}</td>
                                        <td className="py-2.5 px-4 text-[var(--muted-foreground)]">{s.rank || "—"}</td>
                                        
                                        {/* Копируемый Steam ID */}
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--muted-foreground)]">
                                            {s.steamId ? (
                                                <div 
                                                    onClick={() => handleCopy(s.steamId!)}
                                                    className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                                                    title={`Нажмите, чтобы скопировать полный ID (${s.steamId})`}
                                                >
                                                    <span>{truncateId(s.steamId)}</span>
                                                    {copiedId === s.steamId ? (
                                                        <Check size={12} className="text-green-500 shrink-0" />
                                                    ) : (
                                                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    )}
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        {/* Копируемый Discord ID */}
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--muted-foreground)]">
                                            {s.discordId ? (
                                                <div 
                                                    onClick={() => handleCopy(s.discordId!)}
                                                    className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                                                    title={`Нажмите, чтобы скопировать полный ID (${s.discordId})`}
                                                >
                                                    <span>{truncateId(s.discordId)}</span>
                                                    {copiedId === s.discordId ? (
                                                        <Check size={12} className="text-green-500 shrink-0" />
                                                    ) : (
                                                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    )}
                                                </div>
                                            ) : (
                                                "—"
                                            )}
                                        </td>

                                        <td className="py-2.5 px-4 font-mono text-xs">{STATUS_LABELS[s.status] ?? s.status}</td>
                                        <td className="py-2.5 px-4">
                                            <ReprimandCell count={s.reprimands} frozen={s.reprimandsFrozen} />
                                        </td>
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--primary)]">{s.medals?.length ?? 0}</td>
                                        <td className="py-2.5 px-4 flex gap-2 justify-end">
                                            <button onClick={() => setEditing(s)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer p-1">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(s.cid)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer p-1">
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
                        totalItems={filteredSoldiers.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {creating && <SoldierFormModal ranks={ranks} onClose={() => setCreating(false)} onSaved={load} />}
            {editing && <SoldierFormModal soldier={editing} ranks={ranks} onClose={() => setEditing(null)} onSaved={load} />}
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase">{children}</span>;
}

const inputClass =
    "w-full mt-1 px-3 py-2 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)] transition-colors";

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--primary)]/80 mt-6 mb-3 pb-1.5 border-b border-[var(--border)]/60 first:mt-0">
            {children}
        </h3>
    );
}

function SoldierFormModal({
    soldier,
    ranks,
    onClose,
    onSaved,
}: {
    soldier?: Soldier;
    ranks: Rank[];
    onClose: () => void;
    onSaved: () => void;
}) {
    const isEdit = !!soldier;
    const [cid, setCid] = useState(soldier?.cid ?? "");
    const [steamId, setSteamId] = useState(soldier?.steamId ?? "");
    const [discordId, setDiscordId] = useState(soldier?.discordId ?? "");
    const [avatar, setAvatar] = useState(soldier?.avatar ?? "");
    const [callsignOverride, setCallsignOverride] = useState(soldier?.callsignOverride ?? "");
    const [rank, setRank] = useState(soldier?.rank ?? "");
    const [status, setStatus] = useState(soldier?.status ?? "active");
    const [joinDate, setJoinDate] = useState(soldier?.joinDate ?? "");
    const [leaveUntil, setLeaveUntil] = useState(soldier?.leaveUntil ?? "");
    const [reserveUntil, setReserveUntil] = useState(soldier?.reserveUntil ?? "");
    const [positions, setPositions] = useState(soldier?.positions.join(", ") ?? "");
    const [squads, setSquads] = useState(soldier?.squads.join(", ") ?? "");
    const [attached, setAttached] = useState(soldier?.attached.join(", ") ?? "");
    const [unitLevel, setUnitLevel] = useState(soldier?.unitLevel ?? 0);
    const [reprimands, setReprimands] = useState(soldier?.reprimands ?? 0);
    const [reprimandsFrozen, setReprimandsFrozen] = useState(soldier?.reprimandsFrozen ?? false);
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
            steamId: steamId || null,
            discordId: discordId || null,
            avatar: avatar || null,
            callsignOverride: callsignOverride || null,
            rank: rank || null,
            status,
            joinDate: joinDate || null,
            leaveUntil: status === "leave" ? leaveUntil || null : null,
            reserveUntil: status === "reserve" ? reserveUntil || null : null,
            positions: positions.split(",").map((p) => p.trim()).filter(Boolean),
            squads: squads.split(",").map((s) => s.trim()).filter(Boolean),
            attached: attached.split(",").map((a) => a.trim()).filter(Boolean),
            unitLevel: Number(unitLevel) || 0,
            reprimands: Number(reprimands) || 0,
            reprimandsFrozen,
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
                    <h2 className="m-0 text-lg text-white font-bold">
                        {isEdit ? `Редактировать CID-${soldier!.cid}` : "Добавить бойца"}
                    </h2>
                    <button type="button" onClick={onClose} className="text-[var(--muted-foreground)] hover:text-white cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <SectionHeading>Идентификация</SectionHeading>

                {!isEdit && (
                    <label className="block mb-3">
                        <FieldLabel>CID</FieldLabel>
                        <input value={cid} onChange={(e) => setCid(e.target.value)} required className={`${inputClass} font-mono`} />
                    </label>
                )}

                <label className="block mb-3">
                    <FieldLabel>Steam ID (steamID64)</FieldLabel>
                    <input
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        placeholder="7656119..."
                        className={`${inputClass} font-mono`}
                    />
                </label>

                <label className="block mb-3">
                    <FieldLabel>Discord ID</FieldLabel>
                    <input
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="123456789012345678"
                        className={`${inputClass} font-mono`}
                    />
                </label>

                <label className="block mb-3">
                    <FieldLabel>Ссылка на аватар</FieldLabel>
                    <input value={avatar} onChange={(e) => setAvatar(e.target.value)} className={inputClass} />
                </label>

                <SectionHeading>Служба</SectionHeading>

                <label className="block mb-3">
                    <FieldLabel>Звание</FieldLabel>
                    <select value={rank} onChange={(e) => setRank(e.target.value)} className={inputClass}>
                        <option value="">— не назначено —</option>
                        {ranks
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.name}
                                </option>
                            ))}
                    </select>
                </label>

                <label className="block mb-3">
                    <FieldLabel>Позывной (override)</FieldLabel>
                    <input value={callsignOverride} onChange={(e) => setCallsignOverride(e.target.value)} className={inputClass} />
                </label>

                <label className="block mb-3">
                    <FieldLabel>Статус</FieldLabel>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block mb-3">
                    <FieldLabel>Дата вступления</FieldLabel>
                    <input type="date" value={joinDate ?? ""} onChange={(e) => setJoinDate(e.target.value)} className={`${inputClass} font-mono`} />
                </label>

                {status === "leave" && (
                    <label className="block mb-3">
                        <FieldLabel>В отпуске до</FieldLabel>
                        <input
                            type="date"
                            value={leaveUntil ?? ""}
                            onChange={(e) => setLeaveUntil(e.target.value)}
                            className={`${inputClass} font-mono`}
                        />
                    </label>
                )}

                {status === "reserve" && (
                    <label className="block mb-3">
                        <FieldLabel>В резерве до</FieldLabel>
                        <input
                            type="date"
                            value={reserveUntil ?? ""}
                            onChange={(e) => setReserveUntil(e.target.value)}
                            className={`${inputClass} font-mono`}
                        />
                    </label>
                )}

                <SectionHeading>Позиции и подразделения</SectionHeading>

                <label className="block mb-3">
                    <FieldLabel>Должности (через запятую)</FieldLabel>
                    <input value={positions} onChange={(e) => setPositions(e.target.value)} className={inputClass} />
                </label>

                <label className="block mb-3">
                    <FieldLabel>Отряды (через запятую)</FieldLabel>
                    <input value={squads} onChange={(e) => setSquads(e.target.value)} className={inputClass} />
                </label>

                <label className="block mb-3">
                    <FieldLabel>Прикомандирован к (через запятую)</FieldLabel>
                    <input value={attached} onChange={(e) => setAttached(e.target.value)} className={inputClass} />
                </label>

                <label className="block mb-4">
                    <FieldLabel>Уровень подразделения</FieldLabel>
                    <input
                        type="number"
                        min={0}
                        value={unitLevel}
                        onChange={(e) => setUnitLevel(Number(e.target.value))}
                        className={`${inputClass} font-mono`}
                    />
                </label>

                <SectionHeading>Дисциплина</SectionHeading>

                <div className="flex gap-3 mb-4">
                    <label className="flex-1">
                        <FieldLabel>Взыскания</FieldLabel>
                        <input
                            type="number"
                            min={0}
                            max={3}
                            value={reprimands}
                            onChange={(e) => setReprimands(Number(e.target.value))}
                            className={`${inputClass} font-mono`}
                        />
                    </label>
                    <label className="flex items-center gap-2 mt-6 font-mono text-xs text-[var(--muted-foreground)] cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={reprimandsFrozen}
                            onChange={(e) => setReprimandsFrozen(e.target.checked)}
                            className="accent-[var(--primary)]"
                        />
                        Заморожено ❄
                    </label>
                </div>

                <SectionHeading>Награды</SectionHeading>

                <div className="mb-4">
                    <div className="flex items-center justify-end mb-2">
                        <button type="button" onClick={addMedal} className="text-xs text-[var(--primary)] hover:underline cursor-pointer flex items-center gap-1">
                            <MedalIcon size={12} /> добавить
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {medals.map((m, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    value={m}
                                    onChange={(e) => updateMedal(i, e.target.value)}
                                    placeholder="Название медали"
                                    className="flex-1 px-3 py-1.5 bg-black/30 border border-[var(--border)] text-sm text-white outline-none focus:border-[var(--primary)] font-mono transition-colors"
                                />
                                <button type="button" onClick={() => removeMedal(i)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs">{error}</div>
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
