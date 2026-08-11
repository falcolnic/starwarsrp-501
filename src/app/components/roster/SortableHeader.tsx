import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export type SortKey = "cid" | "callsign" | "rank" | "status";
export type SortDir = "asc" | "desc" | null;

interface SortableHeaderProps {
    label: string;
    col?: SortKey;
    sortKey: SortKey;
    sortDir: SortDir;
    onSort: (key: SortKey) => void;
}

export function SortableHeader({ label, col, sortKey, sortDir, onSort }: SortableHeaderProps) {
    if (!col) {
        return (
        <div className="px-2 py-2.5 font-mono text-sm tracking-[0.16em] text-[var(--muted-foreground)]">
            {label}
        </div>
        );
    }

    const active = sortKey === col && sortDir;

    return (
        <button
            onClick={() => onSort(col)}
            className={`w-full flex items-center px-2 py-2.5 font-mono text-sm tracking-[0.16em] whitespace-nowrap transition-colors ${
                active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
        >
        {label}
        {col !== sortKey ? (
            <ChevronsUpDown size={16} className="ml-1 opacity-30" />
        ) : sortDir === "asc" ? (
            <ChevronUp size={16} className="ml-1 text-[var(--primary)]" />
        ) : (
            <ChevronDown size={16} className="ml-1 text-[var(--primary)]" />
        )}
        </button>
    );
}