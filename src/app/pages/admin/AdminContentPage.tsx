import { useEffect, useState } from "react";
import { Save, CheckCircle, AlertTriangle } from "lucide-react";

export function AdminContentPage() {
    const [oathText, setOathText] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/content/oath_text", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setOathText(data.content || "");
                }
            } catch (err) {
                console.error("Failed to load content", err);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const res = await fetch("/api/content/oath_text", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: oathText }),
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

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1>Управление контентом</h1>
            </div>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)]">Загрузка...</div>
            ) : (
                <div className="flex flex-col gap-4 max-w-4xl">
                    <div className="bg-[var(--card)] border border-[var(--border)] p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-base font-bold m-0 text-[var(--foreground)]">Текст присяги</h2>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1 font-mono">
                                    Используйте <span className="text-[var(--primary)] font-bold">{"{{npz}}"}</span> в месте, где должно быть поле ввода номера.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleSave} 
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black transition-colors text-xs font-mono uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={14} />
                                {saving ? "Сохранение..." : "Сохранить"}
                            </button>
                        </div>

                        <textarea
                            value={oathText}
                            onChange={(e) => setOathText(e.target.value)}
                            placeholder="Введите текст присяги..."
                            className="w-full h-64 p-4 bg-black/30 border border-[var(--border)] font-sans text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors resize-y custom-scrollbar"
                        />
                        
                        {status && (
                            <div className={`flex items-center gap-2 p-3 border text-xs font-mono ${
                                status.type === "success" 
                                    ? "bg-green-400/10 border-green-400/30 text-green-400" 
                                    : "bg-red-400/10 border-red-400/30 text-red-400"
                            }`}>
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
