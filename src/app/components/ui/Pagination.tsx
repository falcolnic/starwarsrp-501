import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] hidden sm:block">
                Показано: {startItem}–{endItem} из {totalItems}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted-foreground)] sm:hidden">
                {startItem}–{endItem} / {totalItems}
            </span>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    title="На первую страницу"
                    className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronsLeft size={16} />
                    <span className="hidden md:inline">Первая</span>
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Предыдущая страница"
                    className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Пред</span>
                </button>
                
                <span className="font-mono text-xs text-[var(--muted-foreground)] px-1 sm:px-2">
                    {currentPage} / {totalPages}
                </span>
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Следующая страница"
                    className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    <span className="hidden sm:inline">След</span>
                    <ChevronRight size={16} />
                </button>

                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title="На последнюю страницу"
                    className="flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[var(--primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors cursor-pointer"
                >
                    <span className="hidden md:inline">Последняя</span>
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}
