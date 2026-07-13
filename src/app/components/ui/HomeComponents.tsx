import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function HudButton({ icon, label, primary = false }: { icon: ReactNode; label: string; primary?: boolean }) {
    return (
        <div
        className={`flex items-center gap-[10px] py-[11px] px-[28px] text-[var(--foreground)] font-[var(--font-display)] text-[0.8rem] tracking-[0.12em] transition-all duration-200 cursor-pointer
            ${primary 
            ? "bg-[var(--primary)] border border-[var(--primary)] [clip-path:polygon(0_0,_calc(100%_-_10px)_0,_100%_10px,_100%_100%,_10px_100%,_0_calc(100%_-_10px))] shadow-[0_0_16px_rgba(61,111,196,0.35)] hover:shadow-[0_0_28px_rgba(61,111,196,0.55)]" 
            : "bg-transparent border border-[rgba(61,111,196,0.45)] hover:shadow-[0_0_16px_rgba(61,111,196,0.25)]"
            }`}
        >
        {icon}
        {label}
        </div>
    );
}

export function AccordionTab({ tab, index }: { tab: { id: string; label: string; icon: ReactNode; content: ReactNode }; index: number }) {
    const [open, setOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) setHeight(open ? contentRef.current.scrollHeight : 0);
    }, [open]);

    return (
        <div 
        style={{ animationDelay: `${index * 60}ms` }}
        className={`anim-fade-right border border-[var(--border)] transition-all duration-300
            ${open 
            ? "bg-[rgba(18,32,59,0.9)] shadow-[0_0_20px_rgba(61,111,196,0.12),_inset_0_0_30px_rgba(61,111,196,0.03)]" 
            : "bg-[rgba(13,24,41,0.5)]"
            }`}
        >
        <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center gap-[12px] padding-0 px-[20px] py-[15px] bg-transparent border-none cursor-pointer text-left relative overflow-hidden"
        >
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[rgba(61,111,196,0.06)] to-transparent transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
            <div className={`w-[3px] h-[22px] shrink-0 transition-all duration-300 ${open ? "bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" : "bg-[rgba(61,111,196,0.25)]"}`} />
            <div className={`shrink-0 transition-colors duration-200 ${open ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>{tab.icon}</div>
            <span className={`font-[var(--font-display)] text-[0.88rem] tracking-[0.1em] flex-1 transition-colors duration-200 ${open ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>{tab.label}</span>
            <div className={`transition-transform duration-300 cubic-bezier(0.34,1.56,0.64,1) ${open ? "rotate-180 text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>
            <ChevronDown size={16} />
            </div>
        </button>

        <div style={{ height }} className="overflow-hidden transition-[height] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <div ref={contentRef} className="pt-[4px] px-[20px] pb-[20px] pl-[55px] border-t border-[var(--border)]">
            {tab.content}
            </div>
        </div>
        </div>
    );
}

export function PlaceholderText({ lines = 4 }: { lines?: number }) {
    const sentences = [
        "501-й Элитный Штурмовой Легион является одним из ведущих подразделений быстрого реагирования в составе Великой Армии Республики, действующим на нескольких театрах военных действий под непосредственным надзором Совета Джедаев.",
        "Наше подразделение поддерживает высочайшие стандарты тактической подготовки, сплочённости и индивидуального мастерства — каждый боец обязан отстаивать ценности Республики в любом сражении.",
        "Основанный после Битвы при Геонозисе, 501-й отличился более чем в сорока крупных сражениях, получив высочайшие похвалы от Высшего командования.",
        "Набор, подготовка и продвижение осуществляются в строгом соответствии с протоколом, установленным постоянными приказами. Все военнослужащие обязаны полностью изучить настоящий документ и неукоснительно выполнять его требования.",
        "Цепочка командования спускается от Командующего через Командиров взводов к Командирам отделений, которые несут ответственность за готовность и дисциплину закреплённых за ними бойцов.",
        "Регулярные учения обязательны для всего действующего личного состава. Журналы посещаемости ведутся и учитываются при расчёте права на повышение в звании.",
    ];
    return (
        <div className="flex flex-col gap-[10px]">
        {sentences.slice(0, lines).map((s, i) => (
            <p key={i} className="font-sans text-[0.88rem] text-[var(--muted-foreground)] leading-[1.75] m-0">{s}</p>
        ))}
        <p className="font-[var(--font-mono)] text-[0.65rem] text-[rgba(143,163,192,0.3)] tracking-[0.08em] m-0 mt-[4px] border-t border-[var(--border)] pt-[8px]">
            [ЗАГЛУШКА — КЛИЕНТ ПРЕДОСТАВИТ ФИНАЛЬНЫЙ ТЕКСТ]
        </p>
        </div>
    );
}