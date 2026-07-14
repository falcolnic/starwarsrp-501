import { useState } from "react";
import { ChevronDown, ChevronUp, Award } from "lucide-react";
import { RANK_LADDER, getRankIndex, type Rank } from "../../../services/promotionRules";

interface RankLadderProps {
  currentRank: string;
  nextRank: Rank | null;
}

export function RankLadder({ currentRank, nextRank }: RankLadderProps) {
    const [showFullLadder, setShowFullLadder] = useState(false);
    const currentIdx = getRankIndex(currentRank);

    // Focus window variables (horizontal display centering around current rank)
    const windowSize = 5;
    const halfWindow = Math.floor(windowSize / 2);
    
    let startIdx = Math.max(0, currentIdx - halfWindow);
    let endIdx = Math.min(RANK_LADDER.length, startIdx + windowSize);
    
    if (endIdx - startIdx < windowSize) {
        startIdx = Math.max(0, endIdx - windowSize);
    }

    const focusedRanks = RANK_LADDER.slice(startIdx, endIdx);
    const careerPct = ((currentIdx + 1) / RANK_LADDER.length) * 100;

    return (
        <div className="space-y-6">
        <div className="bg-[#0c1424]/50 border border-[var(--border)]/30 rounded p-3 space-y-2">
            <div className="flex justify-between items-center text-sm font-mono tracking-wider">
                <span className="text-slate-400">
                    ТЕКУЩЕЕ ЗВАНИЕ: <strong className="text-[#F5C518] uppercase">{currentRank}</strong>
                </span>
                <span className="text-slate-400 hidden sm:inline">
                    ЦЕЛЬ: <strong className="text-[var(--primary)] uppercase">{nextRank ?? "МАКСИМУМ"}</strong>
                </span>
            </div>

            <div className="flex gap-1 h-3.5 w-full">
            {RANK_LADDER.map((rank, i) => {
                const isCompleted = i < currentIdx;
                const isCurrent = i === currentIdx;

                return (
                <div
                    key={rank}
                    title={`${i + 1}. ${rank}`}
                    className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                    isCurrent
                        ? "bg-[#F5C518] shadow-[0_0_10px_#F5C518] animate-pulse"
                        : isCompleted
                        ? "bg-[var(--primary)]"
                        : "bg-slate-950 border border-slate-800"
                    }`}
                />
                );
            })}
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 tracking-widest uppercase select-none">
                <span>Рядовой-рекрут (Звание 01)</span>
                <span className="text-white/70 font-semibold bg-[#111a2e] px-2 py-0.5 rounded border border-slate-800">
                    ПРОГРЕСС КАРЬЕРЫ: {Math.round(careerPct)}%
                </span>
                <span>Клон Маршал (Звание 23)</span>
            </div>
        </div>

        <div className="flex justify-between items-center border-b border-[var(--border)]/20 pb-2">
            <span className="font-display text-sm text-[var(--primary)] tracking-widest uppercase">
                Ближайшее окружение
            </span>
            <button
                onClick={() => setShowFullLadder(!showFullLadder)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#0c1424] hover:bg-[#121f35] border border-[var(--border)] hover:border-[var(--primary)] text-[11px] font-mono tracking-wider uppercase rounded transition-colors duration-150 cursor-pointer"
            >
                <Award size={13} className="text-[var(--primary)]" />
                <span>{showFullLadder ? "СВЕРНУТЬ ЛИСТ" : "ПОКАЗАТЬ ВСЕ ЗВАНИЯ"}</span>
                {showFullLadder ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
        </div>

        {!showFullLadder && (
            <div className="relative my-3 py-3">
            <div 
                className="absolute h-[2px] bg-slate-700/40"
                style={{ 
                top: "50%", 
                left: "10%", 
                right: "10%", 
                transform: "translateY(-50%)",
                zIndex: 0 
                }}
            />

            <div className="relative flex items-center justify-between">
                {focusedRanks.map((rank, relativeIdx) => {
                const originalIdx = startIdx + relativeIdx;
                const isPast = originalIdx < currentIdx;
                const isCurrent = originalIdx === currentIdx;
                const isNext = nextRank === rank;

                return (
                    <div key={rank} className="flex flex-col items-center flex-1 relative">
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap select-none">
                        {isCurrent && (
                        <span className="font-mono text-sm text-[#F5C518] tracking-widest uppercase font-bold animate-pulse">
                            ТЕКУЩИЙ РАНГ
                        </span>)}
                        {isNext && (
                        <span className="font-mono text-sm text-[var(--primary)] tracking-widest uppercase font-bold">
                            ЦЕЛЬ
                        </span>)}
                    </div>

                    <div className="w-8 h-8 flex items-center justify-center">
                        <div
                        title={rank}
                        className={`rotate-45 transition-all duration-300 ${
                            isCurrent 
                            ? "w-4 h-4 bg-[#F5C518] border-[#F5C518] shadow-[0_0_12px_#F5C518]" 
                            : isPast 
                            ? "w-2.5 h-2.5 bg-[var(--primary)] border-[var(--primary)] opacity-70"
                            : "w-2.5 h-2.5 bg-[#080d17] border border-[var(--border)]"
                        }`}
                        />
                    </div>

                    <div
                        className={`absolute top-8 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-xs tracking-wide text-center leading-tight w-[130px] select-none line-clamp-2 z-20 ${
                        isCurrent
                            ? "text-[#F5C518] font-bold scale-105"
                            : "text-slate-400"
                        }`}
                    >
                        {rank}
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        )}

        {showFullLadder && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 animate-fade-in">
            {RANK_LADDER.map((rank, i) => {
                const isPast = i < currentIdx;
                const isCurrent = i === currentIdx;
                const isNext = nextRank === rank;

                return (
                <div
                    key={rank}
                    className={`flex items-center gap-3 p-2.5 rounded border transition-colors duration-150 ${
                    isCurrent
                        ? "bg-[#F5C518]/10 border-[#F5C518] shadow-[0_0_10px_rgba(245,197,24,0.15)]"
                        : isNext
                        ? "bg-[var(--primary)]/5 border-[var(--primary)]/60"
                        : "bg-[#080d17]/40 border-[var(--border)]/40"
                    }`}
                >
                    <span className="font-mono text-[10px] text-[var(--muted-foreground)] shrink-0 min-w-[18px]">
                    {String(i + 1).padStart(2, "0")}
                    </span>

                    <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                        isCurrent
                        ? "bg-[#F5C518] animate-pulse"
                        : isPast
                        ? "bg-[var(--primary)]"
                        : "bg-[var(--border)]/40"
                    }`}
                    />

                    <span
                    className={`font-mono text-[11px] truncate ${
                        isCurrent ? "text-[#F5C518] font-bold" : isPast ? "text-white/80" : "text-white/40"
                    }`}
                    >
                    {rank}
                    </span>
                </div>
                );
            })}
            </div>
        )}

        </div>
    );
}