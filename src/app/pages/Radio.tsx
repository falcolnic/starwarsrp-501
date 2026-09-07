import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

export function RadioPage() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content/tab_radio")
            .then((res) => res.json())
            .then((data) => {
                setContent(data?.content || "<p class='text-slate-500'>Регламент еще не заполнен...</p>");
                setLoading(false);
            })
            .catch(() => {
                setContent("<p class='text-red-500'>Ошибка загрузки данных</p>");
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-[1000px] mx-auto py-10 px-4 flex flex-col gap-8 text-white min-h-screen">
            <div className="border-b border-[var(--border)]/30 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-center rounded">
                        <Radio className="text-[var(--primary)]" size={24} />
                    </div>
                    <div>
                        <h1
                            className="text-3xl lg:text-4xl font-bold tracking-[0.12em] uppercase m-0"
                            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
                        >
                            Регламент связи
                        </h1>
                        <p className="font-mono text-sm text-[var(--muted-foreground)] tracking-wider mt-1 uppercase">
                            ОБЩИЕ ПРАВИЛА РАДИООБМЕНА И ИСПОЛЬЗОВАНИЯ ЧАСТОТ
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)] py-10">Установка безопасного соединения...</div>
            ) : (
                <div 
                    className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed space-y-8 bg-[#080d17]/50 border border-slate-800/60 p-6 md:p-10 rounded shadow-xl"
                    dangerouslySetInnerHTML={{ __html: content }} 
                />
            )}
        </div>
    );
}
