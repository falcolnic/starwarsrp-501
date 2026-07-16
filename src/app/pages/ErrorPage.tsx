import { Rocket } from "lucide-react";

export function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h2 className="text-[var(--primary)] m-0 font-display text-3xl tracking-[0.12em]">
                404 — СЕКТОР НЕ НАЙДЕН
            </h2>
            <p className="font-mono text-base text-[var(--muted-foreground)] m-0">
                Навигационная цель не существует в реестре.
            </p>
            <a href="/" className="inline-flex items-center gap-2 text-[var(--primary)] font-display tracking-[0.1em] text-[0.88rem] border border-[var(--primary)] px-6 py-2 no-underline hover:bg-[var(--primary)]/10 transition-all duration-150">
                <Rocket />
                ВЕРНУТСЯ НА БАЗУ
            </a>
        </div>
    );
}