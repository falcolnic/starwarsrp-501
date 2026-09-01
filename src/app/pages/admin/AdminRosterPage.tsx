import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Medal as MedalIcon, Search, Copy, Check } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";
import { SoldierFormModal } from "../../components/admin/SoldierFormModal";
import { Soldier, STATUS_LABELS } from "../../../services/soldierService";
import { Rank } from "../../../services/rankService";

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

    const handleCopy = (text: string, trackingId: string = text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(trackingId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredSoldiers = useMemo(() => {
        if (!searchQuery.trim()) return soldiers;
        const lowerQuery = searchQuery.toLowerCase();

        return soldiers.filter((s) => 
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
                                paginatedSoldiers.map((s) => {
                                    const callsign = s.callsignOverride || s.nickname || "—";
                                    const npzValue = `${s.cid} | ${callsign} | ${s.rank || "—"}`;
                                    const npzCopyId = `npz-${s.cid}`;

                                    return (
                                        <tr key={s.cid} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                            <td className="py-2.5 px-4 font-mono text-sm text-[var(--primary)]">
                                                <div
                                                    onClick={() => handleCopy(npzValue, npzCopyId)}
                                                    className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                                                    title="Скопировать НПЗ"
                                                >
                                                    <span>{s.cid}</span>
                                                    {copiedId === npzCopyId ? (
                                                        <Check size={12} className="text-green-500 shrink-0" />
                                                    ) : (
                                                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 text-white">
                                                <span
                                                    onClick={() => handleCopy(npzValue, npzCopyId)}
                                                    className="cursor-pointer hover:text-[var(--primary)] transition-colors hover:underline decoration-dashed underline-offset-4"
                                                    title="Скопировать НПЗ"
                                                >
                                                    {callsign}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-4 text-[var(--muted-foreground)]">{s.rank || "—"}</td>

                                            <td className="py-2.5 px-4 font-mono text-[var(--muted-foreground)]">
                                                {s.steamId ? (
                                                    <div 
                                                        onClick={() => handleCopy(s.steamId!)}
                                                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
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

                                            <td className="py-2.5 px-4 font-mono text-[var(--muted-foreground)]">
                                                {s.discordId ? (
                                                    <div 
                                                        onClick={() => handleCopy(s.discordId!)}
                                                        className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
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

                                            <td className="py-2.5 px-4 font-mono">{STATUS_LABELS[s.status] ?? s.status}</td>
                                            <td className="py-2.5 px-4">
                                                <ReprimandCell count={s.reprimands} frozen={s.reprimandsFrozen} />
                                            </td>
                                            <td className="py-2.5 px-4 font-mono text-[var(--primary)]">{s.medals?.length ?? 0}</td>
                                            <td className="py-2.5 px-4 flex gap-2 justify-end">
                                                <button onClick={() => setEditing(s)} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] cursor-pointer p-1">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(s.cid)} className="text-[var(--muted-foreground)] hover:text-red-400 cursor-pointer p-1">
                                                    <Trash2 size={15} />
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
