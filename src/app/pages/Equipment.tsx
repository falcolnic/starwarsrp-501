import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const sections = [
    { id: "armor", label: "Броня бойца В.А.Р." },
    { id: "helmet", label: "Шлем и его возможности" },
    { id: "additional", label: "Дополнительное оснащение" },
];

export function Equipment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(sections[0].id);
    const refs = useRef<Record<string, HTMLElement | null>>({});

    // скрол до секції при першому заході, якщо в URL вже є #hash
    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash && refs.current[hash]) {
        refs.current[hash]?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(hash);
        }
    }, []);

    // підсвічування активної секції під час скролу
    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
            });
        },
        { rootMargin: "-40% 0px -50% 0px" }
        );
        Object.values(refs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    function goTo(id: string) {
        navigate(`#${id}`, { replace: false });
        refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(id);
    }

    return (
        <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-col gap-8">
        <h1
            className="text-2xl font-bold tracking-[0.08em] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
        >
            Снаряжение бойца
        </h1>

        <div
            className="sticky top-[76px] z-10 flex gap-1 border-b py-3"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
        >
            {sections.map((s) => (
            <button
                key={s.id}
                onClick={() => goTo(s.id)}
                className="font-mono text-xs uppercase tracking-[0.08em] px-4 py-2 border-b-2 transition-colors"
                style={{
                color: active === s.id ? "var(--primary)" : "var(--muted-foreground)",
                borderColor: active === s.id ? "var(--primary)" : "transparent",
                }}
            >
                {s.label}
            </button>
            ))}
        </div>

        <section id="armor" ref={(el) => { refs.current.armor = el; }} className="flex flex-col gap-3 scroll-mt-[140px]">
            <h2
            className="text-lg font-bold tracking-[0.05em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
            Броня бойца В.А.Р.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {/* плейсхолдер під контент заказчика */}
            </p>
        </section>

        <section id="helmet" ref={(el) => { refs.current.helmet = el; }} className="flex flex-col gap-3 scroll-mt-[140px]">
            <h2
            className="text-lg font-bold tracking-[0.05em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
            Шлем и его возможности
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {/* плейсхолдер під контент заказчика */}
            </p>
        </section>

        <section id="additional" ref={(el) => { refs.current.additional = el; }} className="flex flex-col gap-3 scroll-mt-[140px]">
            <h2
            className="text-lg font-bold tracking-[0.05em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
            Дополнительное оснащение
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {/* плейсхолдер під контент заказчика */}
            </p>
        </section>
        </div>
    );
}