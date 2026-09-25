import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

import { CornerDecoration } from "../components/ui/HomeDecorations";
import { GlitchText } from "../components/GlitchText";

export function CharterPage() {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content/tab_charter")
        .then((res) => res.json())
        .then((data) => {
            setContent(data.content || "");
        })
        .catch((err) => {
            console.error("Ошибка при загрузке устава:", err);
            setContent("<div style='color: red;'>Ошибка соединения с базой данных.</div>");
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#080d17] relative flex flex-col px-6 py-12 md:px-12">
        <div className="fixed inset-0 pointer-events-none bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10" />
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#080d17_100%)] opacity-80" />

        <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col">
            {/* Кнопка возврата */}
            <div className="mb-8 anim-fade-down">
            <Link 
                to="/" 
                className="group inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-black/30 font-mono text-sm tracking-widest text-[var(--muted-foreground)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
                <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                ВЕРНУТЬСЯ К ТЕРМИНАЛУ
            </Link>
            </div>

            {/* Главный контейнер документа */}
            <div className="relative flex-1 bg-[rgba(11,17,27,0.8)] border border-[var(--border)] p-6 md:p-10 anim-fade-up">

            {/* Заголовок страницы */}
            <div className="mb-10">
                <div className="font-mono text-xs md:text-sm tracking-[0.2em] text-[var(--primary)] mb-3 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[var(--primary)]" />
                БАЗА ДАННЫХ // ДОКУМЕНТАЦИЯ
                </div>
                <GlitchText
                tag="h1"
                text="УСТАВ ПОДРАЗДЕЛЕНИЯ"
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "var(--foreground)",
                    margin: "0",
                    textTransform: "uppercase",
                }}
                glitchInterval={5000}
                />
                <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/30 to-transparent opacity-40" />
            </div>

            {/* Отрисовка контента из базы данных */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--primary)] opacity-70">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-sm tracking-widest animate-pulse">РАСШИФРОВКА ДАННЫХ...</p>
                </div>
            ) : (
                <div 
                className="prose prose-invert max-w-none font-sans text-[var(--muted-foreground)]"
                // Вставляем сырой HTML из базы данных (управляется админами)
                dangerouslySetInnerHTML={{ __html: content }} 
                />
            )}
            </div>
        </div>
        </div>
    );
}
