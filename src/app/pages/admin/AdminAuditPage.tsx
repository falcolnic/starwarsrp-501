import { useEffect, useState, useMemo } from "react";
import { Search, Eye, X } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";

interface AuditLogRow {
    id: number;
    action: "create" | "update" | "delete";
    entityType: string;
    entityId: string;
    beforeData: any;
    afterData: any;
    createdAt: string;
    userId: number;
    userDisplayName: string | null;
}

const ACTION_COLORS = {
    create: "text-green-400 bg-green-400/10 border-green-400/30",
    update: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    delete: "text-red-400 bg-red-400/10 border-red-400/30",
};

const ACTION_LABELS = {
    create: "Создание",
    update: "Обновление",
    delete: "Удаление",
};

const ITEMS_PER_PAGE = 15;

export function AdminAuditPage() {
    const [logs, setLogs] = useState<AuditLogRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLog, setSelectedLog] = useState<AuditLogRow | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/audit", { credentials: "include" });
        if (res.ok) setLogs(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredLogs = useMemo(() => {
        if (!searchQuery.trim()) return logs;
        const lowerQuery = searchQuery.toLowerCase();
        
        return logs.filter(log => 
            log.entityType.toLowerCase().includes(lowerQuery) ||
            log.entityId.toLowerCase().includes(lowerQuery) ||
            (log.userDisplayName && log.userDisplayName.toLowerCase().includes(lowerQuery)) ||
            ACTION_LABELS[log.action].toLowerCase().includes(lowerQuery)
        );
    }, [logs, searchQuery]);

    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredLogs, currentPage]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1>Журнал аудита</h1>
                
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Поиск (сущность, автор, ID)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-black/30 border border-[var(--border)] font-mono text-xs outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                    />
                </div>
            </div>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-left font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                                <th className="py-2 px-4">Дата / Время</th>
                                <th className="py-2 px-4">Автор (Admin)</th>
                                <th className="py-2 px-4">Действие</th>
                                <th className="py-2 px-4">Тип сущности</th>
                                <th className="py-2 px-4">ID сущности</th>
                                <th className="py-2 px-4 text-right">Детали</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-6 text-center font-mono text-xs text-[var(--muted-foreground)]">
                                        Ничего не найдено
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="border-b border-[var(--border)]/40 hover:bg-white/5 transition-colors">
                                        <td className="py-2.5 px-4 font-mono text-xs text-[var(--muted-foreground)]">
                                            {new Date(log.createdAt).toLocaleString("ru-RU", { 
                                                day: '2-digit', month: '2-digit', year: 'numeric', 
                                                hour: '2-digit', minute: '2-digit', second: '2-digit' 
                                            })}
                                        </td>
                                        <td className="py-2.5 px-4 text-white">
                                            {log.userDisplayName || `User #${log.userId}`}
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <span className={`px-2 py-0.5 border text-[10px] uppercase tracking-wider font-mono ${ACTION_COLORS[log.action]}`}>
                                                {ACTION_LABELS[log.action]}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 font-mono text-sm text-[var(--primary)]">
                                            {log.entityType}
                                        </td>
                                        <td className="py-2.5 px-4 font-mono text-sm">
                                            {log.entityId}
                                        </td>
                                        <td className="py-2.5 px-4 text-right flex justify-end">
                                            <button 
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-1.5 px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-white border border-transparent hover:border-[var(--border)] bg-transparent hover:bg-black/30 transition-all cursor-pointer"
                                            >
                                                <Eye size={14} /> Данные
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredLogs.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {selectedLog && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" 
                    onClick={() => setSelectedLog(null)}
                >
                    <div 
                        className="w-full max-w-4xl bg-[var(--card)] border border-[var(--border)] flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]/60">
                            <div>
                                <h2 className="text-lg font-bold m-0 flex items-center gap-3">
                                    Детали операции
                                    <span className={`px-2 py-0.5 border text-[10px] uppercase tracking-wider font-mono ${ACTION_COLORS[selectedLog.action]}`}>
                                        {ACTION_LABELS[selectedLog.action]}
                                    </span>
                                </h2>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1 font-mono">
                                    {selectedLog.entityType} / ID: {selectedLog.entityId} / Автор: {selectedLog.userDisplayName}
                                </p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="text-[var(--muted-foreground)] hover:text-white cursor-pointer p-1">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-0 flex flex-col md:flex-row">
                            <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--border)]/60 bg-black/20">
                                <div className="p-2 border-b border-[var(--border)]/60 font-mono text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] text-center">
                                    Было (Before)
                                </div>
                                <pre className="p-4 m-0 text-xs font-mono text-red-300 overflow-x-auto whitespace-pre-wrap word-break-all">
                                    {selectedLog.beforeData ? JSON.stringify(selectedLog.beforeData, null, 2) : "Нет данных / Запись создана"}
                                </pre>
                            </div>

                            <div className="flex-1 bg-black/20">
                                <div className="p-2 border-b border-[var(--border)]/60 font-mono text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] text-center">
                                    Стало (After)
                                </div>
                                <pre className="p-4 m-0 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap word-break-all">
                                    {selectedLog.afterData ? JSON.stringify(selectedLog.afterData, null, 2) : "Нет данных / Запись удалена"}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}