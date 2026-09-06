import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const TAILWIND_SAFELIST = "grid-cols-1 lg:grid-cols-12 lg:col-span-7 lg:col-span-5 md:grid-cols-2 md:col-span-2 sm:grid-cols-2 scroll-mt-[140px] h-[500px] h-[450px] sm:w-[300px] h-[150px] sm:w-60 h-[230px] w-full md:w-36 h-32 md:w-32 lg:w-48 h-48";

const sections = [
    { id: "armor", label: "Броня бойца В.А.Р." },
    { id: "helmet", label: "Шлем и его возможности" },
    { id: "additional", label: "Дополнительное оснащение" },
];

export function Equipment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(sections[0].id);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/content/tab_equipment")
            .then((res) => res.json())
            .then((data) => {
                setContent(data?.content || "");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || !content) return;

        const hash = location.hash.replace("#", "");
        if (hash) {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActive(hash);
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-40% 0px -50% 0px" }
        );

        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [loading, location.hash, content]);

    function goTo(id: string) {
        navigate(`#${id}`, { replace: false });
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
    }

    return (
        <div className="max-w-[1400px] mx-auto py-10 flex flex-col gap-8 text-white">
            <div className="border-b border-[var(--border)]/30 pb-4">
                <h1
                    className="text-3xl lg:text-4xl font-bold tracking-[0.12em] uppercase m-0"
                    style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
                >
                    Снаряжение бойца
                </h1>
                <p className="font-mono text-base text-[var(--muted-foreground)] tracking-wider mt-1 uppercase">
                    СПЕЦИФИКАЦИЯ ЭКИПИРОВКИ ВЕЛИКОЙ АРМИИ РЕСПУБЛИКИ // КЛАССЫ ФАЗА II
                </p>
            </div>

            <div
                className="sticky top-[70px] z-20 flex gap-1 border-b py-2"
                style={{ background: "var(--background)", borderColor: "var(--border)" }}
            >
                {sections.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => goTo(s.id)}
                        className="font-mono text-sm sm:text-base uppercase tracking-[0.08em] px-3 sm:px-5 py-2 border-b-2 transition-all duration-150 cursor-pointer"
                        style={{
                            color: active === s.id ? "var(--primary)" : "var(--muted-foreground)",
                            borderColor: active === s.id ? "var(--primary)" : "transparent",
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="font-mono text-sm text-[var(--muted-foreground)] py-10">Синхронизация данных...</div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
        </div>
    );
}
