import { useEffect, useRef, useState } from "react";
import { Terminal, X, Check } from "lucide-react";

const STORAGE_KEY = "trooper-pda-notes";
const SAVE_DEBOUNCE = 600;
const MAX_CHARS = 2000;

export function TrooperPDA() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [saved, setSaved] = useState(true);
    const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) setText(stored.slice(0, MAX_CHARS));
        } catch {
            console.warn("Anonymous")
        }
    }, []);

    useEffect(() => {
        if (open) {
        const t = setTimeout(() => textareaRef.current?.focus(), 150);
        return () => clearTimeout(t);
        }
    }, [open]);

    function handleChange(value: string) {
        const trimmed = value.slice(0, MAX_CHARS);
        setText(trimmed);
        setSaved(false);

        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_KEY, trimmed);
            setSaved(true);
        } catch {
            // storage переповнений або недоступний
        }
        }, SAVE_DEBOUNCE);
    }

    const remaining = MAX_CHARS - text.length;
    const counterColor = remaining <= 0 ? "#EF4444" : remaining <= 100 ? "#F5C518" : "var(--muted-foreground)";

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
        <div
            className="w-[320px] sm:w-[360px] flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ease-out"
            style={{
            background: "linear-gradient(180deg, #0d1829 0%, #080d17 100%)",
            border: "1px solid var(--primary)",
            boxShadow: "0 0 24px rgba(61,111,196,0.35), 0 8px 32px rgba(0,0,0,0.6)",
            clipPath:
                "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
            opacity: open ? 1 : 0,
            transform: open ? "scale(1) translateY(0)" : "scale(0.92) translateY(12px)",
            pointerEvents: open ? "auto" : "none",
            }}
        >
            <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: "var(--border)", background: "rgba(61,111,196,0.08)" }}
            >
            <div className="flex items-center gap-2">
                <Terminal size={24} style={{ color: "var(--primary)" }} />
                <span
                className="font-mono text-base uppercase tracking-[0.12em]"
                style={{ color: "var(--foreground)" }}
                >
                Личный датапад
                </span>
            </div>
            <button
                onClick={() => setOpen(false)}
                className="p-1 opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: "var(--muted-foreground)" }}
                aria-label="Закрыть датапад"
            >
                <X size={24} />
            </button>
            </div>

            <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            maxLength={MAX_CHARS}
            placeholder="> введите заметку..."
            className="w-full h-[220px] resize-none outline-none p-4 font-mono text-sm leading-relaxed"
            style={{
                background: "rgba(0,0,0,0.25)",
                color: "var(--foreground)",
                caretColor: "var(--primary)",
            }}
            />

            <div
            className="flex items-center justify-between px-4 py-2 border-t font-mono text-xs uppercase tracking-[0.1em]"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
            <span style={{ color: counterColor }}>
                {text.length} / {MAX_CHARS}
            </span>
            <span className="flex items-center gap-1" style={{ color: saved ? "#4ADE80" : "var(--primary)" }}>
                {saved ? (
                <>
                    <Check size={11} /> Сохранено
                </>
                ) : (
                "Сохранение..."
                )}
            </span>
            </div>
        </div>

        <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center w-13 h-13 transition-all hover:scale-105"
            style={{
            background: "linear-gradient(180deg, #12203B 0%, #0d1829 100%)",
            border: "1px solid var(--primary)",
            boxShadow: open ? "0 0 16px rgba(61,111,196,0.5)" : "0 0 8px rgba(61,111,196,0.25)",
            }}
            aria-label={open ? "Закрыть датапад" : "Открыть датапад"}
        >
            <div className="relative w-6 h-6">
            <X
                size={21}
                className="absolute inset-0 m-auto transition-all duration-200"
                style={{
                color: "var(--primary)",
                opacity: open ? 1 : 0,
                transform: open ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                }}
            />
            <Terminal
                size={24}
                className="absolute inset-0 m-auto transition-all duration-200"
                style={{
                color: "var(--primary)",
                opacity: open ? 0 : 1,
                transform: open ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
                }}
            />
            </div>
        </button>
        </div>
    );
}