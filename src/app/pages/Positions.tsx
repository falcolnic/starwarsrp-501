import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Briefcase } from "lucide-react";
import { RoleCard } from "../components/positions/RoleCard";
import { departments } from "../../data/position";

export function Positions() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(departments[0].id);
    const refs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash && refs.current[hash]) {
        refs.current[hash]?.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(hash);
        }
    }, [location.hash]);

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
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8 text-white">
        <div className="border-b border-[var(--border)]/30 pb-4">
            <h1
            className="text-3xl lg:text-4xl font-bold tracking-[0.12em] uppercase m-0"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
            Должности и контракты
            </h1>
            <p className="font-mono text-base text-[var(--muted-foreground)] tracking-wider mt-1 uppercase">
            Данный раздел определяет должности, существующие внутри легиона
            </p>
        </div>

        <div
            className="sticky top-[70px] z-20 flex gap-1 border-b py-2 overflow-x-auto"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
        >
            {departments.map((d) => (
            <button
                key={d.id}
                onClick={() => goTo(d.id)}
                className="font-mono text-xs sm:text-sm uppercase tracking-[0.08em] px-3 sm:px-4 py-2 border-b-2 transition-all duration-150 cursor-pointer whitespace-nowrap"
                style={{
                color: active === d.id ? "var(--primary)" : "var(--muted-foreground)",
                borderColor: active === d.id ? "var(--primary)" : "transparent",
                }}
            >
                {d.navLabel}
            </button>
            ))}
        </div>

        {departments.map((department) => (
            <section
            key={department.id}
            id={department.id}
            ref={(el) => {
                refs.current[department.id] = el;
            }}
            className="scroll-mt-[140px] space-y-6 pt-6 border-t border-[var(--border)]/20 first:border-t-0 first:pt-0"
            >
            <div className="flex items-center gap-3 border-l-4 border-[var(--primary)] pl-3">
                <Briefcase className="text-[var(--primary)] shrink-0" size={20} />
                <h2 className="text-3xl font-bold tracking-[0.05em] uppercase font-display">{department.name}</h2>
            </div>

            {department.description && (
                <p className="text-base text-slate-400 font-mono leading-relaxed max-w-3xl">
                {department.description}
                </p>
            )}

            {department.note && (
                <div className="text-base font-mono border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3 rounded text-[var(--primary)]/90">
                {department.note}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {department.roles.map((role, i) => (
                <RoleCard key={i} role={role} />
                ))}
            </div>
            </section>
        ))}
        </div>
    );
}