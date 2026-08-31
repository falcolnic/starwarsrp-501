import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { ZergEntry } from "../../../data/zergs";
import { DangerBadge } from "./DangerBadge";

export function ZergCard({ entry }: { entry: ZergEntry }) {
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <div className="border" style={{ borderColor: "var(--border)", background: "rgba(18,32,59,0.4)" }}>
            <div 
                onClick={() => setOpen(!open)} 
                className="w-full flex items-center gap-4 p-4 text-left cursor-pointer hover:bg-white/5 transition-colors"
            >
                <div
                    onClick={(e) => {
                        if (entry.image) {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }
                    }}
                    className={`w-20 h-20 shrink-0 flex items-center justify-center border font-mono text-[0.65rem] bg-black/40 ${
                        entry.image ? "cursor-zoom-in hover:border-white/50 transition-colors" : ""
                    }`}
                    style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                    {entry.image ? (
                        <img src={entry.image} alt={entry.name} className="w-full h-full object-contain" />
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
                        <DangerBadge level={entry.danger} />
                        <span className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                            {entry.hp.toLocaleString()} HP
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={18}
                    className="transition-transform shrink-0"
                    style={{ color: "var(--primary)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                />
            </div>

            {open && (
                <div className="px-4 pb-4 flex flex-col gap-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div>
                            <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                                Виды атак
                            </div>
                            <ul className="mt-1 flex flex-col gap-1">
                                {entry.attacks.map((a, i) => (
                                    <li key={i} className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        {a.type} — {a.damage} ({a.range})
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                                Рекомендации при контакте
                            </div>
                            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                {entry.recommendations}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="font-mono text-xs uppercase tracking-[0.1em]" style={{ color: "var(--primary)" }}>
                            Описание
                        </div>
                        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                            {entry.description}
                        </p>
                    </div>
                </div>
            )}
        </div>

        {isModalOpen && entry.image && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"
                onClick={() => setIsModalOpen(false)}
            >
                <div className="relative max-w-5xl w-full max-h-[90vh] flex justify-center">
                    <img 
                        src={entry.image} 
                        alt={entry.name} 
                        className="max-w-full max-h-[90vh] object-contain drop-shadow-2xl" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute -top-4 -right-4 p-2 bg-black/80 hover:bg-black text-white rounded-full border transition-colors cursor-pointer"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        )}
        </>
    );
}