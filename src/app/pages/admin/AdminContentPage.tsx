import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertTriangle, FileText, Sword, Code2, Archive, ShieldHalf, Radio } from "lucide-react";

const CONTENT_TABS = [
    { key: "oath_text", label: "Присяга", icon: <Sword size={16} /> },
    { key: "tab_charter", label: "Устав", icon: <FileText size={16} /> },
    { key: "tab_coding", label: "Кодировка", icon: <Code2 size={16} /> },
    { key: "tab_documents", label: "Документы", icon: <Archive size={16} /> },
    { key: "tab_equipment", label: "Снаряжение бойца", icon: <ShieldHalf size={16} /> },
    { key: "tab_radio", label: "Регламент рации", icon: <Radio size={16} />,hint: "HTML разметка для правил радиообмена." },
];

export function AdminContentPage() {
    const [contents, setContents] = useState<Record<string, string>>({});
    const [activeKey, setActiveKey] = useState<string>("oath_text");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        async function loadAll() {
            setLoading(true);
            try {
                const results: Record<string, string> = {};
                await Promise.all(
                    CONTENT_TABS.map(async (tab) => {
                        const res = await fetch(`/api/admin/content/${tab.key}`, { credentials: "include" });
                        if (res.ok) {
                            const data = await res.json();
                            results[tab.key] = data.content || "";
                        }
                    })
                );
                setContents(results);
            } catch (err) {
                console.error("Failed to load content", err);
            }
            setLoading(false);
        }
        loadAll();
    }, []);

    const handleContentChange = (val: string) => {
        setContents((prev) => ({ ...prev, [activeKey]: val }));
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const res = await fetch(`/api/admin/content/${activeKey}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: contents[activeKey] }),
                credentials: "include"
            });

            if (!res.ok) throw new Error();

            setStatus({ type: "success", msg: "Успешно сохранено" });
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus({ type: "error", msg: "Ошибка при сохранении" });
        }
        setSaving(false);
    };

    const activeTab = CONTENT_TABS.find((t) => t.key === activeKey)!;

    return (
        <div>
            <h1 className="m-0 text-white font-bold text-xl mb-6">Управление контентом</h1>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка данных...</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6 max-w-6xl items-start">
                    
                    {/* Navigation Menu */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                        {CONTENT_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveKey(tab.key); setStatus(null); }}
                                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors text-left border cursor-pointer ${
                                    activeKey === tab.key 
                                    ? "bg-[var(--primary)]/15 border-[var(--primary)]/50 text-[var(--primary)]" 
                                    : "bg-black/30 border-[var(--border)] text-[var(--muted-foreground)] hover:bg-white/5"
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 w-full bg-[var(--card)] border border-[var(--border)] p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-base font-bold m-0 text-[var(--foreground)]">
                                Редактирование: {activeTab.label}
                            </h2>
                            <button 
                                onClick={handleSave} 
                                disabled={saving}
                                className="flex shrink-0 items-center gap-2 px-4 py-2 bg-black/30 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer"
                            >
                                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
                            </button>
                        </div>

                        <textarea
                            value={contents[activeKey] || ""}
                            onChange={(e) => handleContentChange(e.target.value)}
                            className="w-full h-[500px] p-4 bg-black/30 border border-[var(--border)] font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors resize-y custom-scrollbar leading-relaxed"
                            spellCheck={false}
                        />
                        
                        {status && (
                            <div className={`flex items-center gap-2 p-3 border text-xs font-mono ${status.type === "success" ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"}`}>
                                {status.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                {status.msg}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}