import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DroidEntry } from "../../../data/droids";
import { DangerBadge } from "./DangerBadge";

export function DroidCard({ entry }: { entry: DroidEntry }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border" style={{ borderColor: "var(--border)", background: "rgba(18,32,59,0.4)" }}>
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-4 text-left">
            <div
            className="w-16 h-16 shrink-0 flex items-center justify-center border font-mono text-[0.65rem]"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "rgba(0,0,0,0.3)" }}
            >
            {entry.image ? (
                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
            ) : (
                "PHOTO"
            )}
            </div>

            <div className="flex-1">
            <h3
                className="text-lg font-bold tracking-[0.05em]"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
                {entry.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
                <DangerBadge level={entry.dangerLevel} />
                <span className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                {entry.hp} HP
                </span>
            </div>
            </div>

            <ChevronDown
            size={18}
            className="transition-transform shrink-0"
            style={{ color: "var(--primary)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
        </button>

        {open && (
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                    Вооружение
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{entry.weapon}</p>
                </div>
                <div>
                <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                    Уровень защиты
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{entry.defenseLevel}</p>
                </div>
            </div>

            <div>
                <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                Тактика противодействия
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{entry.tactics}</p>
            </div>

            <div>
                <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                Особенности
                </div>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{entry.features}</p>
            </div>
            </div>
        )}
        </div>
    );
}