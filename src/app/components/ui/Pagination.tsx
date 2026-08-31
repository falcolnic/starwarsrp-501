import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(totalItems, currentPage * itemsPerPage);

    return (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]/40">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Показано: {startItem}–{endItem} из {totalItems}
            </span>
            
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronLeft size={14} /> Пред
                </button>
                
                <span className="font-mono text-xs text-[var(--muted-foreground)]">
                    {currentPage} / {totalPages}
                </span>
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    След <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
